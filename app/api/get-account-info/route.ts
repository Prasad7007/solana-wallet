import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

export async function POST(req:NextRequest) {
    try{
        const body = await req.json();

        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const publicKey = new PublicKey(body.publicKey);

        const accountInfo = await connection.getAccountInfo(publicKey);
        return NextResponse.json({
            message: "Success !",
            status: 200,
            info: accountInfo
        })
    } catch (error) {
        return NextResponse.json({
            message: `Error: ${error}`,
            status: 500
        })
    }
    

}