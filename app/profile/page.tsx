"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  // CHANGE PASSWORD
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // ⚠️ Supabase does NOT verify old password client-side
    if (!newPassword) {
      setError("Please enter new password");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    }

    setLoading(false);
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-4">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          My Profile
        </h1>

        {/* USER INFO */}
        <div className="mb-6 space-y-2 text-center">
          <p>
            <span className="text-gray-400">Name:</span>{" "}
            <span className="text-purple-300">
              {user?.user_metadata?.name}
            </span>
          </p>

          <p>
            <span className="text-gray-400">Email:</span>{" "}
            <span className="text-purple-300">
              {user?.email}
            </span>
          </p>
        </div>

        {/* CHANGE PASSWORD */}
        <form onSubmit={handleChangePassword} className="space-y-3">

          {/* OLD PASSWORD (UI ONLY) */}
          <input
            type="password"
            placeholder="Old password (optional UI only)"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-400"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          {/* NEW PASSWORD */}
          <input
            type="password"
            placeholder="New password"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-purple-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* SUCCESS */}
          {message && (
            <p className="text-green-400 text-sm">{message}</p>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition font-semibold"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-3 rounded-xl bg-red-500 hover:opacity-90 transition font-semibold"
        >
          Logout
        </button>

      </div>
    </main>
  );
}