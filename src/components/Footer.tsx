export default function Footer() {
  return (
    <footer
      className="relative py-10 px-8 font-mono"
      style={{
        borderTop: '1px solid rgba(200,200,210,0.06)',
        background: 'rgba(5,5,5,0.5)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs tracking-wider" style={{ color: '#444' }}>
          &copy; {new Date().getFullYear()} Abdulhamid Ali. All rights reserved.
        </p>

        <div className="flex gap-8 text-xs tracking-wider uppercase">
          {['GitHub', 'LinkedIn'].map((label) => (
            <a
              key={label}
              href="#"
              className="relative group transition-all duration-300"
              style={{ color: '#555' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#d4d4d8';
                e.currentTarget.style.textShadow = '0 0 12px rgba(200,200,210,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#555';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {label}
              <span
                className="absolute bottom-[-3px] left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: 'rgba(200,200,210,0.3)' }}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
