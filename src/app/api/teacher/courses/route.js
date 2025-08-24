import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course.model";
import Subtopic from "@/models/subtopic.model";
import Content from "@/models/content.model";
import SubjectChallenge from "@/models/subjectChallenge.model";
import MCQ from "@/models/mcq.model";
import { logActivity } from "@/lib/logActivity";
import { withAuth } from "@/middlewares/auth"; 
import User from "@/models/user.model";

// Original handler
async function createCourse(req, userId) {
  try {
    await dbConnect();

    const body = await req.json();

    // Optionally attach instructor = userId
    const course = await Course.create({
      ...body,
      instructor: userId, // teacher ID automatically from middleware
    });

    const user = await User.findById(userId)
     if (!user) {
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

     await logActivity(user._id,user.role,"Course Created" , course._id
      );

    return new Response(
      JSON.stringify({ success: true, data: course }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// GET handler remains public (or you can protect it if needed)
export async function GET(req) {
  try {
    await dbConnect();

    const courses = await Course.find()
      .populate({
        path: "subtopics",
        populate: { path: "contents", model: "Content" },
      })
      .populate({
        path: "challenges",
        populate: { path: "mcqs", model: "MCQ" },
      });

    return new Response(
      JSON.stringify({ success: true, data: courses }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}


export const POST = withAuth(createCourse);
