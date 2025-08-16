"use client";
import React, { useState } from "react";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

export const Transfer = ({ secretKey }: { secretKey: string}) => {
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      if (!publicKey || !amount) {
        setError("Public key and amount are required.");
        return;
      }

      if (!secretKey) {
        setError("No seed provided. Please ensure a valid seed is set during signup.");
        return;
      }


      try {
        new PublicKey(publicKey);
      } catch {
        setError("Invalid public key format.");
        return;
      }

      const lamports = parseFloat(amount) * 1_000_000_000; // Convert SOL to lamports
      if (isNaN(lamports) || lamports <= 0) {
        setError("Please enter a valid amount.");
        return;
      }

      setError(null);
      setIsLoading(true);

      await sendSol({
        fromSecretKey: bs58.decode(secretKey),
        toPublicKey: publicKey,
        lamports: Math.floor(lamports),
      });

      setError("Transaction successful!");
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("Invalid secret key")
          ? "Invalid seed: must be a valid 64-byte Solana secret key."
          : err instanceof Error
          ? err.message
          : "Transaction failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendSol = async ({
    fromSecretKey,
    toPublicKey,
    lamports,
  }: {
    fromSecretKey: Uint8Array;
    toPublicKey: string;
    lamports: number;
  }) => {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const from = Keypair.fromSecretKey(fromSecretKey);
    const to = new PublicKey(toPublicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports,
      })
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = from.publicKey;

    const signature = await connection.sendTransaction(transaction, [from]);
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");

    return signature;
  };

  return (
    <div className="w-full min-h-auto">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-xs bg-red-600 border-4 border-red-300 rounded-2xl p-6 shadow-lg z-10">
          <h2 className="text-white text-xl font-semibold text-center mb-6 z-10">
            TRANSFER
          </h2>
          {error && (
            <p className="text-red-100 text-center mb-4" role="alert">
              {error}
            </p>
          )}
          <label htmlFor="publickey" className="sr-only">
            Public Key
          </label>
          <input
            id="publickey"
            type="text"
            className="w-full mb-4 bg-red-100 px-4 py-2 rounded-full text-black placeholder:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 z-10"
            placeholder="Public key"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value.trim())}
          />
          <label htmlFor="amount" className="sr-only">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.000000001"
            min="0"
            className="w-full mb-6 bg-red-100 px-4 py-2 rounded-full text-black placeholder:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 z-10"
            placeholder="Amount in SOL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="w-full py-3 text-red-600 bg-red-100 rounded-full font-semibold hover:bg-red-200 transition z-10"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};