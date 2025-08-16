import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.SECRET || "wfsfs");
const client = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.username || !body.password) {
      return NextResponse.json({ message: "Missing username or password" }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const user = await client.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not created!", status: 500 });
    }

    // ✅ Sign JWT using jose
    const token = await new SignJWT({ username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(SECRET);

    (await cookies()).set("auth_token", token, { maxAge: 60 * 60 * 24 });

    return NextResponse.json({ message: "User created", status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: `Error: ${(error as Error).message}`,
      status: 500
    });
  }
}
