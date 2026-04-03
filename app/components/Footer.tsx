export default function Footer() {
  return (
    <footer className="w-full px-6 py-4 bg-black text-white border-t border-white/10 text-center text-sm">
      © {new Date().getFullYear()} Language Learning App. All rights reserved.
    </footer>
  );
}