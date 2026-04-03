"use client";

import {LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";


type User = {
  email?: string;
  user_metadata?: {
    name?: string;
  };
};

type HeaderProps = {
  user: User | null;
  logout: () => void;
  openModal: () => void;
};

export default function Header({
  user,
  logout,
  openModal,
}: HeaderProps) {
  const [openProfile, setOpenProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openPassword, setOpenPassword] = useState(false);

  // 🔐 CHANGE PASSWORD (SECURE FLOW)
  const handleChangePassword = async () => {
    setError("");
    setMessage("");

    if (!oldPassword || !newPassword) {
      setError("Please fill both fields");
      return;
    }

    setLoading(true);

    try {
      
      if (!user?.email) {
        setError("User session missing");
        setLoading(false);
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: oldPassword,
      });

      if (loginError) {
        setError("Old password is incorrect ❌");
        setLoading(false);
        return;
      }

      // 2. UPDATE PASSWORD
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Password updated successfully 🔐");
        setOldPassword("");
        setNewPassword("");
        setOpenProfile(false);
      }
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex justify-between items-center mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl">

      {/* LEFT SIDE */}
      <div className="relative">
        {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}

        {/* NAME */}
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-2 text-left 
                    px-3 py-1.5 rounded-xl
                    bg-white/5 hover:bg-white/10 
                    border border-white/10 
                    text-purple-300
                    transition duration-200"
        >
          {/* dot indicator */}
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

          {/* name */}
          <span className="font-medium">
            {user?.user_metadata?.name ?? "No name"}
          </span>

          {/* dropdown arrow */}
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              openProfile ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* PROFILE DROPDOWN */}
        {openProfile && (
          <div className="absolute left-0 mt-2 w-72 bg-[#0b1220] border border-white/10 rounded-xl shadow-xl p-4 z-50">

            {/* EMAIL */}
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-purple-300 mb-3">{user?.email}</p>

            <hr className="border-white/10 mb-3" />

            {/* TOGGLE PASSWORD */}
            <button
              onClick={() => setOpenPassword(!openPassword)}
              className="w-full flex justify-between items-center py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition mb-2"
            >
              <span className="text-sm">Change Password</span>

              <svg
                className={`w-4 h-4 transition-transform ${
                  openPassword ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* PASSWORD FORM (HIDDEN BY DEFAULT) */}
            {openPassword && (
              <div className="mt-2 space-y-2">

                {/* OLD PASSWORD */}
                <input
                  type="password"
                  placeholder="Old password"
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 outline-none"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                {/* NEW PASSWORD */}
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full p-2 rounded-lg bg-white/5 border border-white/10 outline-none"
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
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>

              </div>
            )}

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="w-full mt-3 py-2 rounded-lg bg-red-500 hover:opacity-90 transition"
            >
              Logout
            </button>

          </div>
        )}
      </div>

      {/* RIGHT ACTIONS */}

      <div className="flex gap-2">
        <Link href="/favorites">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl
                      bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 transition cursor-pointer"
          >
            ⭐
          </button>
        </Link>

        <Link href="/quiz">
          <button
            className="w-20 h-10 flex items-center justify-center rounded-xl
                      bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition cursor-pointer"
          >
            Quiz
          </button>
        </Link>

        <button
          onClick={openModal}
          className="w-10 h-10 flex items-center justify-center rounded-xl
                    bg-purple-500 hover:bg-purple-600 transition cursor-pointer"
        >
          <Plus size={18} />
        </button>

      </div>
    </div>
  );
}