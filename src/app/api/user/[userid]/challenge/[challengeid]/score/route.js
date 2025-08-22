// PUT /api/user/:userid/challenge/:challengeid/score
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import SubjectChallenge from "@/models/subjectChallenge.model";

export async function PUT(req, { params }) {
  await dbConnect();
  const { userid, challengeid } = params;
  const { score } = await req.json();

  try {
    const user = await User.findById(userid);
    if (!user) 
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });

    const challengeEntry = user.challenges.find(c => String(c.challengeId) === challengeid);
    if (!challengeEntry) 
      return new Response(JSON.stringify({ success: false, message: "Challenge not started" }), { status: 400 });

    // Get challenge with populated MCQs
    const challenge = await SubjectChallenge.findById(challengeid).populate("mcqs");
    if (!challenge) 
      return new Response(JSON.stringify({ success: false, message: "Challenge not found" }), { status: 404 });

    const totalPoints = challenge.mcqs.length * 5; // 5 points per question

    // Calculate progress percentage
    const progress = Math.min((score / totalPoints) * 100, 100);

    challengeEntry.score = score;
    challengeEntry.progress = progress;
    challengeEntry.status = progress === 100 ? "completed" : "active";
    challengeEntry.completedAt = progress === 100 ? new Date() : null;

    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Score updated", progress }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
