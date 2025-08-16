import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.SECRET || "wfsfs");
const client = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await client.user.findUnique({
      where: { username: body.username }
    });

    if (!user) {
      return NextResponse.json({ message: "User doesn't exist!", status: 400 });
    }

    const isMatched = await bcrypt.compare(body.password, user.password);

    if (!isMatched) {
      return NextResponse.json({ message: "Invalid credentials!", status: 400 });
    }

    const token = await new SignJWT({ username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(SECRET);

    (await cookies()).set("auth_token", token, { maxAge: 60 * 60 * 24 });

    return NextResponse.json({ message: "Successfully logged in!", status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: `Error: ${(error as Error).message}`,
      status: 500
    });
  }
}
