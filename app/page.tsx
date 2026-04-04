import Link from "next/link";
import { BookOpen, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* HERO TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Learn Languages <span className="text-purple-400">Daily</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-400 mt-5 text-base md:text-lg">
          Improve your vocabulary every day and become fluent faster. Build your
          knowledge step by step with a simple daily system.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition font-semibold"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition"
          >
            Register
          </Link>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid sm:grid-cols-3 gap-4 mt-12 text-left">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h3 className="font-semibold text-purple-300 flex items-center gap-2">
              <BookOpen size={25} />
              <span className="text-white">Daily Words</span> 
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Learn 10 new words every day
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h3 className="font-semibold text-purple-300 flex items-center gap-2">
              <Brain size={25} />
              <span className="text-white">Practice</span> 

            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Use examples to remember faster
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h3 className="font-semibold text-purple-300 flex items-center gap-2">
              <TrendingUp size={25} />
              <span className="text-white">Progress</span> 

            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Track your daily improvement
            </p>
          </div>
        </div>
        {/* HOW IT WORKS */}
        <div className="mt-14 text-left bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">
            How it works
          </h2>

          <div className="space-y-4 text-gray-300 text-sm">
            <div className="flex gap-3">
              <span className="text-purple-400">1.</span>
              <p>
                Learn the{" "}
                <span className="text-white font-medium">Daily Word</span> every
                day on your dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-purple-400">2.</span>
              <p>
                Save words to{" "}
                <span className="text-white font-medium">Favorites</span> to
                review them later.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-purple-400">3.</span>
              <p>
                Practice with{" "}
                <span className="text-white font-medium">Quizzes</span> to test
                your knowledge.
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-purple-400">4.</span>
              <p>
                Track your{" "}
                <span className="text-white font-medium">Progress</span> and
                improve every day.
              </p>
            </div>
            {/* AI FEATURE */}
            <div className="mt-10 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 p-6 rounded-2xl text-left">
              <h2 className="text-xl font-semibold text-purple-300 mb-3">
                AI Word Explainer
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed">
                Now you can use <span className="text-white font-medium">AI</span> to
                instantly explain any word in simple language. Just click on a word and
                get a clear meaning, example, and translation in seconds.
              </p>

              <div className="mt-4 text-sm text-gray-400 space-y-1">
                <p>✔ Simple explanations</p>
                <p>✔ Multi-language support (English, Georgian, etc.)</p>
                <p>✔ Fast AI-powered results</p>
              </div>
            </div>
            {/* PRONUNCIATION FEATURE */}
            <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 rounded-2xl text-left">
              <h2 className="text-xl font-semibold text-blue-300 mb-3">
                Pronunciation Support
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed">
                Every word includes a <span className="text-white font-medium">real-time pronunciation feature</span>.
                Click the speaker icon to hear how native speakers pronounce each word clearly and slowly.
              </p>

              <div className="mt-4 text-sm text-gray-400 space-y-1">
                <p>✔ Native-like English voice</p>
                <p>✔ Clear and slow pronunciation mode</p>
                <p>✔ One-click audio playback</p>
                <p>✔ Works across all words in the system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
