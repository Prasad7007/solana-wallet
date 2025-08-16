"use client";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Sidebar } from "@/components/Sidebar";
import Logo from "@/components/Logo";
import axios from "axios";
import Image from "next/image";
import { Transfer } from "@/components/Transfer";
import bs58 from "bs58";
import * as ed25519 from "ed25519-hd-key";
import { Buffer } from "buffer";
import { Swap } from "@/components/Swap";
import { Token } from "@/components/Token";
import { Qrcode } from "@/components/Qrcode";
import { Buy } from "@/components/Buy"

export default function Wallet() {
  const [seed, setSeed] = useState<Uint8Array | null>(null);
  const [accounts, setAccounts] = useState<{ account: number; public_key: string; private_key: string }[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [main, setMain] = useState<number>(1);
  const [account, setAccount] = useState<{ account: number; public_key: string; private_key: string } | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [transferShow, setTransferShow] = useState<boolean>(false);
  const [tokenShow, setTokenShow] = useState<boolean>(false);
  const [buyShow, setBuyShow] = useState<boolean>(false);
  const [swapShow, setSwapShow] = useState<boolean>(false);
  const [qrShow, setQrShow] = useState<boolean>(false);
  const [publicKeyShow, setPublicKeyShow] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const acc = accounts.find((value) => value.account === main);
    setAccount(acc || null);
  }, [main, accounts]);

  useEffect(() => {
    const getAccountInfo = async () => {
      if (!account?.public_key) return;
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/get-account-info`, {
          publicKey: account.public_key,
        });
        setAmount(response.data.info?.lamports || 0);
      } catch {
        setError("Failed to fetch account balance");
      }
    };
    getAccountInfo();
  }, [account?.public_key]);

  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/get-account-count`, {
          username: localStorage.getItem("username"),
        });
        setIndex(response.data.count || 0);
      } catch {
        setError("Failed to fetch account count");
      }
    };
    getCount();
  }, []);

  useEffect(() => {
    const storedSeed = localStorage.getItem("seed");
    if (storedSeed) {
      try {
        const keyBytes = bs58.decode(storedSeed);
        console.log("Decoded seed length:", keyBytes.length); // Debug log
        setSeed(keyBytes);
      } catch (err) {
        setError("Failed to decode seed: " + (err instanceof Error ? err.message : "Unknown error"));
        setSeed(null);
      }
    } else {
      setError("No seed found in storage. Please sign up again.");
    }
  }, []);

  

  useEffect(() => {
    if (!seed) return;
    try {
      const group: { account: number; public_key: string; private_key: string }[] = [];

      for (let i = 0; i < index; i++) {
        const path = `m/44'/501'/${i}'/0'`;
        const derived = ed25519.derivePath(path, Buffer.from(seed).toString("hex"));
        const keypair = Keypair.fromSeed(derived.key); // derived.key is 32-byte private key
        group.push({ account: i + 1, public_key: keypair.publicKey.toBase58(), private_key: bs58.encode(keypair.secretKey) });
      }

      setAccounts(group);
    } catch (err) {
      setError("Failed to generate accounts: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  }, [index, seed]);


  const handleCreateAccount = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/increment-count`, {
        username: localStorage.getItem("username"),
        count: index + 1,
      });
      if (response.data) {
        setIndex((prev) => prev + 1);
      }
    } catch {
      setError("Failed to create new account");
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen z-40">
      <header className="px-5 py-4 border-b-2 border-b-red-300 rounded-b-2xl w-full">
        <div className="flex justify-between mx-auto">
          <div className="flex items-center justify-center" onClick={() => setShowSidebar(true)}>
            <Logo className="h-12 w-60 sm:h-16" ariaLabel="Wallet App Logo" />
          </div>
          <div className="flex justify-center items-center">
            <Button
              className="bg-red-500 hover:bg-red-600 rounded-full font-sans font-bold text-xl px-6 py-2"
              onClick={handleCreateAccount}
            >
              Create Account
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        {showSidebar && (
          <>
            <div className="fixed inset-0 bg-black/90 z-40" onClick={() => setShowSidebar(false)} />
            <Sidebar onClose={() => setShowSidebar(false)} Accounts={accounts} setMain={setMain}/>
          </>
        )}

        <div className="p-6 space-y-4 w-full max-w-4xl mx-auto">
          {error && (
            <p className="text-red-300 text-center mb-4" role="alert">
              {error}
            </p>
          )}
          <div className="flex space-x-2">
            <h2
              className="flex justify-center items-center text-xl font-bold mb-2 w-12 h-12 bg-red-500 rounded-lg border-2 border-red-200"
              onClick={() => setPublicKeyShow((e) => !e)}
            >
              <div className="mb-1">{`A${main}`}</div>
            </h2>
            {publicKeyShow && (
              <div className="p-2 ml-4 flex justify-center items-center text-lg font-bold mb-2 bg-red-500 rounded-lg border-2 border-red-200 break-all max-w-full">
                {account?.public_key}
              </div>
            )}
          </div>

          <div className="flex mt-12 mb-2">
            <div className="font-semibold text-6xl">
              {amount !== null ? "$ " + (amount / LAMPORTS_PER_SOL).toFixed(2) : "$ -- --"}
            </div>
            <div>{amount !== null && <div className="text-xl">SOL</div>}</div>
          </div>

          <div className="w-full mt-5">
            <div className="grid grid-cols-5 gap-2 w-full">
              <div
                className="flex justify-center items-center p-1 h-25 sm:h-30 bg-red-500 rounded-lg font-sans font-semibold border-2 border-red-200 cursor-pointer"
                onClick={() => {
                  setTransferShow((e) => !e);
                  setTokenShow(false);
                  setSwapShow(false);
                  setQrShow(false);
                  setBuyShow(false);
                }}
              >
                <Image src="/send-money.svg" alt="Send money" width={45} height={45} />
              </div>
              <div
                className="flex justify-center items-center p-1 h-25 sm:h-30 bg-red-500 rounded-lg font-sans font-semibold border-2 border-red-200 cursor-pointer"
                onClick={() => {
                  setTransferShow(false);
                  setTokenShow((e) => !e);
                  setSwapShow(false);
                  setQrShow(false);
                  setBuyShow(false);
                }}
              >
                <Image src="/bitcoin (1).png" alt="Tokens" width={50} height={50} />
              </div>
              <div
                className="flex justify-center items-center h-25 sm:h-30 bg-red-500 rounded-lg font-sans font-semibold border-2 border-red-200 cursor-pointer"
                onClick={() => {
                  setTransferShow(false);
                  setTokenShow(false);
                  setSwapShow((e) => !e);
                  setQrShow(false);
                  setBuyShow(false);
                }}
              >
                <Image src="/money-transfer-coin-arrow.svg" alt="Swap money" width={45} height={45} />
              </div>
              <div
                className="flex justify-center items-center h-25 sm:h-30 bg-red-500 rounded-lg font-sans font-semibold border-2 border-red-200 cursor-pointer"
                onClick={() => {
                  setTransferShow(false);
                  setTokenShow(false);
                  setSwapShow(false);
                  setQrShow((e) => !e);
                  setBuyShow(false);
                }}
              >
                <Image src="/qr.svg" alt="QR Code" width={45} height={45} />
              </div>
              <div
                onClick={() => {
                  setBuyShow((e) => !e);
                  setTransferShow(false);
                  setTokenShow(false);
                  setSwapShow(false);
                  setQrShow(false);
                }}
                className="flex justify-center items-center h-25 sm:h-30 bg-red-500 rounded-lg font-sans font-semibold border-2 border-red-200 cursor-pointer"
              >
                <Image src="/buy.svg" alt="Buy Token" width={55} height={55} />
              </div>
            </div>
          </div>

          {transferShow && <Transfer secretKey={account?.private_key ?? ""}/>}
          {tokenShow && <Token publicKey={account?.public_key ?? ""} />}
          {swapShow && <Swap />}
          {qrShow && <Qrcode value={account?.public_key ?? ""} />}
          {buyShow && <Buy walletAddress={account?.public_key ?? ""} />}
        </div>
      </div>
    </div>
  );
}