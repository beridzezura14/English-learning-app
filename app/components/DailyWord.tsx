"use client";

import { useEffect, useState } from "react";

type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
  day_number: number;
  user_id: string;
};

export default function DailyWord({ words }: { words: Word[] }) {
  const [dailyWord, setDailyWord] = useState<Word | null>(null);

  useEffect(() => {
    if (!words.length) return;

    const today = new Date();

    // 🔥 unique key for today
    const storageKey = `daily-word-${
      today.getFullYear()
    }-${today.getMonth() + 1}-${today.getDate()}`;

    // 🔥 check if already saved for today
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setDailyWord(JSON.parse(saved));
      return;
    }

    // 🔥 stable seed (same day = same word)
    const seed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();

    const index = seed % words.length;

    const selected = words[index];

    setDailyWord(selected);
    localStorage.setItem(storageKey, JSON.stringify(selected));
  }, [words]);

  if (!dailyWord) return null;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10 shadow-lg">
      <h2 className="text-lg text-purple-300 font-semibold mb-2">
        🌟 Word of the Day
      </h2>

      <h3 className="text-2xl font-bold text-white mb-2">
        {dailyWord.word}
      </h3>

      <p className="text-gray-300 mb-2">
        {dailyWord.definition}
      </p>

      {dailyWord.example && (
        <p className="text-sm text-gray-400 italic">
          “{dailyWord.example}”
        </p>
      )}
    </div>
  );
}