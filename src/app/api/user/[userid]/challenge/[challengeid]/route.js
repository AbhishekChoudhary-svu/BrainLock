import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import SubjectChallenge from "@/models/subjectChallenge.model";

export async function PUT(req, { params }) {
  await dbConnect();

  const { userid ,challengeid } = params;
  

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
    const challenge = await SubjectChallenge.findById(challengeid);
    if (!challenge) {
      return new Response(
        JSON.stringify({ success: false, message: "Challenge not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Check if already started
    const alreadyStarted = user.challenges.some(
      (c) => String(c.challengeId) === String(challengeid)
    );
    if (alreadyStarted) {
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

    return new Response(
      JSON.stringify({ success: true, message: "Challenge started" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
