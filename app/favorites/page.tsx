"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
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

  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .eq("is_favorite", true)
      .order("created_at", { ascending: false });

    if (!error) setWords(data || []);
    setLoading(false);
  };

  // REMOVE FROM FAVORITES
  const removeFromFavorites = async (id: string) => {
    const { error } = await supabase
      .from("words")
      .update({ is_favorite: false })
      .eq("id", id);

    if (!error) {
      setWords((prev) => prev.filter((w) => w.id !== id));
      setAiResults((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // AI
  const handleAI = async (word: Word) => {
    try {
      setAiLoadingId(word.id);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.word }),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      setAiResults((prev) => ({
        ...prev,
        [word.id]: data.text,
      }));
    } catch (err) {
      setAiResults((prev) => ({
        ...prev,
        [word.id]: "Error loading AI 😢",
      }));
    } finally {
      setAiLoadingId(null);
    }
  };

  // CLOSE AI
  const closeAI = (id: string) => {
    setAiResults((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const playPronunciation = (word: string, id: string) => {
    try {
      setAudioLoadingId(id);

      // 🔥 FIX: stop overlapping / "gudva" voice
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);

      const voices = speechSynthesis.getVoices();

      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.includes("en-US") &&
            (v.name.toLowerCase().includes("google") ||
              v.name.toLowerCase().includes("microsoft"))
        ) ||
        voices.find((v) => v.lang.includes("en-US")) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.lang = "en-US";
      utterance.rate = 0.8;   // 🔥 clearer pronunciation
      utterance.pitch = 1.05;
      utterance.volume = 1;

      speechSynthesis.speak(utterance);
    } catch (err) {
      speechSynthesis.cancel();

      const fallback = new SpeechSynthesisUtterance(word);
      fallback.lang = "en-US";
      fallback.rate = 0.8;

      speechSynthesis.speak(fallback);
    } finally {
      setTimeout(() => setAudioLoadingId(null), 1000);
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
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition"
        >
          ← Dashboard
        </Link>
      </div>

      {/* EMPTY */}
      {words.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No favorite words yet
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
            <div className="flex gap-4">
              <h2 className="text-lg font-bold text-pink-300">
                {w.word}
              </h2>
              <button
                onClick={() => playPronunciation(w.word, w.id)}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 cursor-pointer"
              >
                <Volume2 size={14} />
                Listen
              </button>
            </div>

            <p className="text-gray-300 mt-2">
              {w.definition}
            </p>

            <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-pink-500 pl-3">
              {w.example}
            </p>

            {/* AI BUTTON */}
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleAI(w)}
                className="text-xs px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer"
              >
                Explain with AI
              </button>

              <button
                onClick={() => removeFromFavorites(w.id)}
                className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
              >
                Remove
              </button>
            </div>

            {/* AI LOADING */}
            {aiLoadingId === w.id && (
              <p className="text-xs text-purple-300 mt-3">
                AI thinking...
              </p>
            )}

            {/* AI RESULT */}
            {aiResults[w.id] && (
              <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3">

                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-green-300 uppercase tracking-wider">
                    AI Explanation
                  </span>

                  <button
                    onClick={() => closeAI(w.id)}
                    className="text-[10px] text-gray-400 hover:text-white"
                  >
                    ✕ Close
                  </button>
                </div>

                <p className="text-xs text-green-200">
                  {aiResults[w.id]}
                </p>

              </div>
            )}

          </div>
        ))}
      </div>

    </main>
  );
}