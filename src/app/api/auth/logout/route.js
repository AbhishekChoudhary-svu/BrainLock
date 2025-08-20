import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the cookies by setting them to empty and expired
   await cookies().set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Immediately expire
      path: "/",
    });

  await  cookies().set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return new Response(
      JSON.stringify({ success: true, message: "Logged out successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
