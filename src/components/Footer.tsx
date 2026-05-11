export default function Footer() {
  return (
    <footer className="relative py-8 px-8"
      style={{ borderTop: '1px solid rgba(0, 240, 255, 0.06)', background: 'rgba(6, 1, 26, 0.7)' }}>

      {/* VHS end-of-tape stripe */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #ff2d95 20%, #b537f2 50%, #00f0ff 80%, transparent 100%)', opacity: 0.3 }} />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left — copyright */}
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: 'rgba(0,240,255,0.2)', letterSpacing: '0.1em' }}>
            &copy; {new Date().getFullYear()}
          </span>
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'rgba(255,45,149,0.3)', letterSpacing: '0.15em' }}>
            ABDULHAMID ALI
          </span>
        </div>

        {/* Center — VHS decoration */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ border: '1px solid rgba(0,240,255,0.1)', background: 'rgba(0,240,255,0.03)' }}>
            <div className="w-1 h-1 rounded-full mx-auto mt-[3px]" style={{ background: 'rgba(0,240,255,0.15)' }} />
          </div>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: 'rgba(255,184,0,0.2)', letterSpacing: '0.1em' }}>
            END OF TAPE
          </span>
          <div className="w-3 h-3 rounded-full" style={{ border: '1px solid rgba(255,45,149,0.1)', background: 'rgba(255,45,149,0.03)' }}>
            <div className="w-1 h-1 rounded-full mx-auto mt-[3px]" style={{ background: 'rgba(255,45,149,0.15)' }} />
          </div>
        </div>

        {/* Right — empty or other info */}
        <div className="flex gap-6 invisible md:visible opacity-0">
          {/* Links removed as per request */}
        </div>
      </div>
    </footer>
  );
}
