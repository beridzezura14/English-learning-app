"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
  day_number: number;
};

type Props = {
  day: string;
  words: Word[];
  onEdit: (w: Word) => void;
  onDelete: (id: string) => void;
};

export default function DayAccordion({
    day,
    words,
    onEdit,
    onDelete,
  }: Props) {
    const [open, setOpen] = useState(false);

  const getBadgeColor = () => {
    if (words.length < 5) {
      return "bg-red-500/20 text-red-300 border-red-500/30";
    } else if (words.length < 10) {
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    } else {
      return "bg-green-500/20 text-green-300 border-green-500/30";
    }
  };

  return (
    <div className="mb-5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 shadow-lg">
      
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 text-white font-bold">
            📅
          </div>

          <div className="text-left">
            <p className="font-semibold text-white">Day {day}</p>
            <p className="text-xs text-gray-400">Tap to expand words</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs rounded-full border ${getBadgeColor()}`}
          >
            {words.length} words
          </span>
          <span className="text-gray-400 text-lg">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>

      {/* CONTENT */}
      {open && (
        <div className="p-5 grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 bg-black/20 animate-fadeIn">
          {words.map((w) => (
            <div
              key={w.id}
              className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl"
            >
              <div>
                <span className="font-bold text-lg text-white group-hover:text-purple-300">
                  {w.word}
                </span>
                <span> - </span>
                <span className="text-lg text-gray-300">
                  {w.definition}
                </span>
              </div>

              <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-purple-500 pl-3">
                {w.example}
              </p>

              <div className="flex justify-end gap-3 mt-4 opacity-60 group-hover:opacity-100 transition">
                <button
                  onClick={() => onEdit(w)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  onClick={() => onDelete(w.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 size={16} className="text-red-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}