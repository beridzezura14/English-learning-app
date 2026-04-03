import Link from "next/link";

export default function MainHeader() {
  return (
    <header className="w-full px-6 py-6 bg-black/40 backdrop-blur-md text-white flex justify-between items-center border-b border-white/10 top-0 z-50">

      {/* LOGO */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold tracking-wide">
          Language <span className="text-purple-400">App</span>
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex gap-6 text-sm">
        <Link
          href="/"
          className="relative text-gray-300 hover:text-white transition group"
        >
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 group-hover:w-full transition-all duration-300"></span>
        </Link>

        <Link
          href="/dashboard"
          className="relative text-gray-300 hover:text-white transition group"
        >
          Dashboard
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </nav>

    </header>
  );
}