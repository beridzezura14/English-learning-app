"use client";

import { useRef, useEffect } from "react";

type Word = {
  id: string;
  word: string;
  definition: string;
  day_number: number;
};

type Props = {
  search: string;
  setSearch: (v: string) => void;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  searchResults: Word[];
};

export default function SearchBar({
  search,
  setSearch,
  showDropdown,
  setShowDropdown,
  searchResults,
}: Props) {
  const searchRef = useRef<HTMLDivElement>(null);

  // ESC close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [setShowDropdown]);

  // CLICK OUTSIDE close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div ref={searchRef} className="relative mb-6">
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search words..."
        className="w-full p-3 pl-10 pr-10 rounded-xl xl:h-17.5 bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
      />

      {/* SEARCH ICON */}
      <span className="absolute left-3 top-6 text-gray-400">🔍</span>

      {/* CLEAR BUTTON */}
      {search && (
        <button
          onClick={() => {
            setSearch("");
            setShowDropdown(false);

            // დაბრუნდეს focus input-ზე
            const input = searchRef.current?.querySelector("input");
            input?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      )}

      {/* DROPDOWN */}
      {showDropdown && search.trim() && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {searchResults.map((w) => (
            <div
              key={w.id}
              onClick={() => {
                setSearch(w.word);
                setShowDropdown(false);
              }}
              className="p-3 hover:bg-white/10 cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{w.word}</p>
                <p className="text-xs text-gray-400">{w.definition}</p>
              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Day {w.day_number}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {showDropdown && search.trim() && searchResults.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl p-3 text-gray-400">
          No results found
        </div>
      )}
    </div>
  );
}