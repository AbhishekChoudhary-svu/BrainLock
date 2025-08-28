import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const roleAccess = {
  student: ["/Dashboard/StudentDashboard",
    "/Dashboard/ProfilePage"
  ],
  teacher: ["/Dashboard/StudentDashboard", "/Dashboard/TeacherDashboard","/Dashboard/ProfilePage"],
  admin: [
    "/Dashboard/StudentDashboard",
    "/Dashboard/TeacherDashboard",
    "/Dashboard/AdminDashboard",
    "/Dashboard/ProfilePage"
  ],
};

export async function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  if (!token) return NextResponse.redirect(new URL("/LoginPage", request.url));

  let payload;
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY_ACCESS_TOKEN);
    const verified = await jwtVerify(token, secret);
    payload = verified.payload;
  } catch {
    return NextResponse.redirect(new URL("/LoginPage", request.url));
  }

  const role = payload?.role;
  const pathname = request.nextUrl.pathname;
  const allowedPaths = roleAccess[role] || [];

  if (!allowedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(allowedPaths[0] || "/LoginPage", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Dashboard/:path*", "/dashboard/:path*"],
};
