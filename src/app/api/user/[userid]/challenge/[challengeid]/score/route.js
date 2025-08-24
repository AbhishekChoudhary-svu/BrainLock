// PUT /api/user/:userid/challenge/:challengeid/score
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import SubjectChallenge from "@/models/subjectChallenge.model";
import { logActivity } from "@/lib/logActivity";

export async function PUT(req, { params }) {
  await dbConnect();
  const { userid, challengeid } = params;
  const { score } = await req.json();

  console.log(userid)

  try {
    const user = await User.findById(userid);
    if (!user)
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );

    const challengeEntry = user.challenges.find(
      (c) => String(c.challengeId) === challengeid
    );
    if (!challengeEntry)
      return new Response(
        JSON.stringify({ success: false, message: "Challenge not started" }),
        { status: 400 }
      );

    // Get challenge with populated MCQs
    const challenge = await SubjectChallenge.findById(challengeid).populate("mcqs");
    if (!challenge)
      return new Response(
        JSON.stringify({ success: false, message: "Challenge not found" }),
        { status: 404 }
      );

    const totalPoints = challenge.mcqs.length * 5; // 5 points per question
    const newProgress = Math.min((score / totalPoints) * 100, 100);

    // --- Prevent duplicate increments ---
    const oldScore = challengeEntry.score || 0;
    const oldProgress = challengeEntry.progress || 0;

    // Update challenge entry (keep max values)
    challengeEntry.score = Math.max(score, oldScore);
    challengeEntry.progress = Math.max(newProgress, oldProgress);
    challengeEntry.status =
      challengeEntry.progress === 100 ? "completed" : "active";
    challengeEntry.completedAt =
      challengeEntry.progress === 100 ? new Date() : null;

    
    if (score > oldScore) {
      user.points += score - oldScore;
    }

    
    if (newProgress > oldProgress && challenge.course) {
      const courseEntry = user.courses.find(
        (c) => String(c.courseId) === String(challenge.course)
      );

      if (courseEntry) {
        // Contribution weight (example: each challenge = max 50%)
        const newContribution = (newProgress / 100) * 50;
        const oldContribution = (oldProgress / 100) * 50;

        const diff = newContribution - oldContribution;

        if (diff > 0) {
          courseEntry.progress = Math.min(courseEntry.progress + diff, 100);

          if (courseEntry.progress === 100) {
            courseEntry.status = "completed";
            await logActivity(user._id, user.role, "Course Completed", courseEntry._id);
          } else {
            courseEntry.status = "active";
          }
        }
      }
    }

    await user.save();

      
    const action =
      challengeEntry.progress === 100
        ? "Completed Challenge"
        : "Updated Challenge Progress";

    await logActivity(user._id, user.role, action, challenge.course, challenge._id, {
      score: challengeEntry.score,
      progress: challengeEntry.progress,
      totalPoints: user.points,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Score updated",
        progress: challengeEntry.progress,
        totalPoints: user.points,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
