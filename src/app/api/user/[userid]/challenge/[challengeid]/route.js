import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import SubjectChallenge from "@/models/subjectChallenge.model";
import Course from "@/models/course.model";

export async function PUT(req, { params }) {
  await dbConnect();

  const { userid ,challengeid } = await params;
  

  try {
    // 1. Find user
    const user = await User.findById(userid);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }



    // 2. Find challenge
    const challenge = await SubjectChallenge.findById(challengeid)
    if (!challenge) {
      return new Response(
        JSON.stringify({ success: false, message: "Challenge not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

     const course = await Course.findById(challenge.course).populate("subtopics")
        if (!course) {
          return new Response(
            JSON.stringify({ success: false, message: "Course not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        // 3. Find enrolled course
        const userCourse = user.courses.find(
          (c) => String(c.courseId) === String(challenge.course)
        );

    // 3. Check if already started
   if (userCourse.completedChallenges.includes(challengeid)) {
  return new Response(
        JSON.stringify({ success: true, message: "Challenge already started" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
}
    
    // 4. Add challenge to user
    user.challenges.push({
      challengeId: challenge._id,
      status: "active",
      progress: 0,
      score: 0,
      attempts: 0,
      startedAt: new Date(),
    });

    await user.save();

   

        // 4. Ensure arrays exist
    if (!userCourse.completedChallenges) userCourse.completedChallenges = [];

    // 5. Prevent duplicate
    if (userCourse.completedChallenges.includes(challengeid)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Subtopic already completed",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    userCourse.completedChallenges.push(challengeid);

    const totalChallenges = course.challenges.length || 1;
    const completedChallenges = userCourse.completedChallenges.length || 0;

    // Recalculate total progress
    const totalSubtopics = course.subtopics.length || 1;
    const completedSubtopics = userCourse.completedSubtopics?.length || 0;

    const subtopicProgress = (completedSubtopics / totalSubtopics) * 25;
    const challengeProgress = (completedChallenges / totalChallenges) * 25;

    userCourse.progress = Math.min(subtopicProgress + challengeProgress, 100);


    if (userCourse.progress >= 100) {
      userCourse.status = "completed";
    } else {
      userCourse.status = "active";
    }
  
   await user.save();



    return new Response(
      JSON.stringify({ success: true, message: "Challenge started",data:user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
