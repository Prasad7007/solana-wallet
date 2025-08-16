import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";

const client = new PrismaClient();

export async function POST(req:NextRequest) {
    try {
        const body = await req.json();
        const user = await client.user.update({
            where: {
                username: body.username
            },
            data: {
                accountCount: body.count
            }
        })

        if(!user) {
            return NextResponse.json({
                message: "User invalid!",
                status: 400
            })
        }

        return NextResponse.json({
            message: "Successfully incremented!",
            status: 200
        })

    } catch(error) {
        return NextResponse.json({
            message: `Error: ${error}`,
            status: 500
        })
    }

}