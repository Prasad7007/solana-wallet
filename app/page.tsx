"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/Button"
import Logo from '@/components/Logo';
import Image from 'next/image';

export default function Home() {
  const navigate = useRouter();
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-5 py-4 border-b-2 border-b-red-300 rounded-b-2xl w-full ">
        <div className="flex justify-between mx-auto">
          <Logo
              className="h-12 w-60 sm:h-16" // Responsive sizing
              ariaLabel="Wallet App Logo"
          />
          <div className="flex justify-center items-center">
            <Button className={"bg-red-500 hover:bg-red-600 rounded-full font-sans font-bold text-xl px-6 py-2 z-10"} onClick={() => navigate.push("/new-seed")}>
              Create Account
            </Button>
          </div>
        </div>
      </header>

      
      <div className="flex flex-col justify-center items-center min-h-80 sm:min-h-100 md:min-h-120">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-red-700/15 blur-3xl rounded-full z-0"></div>
        <Image src="/logoipsum-custom-logo.svg" alt="Wallet App Logo" width={10} height={10} className="w-80 h-30" priority/>
        <div className="z-10 text-center font-extralight text-lg sm:text-4xl md:text-6xl font-sans ">
          Create multiple solana wallet accounts
        </div>
        <div className="z-10 text-center font-extralight text-lg sm:text-4xl md:text-6xl font-sans ">
          crypto exhange made easy
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center space-y-1">
        <div className="text-xl md:text-3xl font-sans underline underline-offset-2">
          Already have account?
        </div>
        <Button className={"bg-red-500 rounded-full font-sans font-bold text-xl px-6 py-2 md:text-3xl md:px-8 md:py-3 "} onClick={() => navigate.push("/old-seed")}>
          Enter seed phrase
        </Button>
      </div>

    </div>
  )
}
