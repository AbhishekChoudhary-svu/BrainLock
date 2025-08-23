// app/api/leaderboard/updateRanks/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

// export async function PUT() {
//   await dbConnect();

//   try {
//     // get all users sorted by points (highest first)
//     const users = await User.find().sort({ points: -1 });

//     // update classRank for each user
//     await Promise.all(
//       users.map((user, index) => {
//         user.classRank = index + 1; // rank starts from 1
//         return user.save();
//       })
//     );

//     return new Response(
//       JSON.stringify({ success: true, message: "Class ranks updated ✅" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, error: error.message }),
//       { status: 500 }
//     );
//   }
// }


// export async function GET() {
//   await dbConnect();

//   try {
//     // fetch all users sorted by classRank (1 = top)
//     const users = await User.find().sort({ classRank: 1 }).select("name points classRank");

//     return new Response(
//       JSON.stringify({ success: true, users }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, error: error.message }),
//       { status: 500 }
//     );
//   }
// }



export async function GET(req) {
  await dbConnect();

  try {
    // Get all users sorted by points
    const users = await User.find().sort({ points: -1 });

    // Update their ranks
    await Promise.all(
      users.map((u, i) => {
        u.classRank = i + 1;
        return u.save();
      })
    );

    // Return sorted leaderboard (by rank)
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
