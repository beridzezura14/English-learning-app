"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit3, X, LogOut } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const [words, setWords] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [dayNumber, setDayNumber] = useState(1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔐 AUTH + FETCH
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);

      const { data: wordsData } = await supabase
        .from("words")
        .select("*")
        .eq("user_id", data.user.id)
        .order("day_number", { ascending: true });

      setWords(wordsData || []);
      setLoading(false);
    };

    init();
  }, []);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;

    return words.filter((w) => {
      const word = w.word?.toLowerCase() || "";
      const def = w.definition?.toLowerCase() || "";
      const example = w.example?.toLowerCase() || "";
      const q = search.toLowerCase();

      return word.includes(q) || def.includes(q) || example.includes(q);
    });
  }, [words, search]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];

    return words.filter((w) => {
      const q = search.toLowerCase();

      return (
        w.word?.toLowerCase().includes(q) ||
        w.definition?.toLowerCase().includes(q)
      );
    });
  }, [search, words]);

  // 📊 GROUP BY DAY
  const groupedWords = useMemo(() => {
    return filteredWords.reduce((acc: any, w: any) => {
      const day = w.day_number || 1;

      if (!acc[day]) acc[day] = [];
      acc[day].push(w);

      return acc;
    }, {});
  }, [filteredWords]);

  // 📈 STATS
  const level = Math.floor(words.length / 10) + 1;
  const totalProgress = Math.min((words.length / 2000) * 100, 100);

  const daySet = new Set(words.map((w) => w.day_number));

  let streak = 0;
  let day = 1;

  while (daySet.has(day)) {
    streak++;
    day++;
  }

  // ➕ ADD
  const addWord = async () => {
    await supabase.from("words").insert({
      word,
      definition,
      example,
      day_number: dayNumber,
      user_id: user.id,
    });

    resetForm();
    refresh();
  };

  // ✏️ UPDATE
  const updateWord = async () => {
    await supabase
      .from("words")
      .update({
        word,
        definition,
        example,
        day_number: dayNumber,
      })
      .eq("id", editingId);

    resetForm();
    refresh();
  };

  // 🗑 DELETE
  const deleteWord = async (id: string) => {
    await supabase.from("words").delete().eq("id", id);
    refresh();
  };

  // 🔄 REFRESH
  const refresh = async () => {
    const { data } = await supabase
      .from("words")
      .select("*")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true });

    setWords(data || []);
  };

  // RESET
  const resetForm = () => {
    setWord("");
    setDefinition("");
    setExample("");
    setDayNumber(1);
    setEditingId(null);
    setOpenModal(false);
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl">
        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Dashboard
          </h1>
          <span className="text-purple-300">{user?.user_metadata?.name}</span>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center rounded-xl
                        bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
                        transition"
          >
            <LogOut size={18} />
          </button>
          <Link
            href="/quiz"
            className="w-15 h-10 flex items-center justify-center rounded-xl
                        bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20
                        transition"
          >
            Quiz
          </Link>

          {/* ADD BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl
                 bg-purple-500 hover:bg-purple-600 transition"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
      {/* SEARCH */}
      <div ref={searchRef} className="relative mb-6">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search words..."
          className="w-full p-3 pl-10 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
        />

        <span className="absolute left-3 top-3 text-gray-400">🔍</span>

        {/* DROPDOWN */}
        {showDropdown && search.trim() && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl max-h-64 overflow-y-auto">
            {searchResults.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  setSearch(w.word); // ✔ სწორად არჩევს სიტყვას
                  setShowDropdown(false); // ✔ ხურავს dropdown-ს
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
      {/* STATS */}
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
          <h2 className="text-xl text-green-300 font-bold">{words.length}</h2>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{words.length}/2000</span>
        </div>

        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
          <div
            className="h-3 bg-purple-500 transition-all duration-500"
            style={{ width: `${totalProgress.toFixed(1)}%` }}
          />
        </div>
      </div>

      {/* EMPTY */}
      {words.length === 0 && (
        <div className="text-center text-gray-400 mt-20">No words yet 🚀</div>
      )}

      {/* DAYS */}
      {Object.keys(groupedWords).map((day) => (
        <DayAccordion
          key={day}
          day={day}
          words={groupedWords[day]}
          onEdit={(w: any) => {
            setEditingId(w.id);
            setWord(w.word);
            setDefinition(w.definition);
            setExample(w.example);
            setDayNumber(w.day_number);
            setOpenModal(true);
          }}
          onDelete={deleteWord}
        />
      ))}

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          {/* MODAL CARD */}
          <div className="relative w-[420px] max-w-[90%] bg-[#0f172a]/90 border border-white/10 rounded-2xl p-6 shadow-2xl animate-fadeIn">
            {/* CLOSE BUTTON */}
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

            {/* ACTION BUTTON */}
            <button
              onClick={editingId ? updateWord : addWord}
              className="w-full mt-5 py-3 rounded-xl font-semibold text-white
                        bg-gradient-to-r from-indigo-500 to-purple-500
                        hover:opacity-90 transition-all"
            >
              {editingId ? "Update Word" : "Add Word"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// 📅 ACCORDION
function DayAccordion({ day, words, onEdit, onDelete }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 shadow-lg">
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
            📅
          </div>

          <div className="text-left">
            <p className="font-semibold text-white">Day {day}</p>
            <p className="text-xs text-gray-400">Tap to expand words</p>
          </div>
        </div>

        {/* BADGE */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300 border border-white/10">
            {words.length} words
          </span>

          <span className="text-gray-400 text-lg">{open ? "−" : "+"}</span>
        </div>
      </button>

      {/* CONTENT */}
      {open && (
        <div className="p-5 grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 bg-black/20 animate-fadeIn">
          {words.map((w: any) => (
            <div
              key={w.id}
              className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl"
            >
              {/* WORD */}

              <div>
                <span className="font-bold text-lg text-white group-hover:text-purple-300">
                  {w.word}
                </span>
                <span> - </span>
                {/* DEFINITION */}
                <span className="text-lg text-gray-300 mt-1">
                  {w.definition}
                </span>
              </div>

              {/* EXAMPLE */}
              <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-purple-500 pl-3">
                {w.example}
              </p>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-4 opacity-60 group-hover:opacity-100 transition">
                <button
                  onClick={() => onEdit(w)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  onClick={() => onDelete(w.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition"
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
