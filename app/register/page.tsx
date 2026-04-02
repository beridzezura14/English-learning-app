"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("already")) {
        setError("This email is already registered. Please login instead.");
      } else if (msg.includes("invalid")) {
        setError("Invalid email or password format.");
      } else {
        setError(error.message);
      }
    } else {
      setSuccess("If an account exists, check your email to confirm it.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          Start learning words today
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-400"
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3">
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="text-green-400 text-sm mb-3">
            {success}
          </p>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition font-semibold"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}