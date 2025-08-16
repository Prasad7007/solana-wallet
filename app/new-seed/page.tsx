"use client";
// import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { SeedState } from "@/atoms/Seed";
import axios from "axios";

export default function NewSeed() {
  const [mnemonic, setMnemonic] = useState<string[] | null>(null);
  const [seed, setSeed] = useAtom(SeedState);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const getPhrases = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get-seed`);
        const { phrases, seed: seedString } = response.data;
        setMnemonic(phrases); 
        setSeed(seedString);
      } catch (error) {
        setError("Failed to fetch or validate seed: " + (error instanceof Error ? error.message : "Unknown error"));
        console.error("Failed to fetch seed:", error);
      }
    };
    getPhrases();
  }, [setSeed]);

  if (!isMounted) return null;

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
      {mnemonic ? (
        <div className="w-full max-w-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mnemonic.map((word, index) => (
              <div
                key={index}
                className="bg-red-900 text-white font-mono text-md rounded-lg py-3 px-4 flex items-center justify-center text-center shadow-sm"
              >
                <span className="opacity-70 mr-2">{index + 1}.</span> {word}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-slate-400">Loading mnemonic...</p>
      )}
      <div>
        <button
          className="opacity-70 text-black bg-white text-lg font-semibold px-16 py-1 rounded-lg"
          onClick={() => router.push("/signup")}
          disabled={!mnemonic || !seed}
        >
          Next
        </button>
      </div>
    </div>
  );
}