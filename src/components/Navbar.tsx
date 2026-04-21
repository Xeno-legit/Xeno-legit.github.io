import { Hexagon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-zinc-950 text-white px-8 py-5 flex justify-between items-center shadow-md">
      {/* Placeholder Logo */}
      <div className="flex items-center gap-3">
        <Hexagon className="text-white fill-white" size={28} />
        <span className="font-display font-bold text-lg tracking-widest uppercase">
          Portfolio
        </span>
      </div>
      
      {/* 3 Links on the right */}
      <div className="flex gap-10 font-sans text-sm font-medium tracking-wide">
        <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
        <a href="#contact" className="hover:text-blue-400 transition-colors">Contact me</a>
        <a href="#cv" className="hover:text-blue-400 transition-colors">Download CV</a>
      </div>
    </nav>
  );
}
