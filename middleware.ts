import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.SECRET || "wfsfs");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token");

  if (!token) {
    
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token.value, SECRET);

    // ✅ Optional: Validate `payload.username` or roles
    if (!payload || !payload.username) {
      return NextResponse.json({ message: "Invalid token", status: 401 });
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({
      message: `Error: ${(error as Error).message}`,
      status: 500
    });
  }
}

export const config = {
  matcher: ["/wallet"],
};
