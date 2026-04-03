"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
  is_favorite: boolean;
};

export default function FavoritesPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .eq("is_favorite", true)
      .order("created_at", { ascending: false });

    if (!error) {
      setWords(data || []);
    }

    setLoading(false);
  };

  // ⭐ REMOVE FROM FAVORITES (NOT DELETE)
  const removeFromFavorites = async (id: string) => {
    const { error } = await supabase
      .from("words")
      .update({ is_favorite: false })
      .eq("id", id);

    if (!error) {
      // instant UI update
      setWords(prev => prev.filter(w => w.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading favorites...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-pink-300">
           Favorite Words
        </h1>

        <Link
          href="/dashboard"
          className="group flex items-center gap-2 px-4 py-2 rounded-xl
               bg-white/5 backdrop-blur-md border border-white/10
               text-gray-300 hover:text-white
               hover:bg-white/10 hover:border-white/20
               transition-all duration-300
               shadow-lg hover:shadow-purple-500/10
               hover:-translate-y-0.5"
        >
          <span className="text-lg group-hover:-translate-x-1 transition">
            ←
          </span>

          <span className="text-sm font-medium">Dashboard</span>
        </Link>
      </div>

      {/* EMPTY STATE */}
      {words.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No favorite words yet ⭐
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((w) => (
          <div
            key={w.id}
            className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-pink-500/30 transition"
          >
            {/* WORD */}
            <h2 className="text-lg font-bold text-pink-300">
              {w.word}
            </h2>

            {/* DEFINITION */}
            <p className="text-gray-300 mt-2">
              {w.definition}
            </p>

            {/* EXAMPLE */}
            <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-pink-500 pl-3">
              {w.example}
            </p>

            {/* ACTIONS */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-pink-400">
                ⭐ Favorite
              </span>

              <button
                onClick={() => removeFromFavorites(w.id)}
                className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
              >
                Remove
              </button>
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}