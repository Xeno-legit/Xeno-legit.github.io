import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.set('.nav-link', { opacity: 0, y: -10 });
    gsap.set('.nav-logo', { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('.nav-logo', { opacity: 1, duration: 1, ease: 'power2.out' })
      .to('.nav-link', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5');
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      className="fixed w-full top-0 z-50 px-8 py-5 flex justify-between items-center"
      style={{
        background: 'rgba(5, 5, 5, 0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(200, 200, 210, 0.06)',
      }}
    >
      {/* Logo */}
      <div className="nav-logo flex items-center gap-2">
        <span
          className="font-mono font-semibold text-sm tracking-[0.3em] uppercase glow-silver"
          style={{ color: '#c8c8d0' }}
        >
          Portfolio
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex gap-10 font-mono text-xs font-medium tracking-[0.15em] uppercase">
        {['Projects', 'Contact me', 'Download CV'].map((label, i) => (
          <a
            key={i}
            href={label === 'Projects' ? '#projects' : label === 'Contact me' ? '#contact' : '#cv'}
            className="nav-link relative group"
            style={{ color: '#999' }}
          >
            <span className="transition-all duration-300 group-hover:text-[#d4d4d8]" style={{ textShadow: 'none' }}>
              {label}
            </span>
            {/* Animated underline */}
            <span
              className="absolute bottom-[-4px] left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out"
              style={{ background: 'rgba(200, 200, 210, 0.5)' }}
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
