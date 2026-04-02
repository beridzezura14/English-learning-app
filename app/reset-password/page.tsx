"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-4">

      <form
        onSubmit={handleReset}
        className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Password
        </h1>

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        {message && (
          <p className="text-green-400 text-sm mb-3">{message}</p>
        )}

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition font-semibold"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </form>
    </main>
  );
}