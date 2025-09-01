// app/api/leaderboard/updateRanks/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function GET(req) {
  await dbConnect();

  try {
    
    const users = await User.find().sort({ points: -1 });

    
    await Promise.all(
      users.map((u, i) => {
        u.classRank = i + 1;
        return u.save();
      })
    );

    
    const leaderboard = users
      .sort((a, b) => a.classRank - b.classRank)
      .map((u) => ({
        _id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        points: u.points,
        classRank: u.classRank,
        avatar: u.avatar || null,
      }));

    return new Response(JSON.stringify({ success: true, leaderboard }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
