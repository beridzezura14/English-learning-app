"use client";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Stats from "../components/Stats";
import ProgressBar from "../components/ProgressBar";
import WordModal from "../components/WordModal";
import DayAccordion from "../components/DayAccordion";
import DailyWord from "../components/DailyWord";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
  day_number: number;
  user_id: string;
  is_favorite?: boolean;
  created_at?: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [words, setWords] = useState<Word[]>([]);
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

  // 🔐 INIT (ONLY ONCE)
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
        .order("day_number", { ascending: true })
        .order("created_at", { ascending: true });

      setWords(wordsData || []);
      setLoading(false);
    };

    init();
  }, []);

  // ➕ ADD (LOCAL STATE ONLY)
  const addWord = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("words")
      .insert({
        word,
        definition,
        example,
        day_number: dayNumber,
        user_id: user.id,
        is_favorite: false,
      })
      .select()
      .single();

    if (data) {
      setWords(prev => [...prev, data]);
    }

    resetForm();
  };

  // ✏️ UPDATE (LOCAL STATE)
  const updateWord = async () => {
    if (!editingId || !user) return;

    await supabase
      .from("words")
      .update({
        word,
        definition,
        example,
        day_number: dayNumber,
      })
      .eq("id", editingId)
      .eq("user_id", user.id);

    setWords(prev =>
      prev.map(w =>
        w.id === editingId
          ? { ...w, word, definition, example, day_number: dayNumber }
          : w
      )
    );

    resetForm();
  };

  // 🗑 DELETE (LOCAL STATE)
  const deleteWord = async (id: string) => {
    if (!user) return;

    await supabase
      .from("words")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    setWords(prev => prev.filter(w => w.id !== id));
  };

  // ⭐ FAVORITE (NO REFRESH)
  const toggleFavorite = async (id: string, value: boolean) => {
    if (!user) return;

    await supabase
      .from("words")
      .update({ is_favorite: value })
      .eq("id", id)
      .eq("user_id", user.id);

    setWords(prev =>
      prev.map(w =>
        w.id === id ? { ...w, is_favorite: value } : w
      )
    );
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

  // 🔎 SEARCH
  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;

    const q = search.toLowerCase();

    return words.filter(w =>
      w.word.toLowerCase().includes(q) ||
      w.definition.toLowerCase().includes(q) ||
      w.example.toLowerCase().includes(q)
    );
  }, [words, search]);

  // 📦 GROUP BY DAY
  const groupedWords = useMemo(() => {
    return filteredWords.reduce((acc: Record<number, Word[]>, w) => {
      const day = w.day_number || 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(w);
      return acc;
    }, {});
  }, [filteredWords]);

  // ⭐ STABLE DAY ORDER (IMPORTANT FIX)
  const sortedDays = useMemo(() => {
    return Object.keys(groupedWords)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedWords]);

  // 📊 STATS
  const level = Math.floor(words.length / 10) + 1;
  const totalProgress = Math.min((words.length / 2000) * 100, 100);

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
      <Header
        user={user}
        logout={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
        openModal={() => setOpenModal(true)}
      />

      {/* TOP */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        <DailyWord words={words} />

        <div className="flex flex-col gap-4">
          <SearchBar
            words={words ?? []}
            search={search}
            setSearch={setSearch}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />

          <Stats level={level} wordsCount={words.length} />
        </div>
      </div>

      {/* PROGRESS */}
      <ProgressBar
        wordsCount={words.length}
        target={2000}
        progress={totalProgress}
      />

      {/* EMPTY */}
      {words.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No words yet 🚀
        </div>
      )}

      {/* MODAL */}
      <WordModal
        open={openModal}
        editingId={editingId}
        word={word}
        definition={definition}
        example={example}
        dayNumber={dayNumber}
        setWord={setWord}
        setDefinition={setDefinition}
        setExample={setExample}
        setDayNumber={setDayNumber}
        resetForm={resetForm}
        onSubmit={editingId ? updateWord : addWord}
      />

      {/* DAYS (FIXED ORDER) */}
      {sortedDays.map(day => (
        <DayAccordion
          key={day}
          day={String(day)}
          words={groupedWords[day]}
          onEdit={(w) => {
            setEditingId(w.id);
            setWord(w.word);
            setDefinition(w.definition);
            setExample(w.example);
            setDayNumber(w.day_number);
            setOpenModal(true);
          }}
          onDelete={deleteWord}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </main>
  );
}