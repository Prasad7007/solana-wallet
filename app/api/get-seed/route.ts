import { NextResponse } from "next/server";
import * as bip39 from "bip39";

export async function GET() {
  const mnemonic = bip39.generateMnemonic();
  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);

  return NextResponse.json({
    phrases: mnemonic.split(" "),
    seed: seedBuffer.toString("hex")
  });
}
