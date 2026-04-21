export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 text-center py-8 font-sans border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Abdulhamid Ali. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <span className="hover:text-white transition-colors cursor-pointer">GitHub</span>
          <span className="hover:text-white transition-colors cursor-pointer">LinkedIn</span>
          <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
        </div>
      </div>
    </footer>
  );
}
