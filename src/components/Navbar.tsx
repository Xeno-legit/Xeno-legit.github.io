import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import movingVideoSrc from '@/Moving.mp4';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [clock, setClock] = useState('');

  // Live VHS clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);

  useGSAP(() => {
    gsap.set('.nav-link', { opacity: 0, y: -10 });
    gsap.set('.nav-logo', { opacity: 0 });
    gsap.set('.nav-bar', { scaleX: 0 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('.nav-bar', { scaleX: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'left center' })
      .to('.nav-logo', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .to('.nav-link', { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.4');
  }, { scope: navRef });

  const handleLinkClick = () => {
    window.dispatchEvent(
      new CustomEvent('play-video', { detail: { src: movingVideoSrc, duration: 1000 } })
    );
  };

  return (
    <nav ref={navRef}
      className="nav-bar absolute left-1/2 -translate-x-1/2 w-[calc(100%-6rem)] top-16 z-50 flex items-stretch"
      style={{
        background: 'linear-gradient(180deg, rgba(11, 4, 32, 0.85) 0%, rgba(6, 1, 26, 0.9) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 240, 255, 0.08)',
        borderBottom: '2px solid rgba(255, 45, 149, 0.15)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 240, 255, 0.1)',
      }}>

      {/* Left — VHS brand strip */}
      <div className="nav-logo flex items-center gap-3 px-5 py-3"
        style={{ borderRight: '1px solid rgba(0, 240, 255, 0.08)' }}>
        {/* VHS cassette icon */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: '#ff2d95', boxShadow: '0 0 8px rgba(255,45,149,0.5)' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: '#00f0ff', boxShadow: '0 0 8px rgba(0,240,255,0.5)' }} />
        </div>
        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: '#ff2d95', letterSpacing: '0.2em' }}>
          VHS
        </span>
        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'rgba(0, 240, 255, 0.5)', letterSpacing: '0.15em' }}>
          FOLIO
        </span>
      </div>

      {/* Center — Nav Links */}
      <div className="flex-1 flex items-center justify-center gap-8 px-6 py-3"
        style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {['Projects', 'Contact me', 'Download CV'].map((label, i) => (
          <a key={i}
            href={label === 'Projects' ? '#projects' : label === 'Contact me' ? '#contact' : '#cv'}
            onClick={handleLinkClick}
            className="nav-link relative group cursor-pointer"
            style={{ color: 'rgba(0, 240, 255, 0.45)', transition: 'color 0.3s' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00f0ff';
              e.currentTarget.style.textShadow = '0 0 10px rgba(0, 240, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(0, 240, 255, 0.45)';
              e.currentTarget.style.textShadow = 'none';
            }}>
            {label}
            <span className="absolute bottom-[-6px] left-0 h-[2px] w-0 group-hover:w-full transition-all duration-400 ease-out"
              style={{ background: 'linear-gradient(90deg, #ff2d95, #00f0ff)', boxShadow: '0 0 8px rgba(0, 240, 255, 0.3)' }} />
          </a>
        ))}
      </div>

      {/* Right — Clock / status */}
      <div className="flex items-center gap-4 px-5 py-3"
        style={{ borderLeft: '1px solid rgba(0, 240, 255, 0.08)' }}>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: 'rgba(255, 184, 0, 0.5)', letterSpacing: '0.1em' }}>
          {clock}
        </span>
        <span className="retro-blink" style={{ color: '#ff2d95', fontSize: '6px' }}>⬤</span>
      </div>
    </nav>
  );
}
