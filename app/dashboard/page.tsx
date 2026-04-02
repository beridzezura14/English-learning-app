"use client";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Stats from "../components/Stats";
import ProgressBar from "../components/ProgressBar";
import WordModal from "../components/WordModal";
import DayAccordion from "../components/DayAccordion";



import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
// import { Trash2, Edit3, X } from "lucide-react";




type Word = {
  id: string;
  word: string;
  definition: string;
  example: string;
  day_number: number;
  user_id: string;
};

// type DayAccordionProps = {
//   day: string;
//   words: Word[];
//   onEdit: (w: Word) => void;
//   onDelete: (id: string) => void;
// };

export default function Dashboard() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const [words, setWords] = useState<Word[]>([]);
  const [user, setUser] = useState<{ id: string; user_metadata?: { name?: string } } | null>(null);
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
    return filteredWords.reduce((acc: Record<number, Word[]>, w: Word) => {
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
  let day = 1;

  while (daySet.has(day)) {
    day++;
  }

  // ➕ ADD
  const addWord = async () => {
    if (!user) return; // 👈 IMPORTANT GUARD

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
    if (!user) return; // 👈 IMPORTANT

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
    <main className="min-h-screen bg-linear-to-b from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white p-6">
      {/* HEADER */}
      <Header
        user={user}
        logout={logout}
        openModal={() => setOpenModal(true)}
      />
      {/* SEARCH */}

      <div className="grid lg:grid-cols-2 gap-4">
        <SearchBar
          search={search}
          setSearch={setSearch}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          searchResults={searchResults}
        />
        {/* STATS */}
        <Stats
          level={level}
          wordsCount={words.length}
        />

      </div>

      {/* PROGRESS */}
      <ProgressBar
        wordsCount={words.length}
        target={2000}
        progress={totalProgress}
      />
      {/* EMPTY */}
      {words.length === 0 && (
        <div className="text-center text-gray-400 mt-20">No words yet 🚀</div>
      )}


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

      {Object.keys(groupedWords).map((day) => (
        <DayAccordion
          key={day}
          day={day}
          words={groupedWords[Number(day)]}
          onEdit={(w) => {
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
    </main>
  );
}


