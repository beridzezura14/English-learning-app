import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white flex items-center justify-center p-6">

      <div className="text-center max-w-2xl">

        {/* HERO TITLE */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Learn English <span className="text-purple-400">Daily</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-400 mt-5 text-base md:text-lg">
          Improve your vocabulary every day and become fluent faster.
          Build your knowledge step by step with a simple daily system.
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
            <h3 className="font-semibold text-purple-300">📘 Daily Words</h3>
            <p className="text-gray-400 text-sm mt-2">
              Learn 10 new words every day
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h3 className="font-semibold text-purple-300">🧠 Practice</h3>
            <p className="text-gray-400 text-sm mt-2">
              Use examples to remember faster
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <h3 className="font-semibold text-purple-300">🚀 Progress</h3>
            <p className="text-gray-400 text-sm mt-2">
              Track your daily improvement
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}