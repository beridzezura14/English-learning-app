"use client";

import { useEffect, useState } from "react";

type Props = {
  level: number;
  wordsCount: number;
};

// ერთიანი timezone ფუნქცია
const getToday = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Tbilisi",
  }); // 2026-04-04
};

export default function Stats({ level, wordsCount }: Props) {
  const [streak, setStreak] = useState<number>(0);

  // INIT (mount-ზე ერთხელ)
  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const savedStreak = Number(localStorage.getItem("streak") || 0);

    const today = getToday();

    if (!lastVisit) {
      setStreak(1);
      localStorage.setItem("lastVisit", today);
      localStorage.setItem("streak", "1");
      return;
    }

    const diffDays = Math.floor(
      (new Date(today).getTime() - new Date(lastVisit).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      setStreak(savedStreak);
    } else if (diffDays === 1) {
      const newStreak = savedStreak + 1;
      setStreak(newStreak);
      localStorage.setItem("streak", String(newStreak));
    } else {
      setStreak(1);
      localStorage.setItem("streak", "1");
    }

    localStorage.setItem("lastVisit", today);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center h-23 pt-5">
        <p className="text-gray-400 text-[11px]">Level</p>
        <h2 className="text-xl text-purple-300 font-bold">{level}</h2>
      </div>

      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center h-23 pt-5">
        <p className="text-gray-400 text-[11px]">Streak</p>
        <h2 className="text-xl text-orange-300 font-bold">
          🔥 {streak}
        </h2>
      </div>

      <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center h-23 pt-5">
        <p className="text-gray-400 text-[11px]">Words</p>
        <h2 className="text-xl text-green-300 font-bold">
          {wordsCount}
        </h2>
      </div>
    </div>
  );
}