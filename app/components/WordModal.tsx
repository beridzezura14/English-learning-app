"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  editingId: string | null;

  word: string;
  definition: string;
  example: string;
  dayNumber: number;

  setWord: (v: string) => void;
  setDefinition: (v: string) => void;
  setExample: (v: string) => void;
  setDayNumber: (v: number) => void;

  resetForm: () => void;
  onSubmit: () => void;
};

export default function WordModal({
  open,
  editingId,
  word,
  definition,
  example,
  dayNumber,
  setWord,
  setDefinition,
  setExample,
  setDayNumber,
  resetForm,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative w-105 max-w-[90%] bg-[#0f172a]/90 border border-white/10 rounded-2xl p-6 shadow-2xl animate-fadeIn">
        
        {/* CLOSE */}
        <button
          onClick={resetForm}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <X size={18} />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-white mb-1">
          {editingId ? "✏️ Edit Word" : "➕ Add New Word"}
        </h2>

        <p className="text-xs text-gray-400 mb-5">
          Fill in your vocabulary details
        </p>

        {/* INPUTS */}
        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
            placeholder="Word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
            placeholder="Definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
            placeholder="Example sentence"
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500 transition"
            placeholder="Day number"
            value={dayNumber}
            onChange={(e) => setDayNumber(Number(e.target.value))}
          />
        </div>

        {/* ACTION */}
        <button
          onClick={onSubmit}
          className="w-full mt-5 py-3 rounded-xl font-semibold text-white
          bg-linear-to-r from-indigo-500 to-purple-500
          hover:opacity-90 transition-all"
        >
          {editingId ? "Update Word" : "Add Word"}
        </button>
      </div>
    </div>
  );
}