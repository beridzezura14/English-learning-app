"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
};

export default function DailyWord({ words }: { words: Word[] }) {
  const [dailyWord, setDailyWord] = useState<Word | null>(null);

  useEffect(() => {
    if (!words || words.length === 0) {
      setDailyWord(null);
      return;
    }

    const today = new Date();

    // 🔥 stable daily key (same for everyone)
    const seed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();

    const index = seed % words.length;

    setDailyWord(words[index]);
  }, [words]);


  const playPronunciation = (word: string) => {
    try {
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
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      speechSynthesis.speak(utterance);
    } catch (err) {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(word));
    }
  };
  // ❗ if no words at all
  if (!words || words.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-center">
        No words have been added yet 📚
        <br />
        Start by adding your first word 🚀
      </div>
    );
  }

  // ❗ safety fallback
  if (!dailyWord) return null;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10 shadow-lg">
      <h2 className="text-lg text-purple-300 font-semibold mb-2">
        🌟 Word of the Day
      </h2>
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-2xl font-bold text-white">
          {dailyWord.word}
        </h3>

        <button
          onClick={() => playPronunciation(dailyWord.word)}
          className="p-1 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2 cursor-pointer"
        >
          Listen <Volume2 size={16} className="text-blue-300" />
        </button>
      </div>

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