import jwt from "jsonwebtoken";
import cookie from "cookie";

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const cookies = req.headers.get("cookie"); // In app router API routes, req is a Request object
      if (!cookies) {
        return new Response(
          JSON.stringify({ message: "Unauthorized access. No token provided." }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.accessToken;

      if (!token) {
        return new Response(
          JSON.stringify({ message: "Unauthorized access. No token provided." }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

      // Call your actual handler with userId passed as second argument
      return await handler(req, decoded.id);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}
