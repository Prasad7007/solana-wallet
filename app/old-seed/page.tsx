"use client";
// import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAtom } from "jotai";
import { SeedState } from "@/atoms/Seed";
import * as bip39 from 'bip39';
import bs58 from "bs58";

export default function OldSeed() {
  const [inputs, setInputs] = useState<string[]>(Array(12).fill(""));
  const [, setSeed] = useAtom(SeedState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  }

  const onButtonClick = async() => {
    const mnemonic = inputs.join(" ").trim().toLowerCase();
    console.log("Mnemonic:", mnemonic);
    if(!bip39.validateMnemonic(mnemonic)) {
        setError("Invalid mnemonic phrase. Please check your inputs.");
        return;
    }

    try {
        const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
        setSeed(seedBuffer.toString("hex"));
        localStorage.setItem("seed", bs58.encode(seedBuffer));
        router.push("/signin");
    } catch (e) {
        setError("Failed to derive seed from mnemonic: ");
        console.error(e);
        return;
    }
  }


  return (
    <div className="bg-black min-h-screen flex flex-col justify-evenly items-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-red-700/15 blur-3xl rounded-full z-0"></div>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-200">Secret Recovery Phrase</h1>
        <p className="text-xl text-slate-400">Save these words in a safe place.</p>
        <p className="text-lg text-red-400 font-medium">Do not share them with anyone!</p>
      </div>
      {error && (
        <p className="text-red-300 text-center mb-4" role="alert">
          {error}
        </p>
      )}
      
        <div className="w-full max-w-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {inputs.map((value, i) => (
                <div key={i} className="bg-red-900 text-white font-mono text-md rounded-lg py-3 px-4 flex items-center justify-center text-center shadow-sm z-40">
                    <span className="text-red-400 font-semibold mr-2">{i + 1}.</span>
                    <input
                        key={i}
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(i, e.target.value)}
                        className=" sm:w-30 md:w-23"
                    />
                </div>
            ))}
          </div>
        </div>
      
      <div>
        <button
          className="opacity-70 text-black bg-white text-lg font-semibold px-16 py-1 rounded-lg"
          onClick={onButtonClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}