"use client";

import { useEffect, useState } from "react";

type Props = {
  level: number;
  wordsCount: number;
};

export default function Stats({ level, wordsCount }: Props) {
  const [streak, setStreak] = useState<number>(() => {
    // run only once on mount (NO side effects)
    if (typeof window === "undefined") return 0;

    const lastVisit = localStorage.getItem("lastVisit");
    const savedStreak = Number(localStorage.getItem("streak") || 0);

    if (!lastVisit) return 1;

    const today = new Date();
    const lastDate = new Date(lastVisit);

    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return savedStreak;
    if (diffDays === 1) return savedStreak + 1;

    return 1;
  });

  useEffect(() => {
    const today = new Date().toDateString();

    localStorage.setItem("lastVisit", today);
    localStorage.setItem("streak", String(streak));
  }, [streak]);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
        <p className="text-gray-400 text-[11px]">Level</p>
        <h2 className="text-xl text-purple-300 font-bold">{level}</h2>
      </div>

      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
        <p className="text-gray-400 text-[11px]">Streak</p>
        <h2 className="text-xl text-orange-300 font-bold">🔥 {streak}</h2>
      </div>

      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
        <p className="text-gray-400 text-[11px]">Words</p>
        <h2 className="text-xl text-green-300 font-bold">{wordsCount}</h2>
      </div>
    </div>
  );
}