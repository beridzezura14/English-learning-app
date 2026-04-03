"use client";

import { useState } from "react";
import { Edit3, Trash2, Star } from "lucide-react";

type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
  day_number: number;
  is_favorite?: boolean;
};

type Props = {
  day: string;
  words: Word[];
  onEdit: (w: Word) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, value: boolean) => void;
};

export default function DayAccordion({
  day,
  words,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const [open, setOpen] = useState(false);

  // 🔥 TOAST STATE
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (message: string) => {
    setToast({ show: true, message });

    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2000);
  };

  const getBadgeColor = () => {
    if (words.length < 5) {
      return "bg-red-500/20 text-red-300 border-red-500/30";
    } else if (words.length < 10) {
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
    return "bg-green-500/20 text-green-300 border-green-500/30";
  };

  return (
    <>
      {/* 🔥 GLOBAL TOAST (FIXED + MOBILE SAFE) */}
      {toast.show && (
        <div className="fixed top-5 left-0 right-0 flex justify-center z-[9999] px-4 pointer-events-none animate-slideDown">
          <div className="bg-black/80 border border-white/10 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-md text-sm">
            {toast.message}
          </div>
        </div>
      )}

      {/* CARD */}
      <div className="mb-5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 shadow-lg">

        {/* HEADER */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
              📅
            </div>

            <div className="text-left">
              <p className="font-semibold text-white">Day {day}</p>
              <p className="text-xs text-gray-400">
                Click to {open ? "collapse" : "expand"}
              </p>
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
          <div className="p-5 grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 bg-black/20">

            {words.map((w) => (
              <div
                key={w.id}
                className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-purple-500/30 transition"
              >

                {/* WORD + FAVORITE */}
                <div className="flex justify-between items-start gap-3">

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300">
                      {w.word}
                    </h3>

                    <p className="text-gray-300 text-sm mt-1">
                      {w.definition}
                    </p>
                  </div>

                  {/* ⭐ FAVORITE */}
                  <button
                    onClick={() => {
                      const newValue = !w.is_favorite;
                      onToggleFavorite(w.id, newValue);

                      showToast(
                        newValue
                          ? "Added to favorites"
                          : "Removed from favorites"
                      );
                    }}
                    className="text-gray-400 hover:text-yellow-400 transition"
                  >
                    <Star
                      size={18}
                      className={
                        w.is_favorite
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                      }
                    />
                  </button>
                </div>

                {/* EXAMPLE */}
                <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-purple-500 pl-3">
                  {w.example}
                </p>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-4 opacity-60 group-hover:opacity-100 transition">

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
    </>
  );
}