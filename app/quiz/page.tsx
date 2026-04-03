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

// 🧠 SMART NORMALIZER
const normalize = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\(.*?\)/g, "") // remove brackets (აზრის/ემოციის)
    .replace(/[^\p{L}\s]/gu, "") // remove special chars
    .replace(/\s+/g, " ") // fix spaces
    .trim();
};

export default function QuizPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | boolean>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 📥 FETCH WORDS
  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase.from("words").select("*");

      if (!error && data) {
        setWords(data);

        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuizWords(shuffled.slice(0, 6));
      }

      setLoading(false);
    };

    fetchWords();
  }, []);

  const currentWord = quizWords[currentIndex];

  // 🧠 CHECK ANSWER (FIXED)
  const checkAnswer = () => {
    if (!currentWord) return;

    const correct = normalize(currentWord.definition);
    const userAnswer = normalize(answer);

    const isCorrect =
      correct === userAnswer ||
      correct.includes(userAnswer) ||
      userAnswer.includes(correct);

    setResult(isCorrect);

    if (isCorrect) {
      setCorrectCount((p) => p + 1);
    } else {
      setWrongCount((p) => p + 1);
    }
  };

  // 👉 NEXT QUESTION
  const nextQuestion = () => {
    setAnswer("");
    setResult(null);
    setCurrentIndex((prev) => prev + 1);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading words...
      </div>
    );
  }

  // 🚫 NO WORDS
  if (!quizWords.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No words found 🚫
      </div>
    );
  }

  // 🎉 FINISH
  if (currentIndex >= quizWords.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
        <div className="absolute top-4 right-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            ← Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold">🎉 Quiz Finished!</h1>

        <div className="text-lg">
          ✅ Correct: <span className="text-green-400">{correctCount}</span>
        </div>

        <div className="text-lg">
          ❌ Wrong: <span className="text-red-400">{wrongCount}</span>
        </div>

        <div className="text-sm text-gray-400">Total: {quizWords.length}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] text-white p-4">
      {/* BACK BUTTON */}
      <div className="absolute top-4 right-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          ← Dashboard
        </Link>
      </div>

      {/* QUIZ BOX */}
      <div className="w-full max-w-md bg-white/5 p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-4">Translate this word</h2>

        <div className="text-3xl text-purple-300 font-bold mb-6">
          {currentWord.word}
        </div>

        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 mb-3 outline-none"
          placeholder="ჩაწერე ქართული მნიშვნელობა"
        />

        <button
          onClick={checkAnswer}
          className="w-full bg-purple-500 p-3 rounded-xl mb-3"
        >
          Check
        </button>

        {result !== null && (
          <div className="mb-3">
            {result ? (
              <p className="text-green-400">✅ Correct!</p>
            ) : (
              <p className="text-red-400">
                ❌ Correct: {currentWord.definition}
              </p>
            )}

            <button
              onClick={nextQuestion}
              className="mt-2 text-sm text-purple-300 underline"
            >
              Next →
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          {currentIndex + 1} / {quizWords.length}
        </p>
      </div>
    </div>
  );
}
