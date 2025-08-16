"use client";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        username: username,
        password: password
    })
    const success = response.data.status === 200 ? true: false;
    if (success) {
      router.push("/wallet");
    } else {
      setError("Failed to Login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4 z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-red-700/15 blur-3xl rounded-full z-0"></div>
      <div className="w-full max-w-xs bg-red-600 border-4 border-red-300 rounded-2xl p-6 shadow-lg z-10">
        <h2 className="text-white text-xl font-semibold text-center mb-6 z-10">
          SIGN IN
        </h2>
        {error && (
          <p className="text-red-100 text-center mb-4" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full mb-4 bg-red-100 px-4 py-2 rounded-full text-black placeholder:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 z-10"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-required="true"
        />
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full mb-6 bg-red-100 px-4 py-2 rounded-full text-black placeholder:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 z-10"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-required="true"
        />
        <Button
          className="w-full py-3 text-red-600 bg-red-100 rounded-full font-semibold hover:bg-red-200 transition z-10"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}