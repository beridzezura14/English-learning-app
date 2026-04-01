"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function QuizPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [quizWords, setQuizWords] = useState<any[]>([]); // 👈 6 random words
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | boolean>(null);

  // 📊 SCORE
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 📥 FETCH WORDS
  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase.from("words").select("*");

      if (!error && data) {
        setWords(data);

        // 🎲 RANDOM 6 WORDS
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuizWords(shuffled.slice(0, 6));
      }

      setLoading(false);
    };

    fetchWords();
  }, []);

  const currentWord = quizWords[currentIndex];

  // 🧠 CHECK ANSWER
  const checkAnswer = () => {
    if (!currentWord) return;

    const correct = currentWord.definition.trim().toLowerCase();
    const userAnswer = answer.trim().toLowerCase();

    const isCorrect = correct === userAnswer;
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

  // 🎉 FINISH SCREEN
  if (currentIndex >= quizWords.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
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
      <div className="absolute top-4 right-4">
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
