"use client";

import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-200 flex items-center justify-center font-sans px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900/80 border border-gray-800 rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-white mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Log in to{" "}
          <span className="text-blue-500 font-semibold">ResumeGPT</span> and
          continue your AI journey.
        </p>

        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-md text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold text-white shadow-md"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
