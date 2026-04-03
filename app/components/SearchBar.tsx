"use client";

import { useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

type Word = {
  id: string;
  word: string;
  definition: string;
  day_number: number;
};

type Props = {
  words: Word[];
  search: string;
  setSearch: (v: string) => void;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
};

export default function SearchBar({
  words = [],
  search,
  setSearch,
  showDropdown,
  setShowDropdown,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // SAFE FILTER
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    return words.filter((w) =>
      w.word?.toLowerCase().includes(q)
    );
  }, [search, words]);

  // click outside close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full ">

      {/* INPUT WRAPPER */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search words..."
          className="w-full p-4 pl-12 pr-10 rounded-xl 
                     bg-white/5 border border-white/10 
                     text-white outline-none 
                     focus:border-purple-500 transition h-18"
        />

        {/* SEARCH ICON */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        {/* CLEAR (X BUTTON) */}
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setShowDropdown(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {showDropdown && search.trim() && (
        <div className="absolute w-full mt-2 bg-[#0f172a] 
                        border border-white/10 rounded-xl 
                        shadow-xl max-h-64 overflow-y-auto z-50">

          {searchResults.length > 0 ? (
            searchResults.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  setSearch(w.word);
                  setShowDropdown(false);
                }}
                className="p-3 cursor-pointer 
                           hover:bg-white/10 transition 
                           flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{w.word}</p>
                  <p className="text-xs text-gray-400">
                    {w.definition}
                  </p>
                </div>

                <span className="text-xs px-2 py-1 rounded-full 
                                 bg-purple-500/20 text-purple-300 
                                 border border-purple-500/30">
                  Day {w.day_number}
                </span>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-400 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}