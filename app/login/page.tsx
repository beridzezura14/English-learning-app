"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    setError("");
    setMessage("");
    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://learnenglish-vert.vercel.app/reset-password",
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }

    setResetLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-4">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          Login to continue
        </p>

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
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        {/* SUCCESS MESSAGE */}
        {message && (
          <p className="text-green-400 text-sm mb-3">{message}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FORGOT PASSWORD (BELOW BUTTON) */}
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={resetLoading}
          className="w-full mt-3 text-sm text-purple-400 hover:underline"
        >
          {resetLoading ? "Sending email..." : "Forgot password?"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Don’t have an account?{" "}
          <Link href="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>

      </form>
    </main>
  );
}