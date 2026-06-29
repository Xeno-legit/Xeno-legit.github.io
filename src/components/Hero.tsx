import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  introFinished: boolean;
}

export default function Hero({ introFinished }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [bootPhase, setBootPhase] = useState<'off' | 'powerline' | 'phosphor' | 'content'>('off');
  const [vhsTime, setVhsTime] = useState('00:00:00');

  useEffect(() => {
    if (!introFinished) return;
    setBootPhase('powerline');
    const phosphorTimer = setTimeout(() => setBootPhase('phosphor'), 600);
    const contentTimer = setTimeout(() => setBootPhase('content'), 1400);
    return () => { clearTimeout(phosphorTimer); clearTimeout(contentTimer); };
  }, [introFinished]);

  // Running VHS counter
  useEffect(() => {
    if (bootPhase !== 'content') return;
    let seconds = 0;
    const int = setInterval(() => {
      seconds++;
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      setVhsTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(int);
  }, [bootPhase]);

  useGSAP(() => {
    if (bootPhase !== 'content') return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo('.hero-vhs-frame', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.hero-first-name', { opacity: 0, x: -60, skewX: 15 }, { opacity: 1, x: 0, skewX: 0, duration: 0.7, ease: 'power4.out' }, '-=0.4')
      .fromTo('.hero-last-name', { opacity: 0, x: 60, skewX: -15 }, { opacity: 1, x: 0, skewX: 0, duration: 0.7, ease: 'power4.out' }, '-=0.4')
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .fromTo('.hero-scroll-indicator', { opacity: 0 }, { opacity: 0.6, duration: 1 }, '-=0.1');

    gsap.to('.hero-content', {
      y: -150, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
    });
  }, { scope: sectionRef, dependencies: [bootPhase] });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Boot-up overlay */}
      {introFinished && bootPhase !== 'content' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {bootPhase === 'powerline' && <div className="crt-power-line" />}
          {bootPhase === 'phosphor' && <div className="crt-phosphor-expand" />}
        </div>
      )}

      <div className="hero-content flex flex-col items-center text-center select-none relative"
        style={{ opacity: bootPhase === 'content' ? undefined : 0 }}>

        {/* ═══ VHS FRAME — the tape overlay border ═══ */}
        <div className="hero-vhs-frame relative px-12 py-16 md:px-20 md:py-20"
          style={{
            border: '2px solid rgba(0, 240, 255, 0.15)',
            borderRadius: '4px',
            background: 'rgba(11, 4, 32, 0.4)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 0 60px rgba(181, 55, 242, 0.05), inset 0 0 80px rgba(0, 0, 0, 0.3)',
            minWidth: 'min(90vw, 900px)',
          }}>

          {/* VHS Top-left: REC indicator */}
          <div className="absolute top-4 left-5 flex items-center gap-2"
            style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
            <span className="retro-blink" style={{ color: '#ff2d95', fontSize: '8px' }}>⬤</span>
            <span>REC</span>
          </div>

          {/* VHS Top-right: PLAY + Timer */}
          <div className="absolute top-4 right-5 flex items-center gap-3"
            style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
            <span>▶ PLAY</span>
            <span style={{ color: '#00f0ff', letterSpacing: '0.1em' }}>{vhsTime}</span>
          </div>

          {/* VHS Bottom-left: Channel */}
          <div className="absolute bottom-4 left-5"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: 'rgba(255, 184, 0, 0.4)' }}>
            CH-01 &nbsp;SP
          </div>

          {/* VHS Bottom-right: Date */}
          <div className="absolute bottom-4 right-5"
            style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: 'rgba(255, 255, 255, 0.3)' }}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase()}
          </div>

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-5 h-5" style={{ borderTop: '2px solid rgba(255, 45, 149, 0.3)', borderLeft: '2px solid rgba(255, 45, 149, 0.3)' }} />
          <div className="absolute top-2 right-2 w-5 h-5" style={{ borderTop: '2px solid rgba(0, 240, 255, 0.3)', borderRight: '2px solid rgba(0, 240, 255, 0.3)' }} />
          <div className="absolute bottom-2 left-2 w-5 h-5" style={{ borderBottom: '2px solid rgba(0, 240, 255, 0.3)', borderLeft: '2px solid rgba(0, 240, 255, 0.3)' }} />
          <div className="absolute bottom-2 right-2 w-5 h-5" style={{ borderBottom: '2px solid rgba(255, 45, 149, 0.3)', borderRight: '2px solid rgba(255, 45, 149, 0.3)' }} />

          {/* ── NAME ── */}
          <h1 className="hero-first-name font-display leading-[0.85] tracking-[-0.02em]"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              color: '#00f0ff',
              fontFamily: '"Press Start 2P", monospace',
              textShadow: '0 0 30px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.15), -3px 0 rgba(255, 45, 149, 0.4), 3px 0 rgba(181, 55, 242, 0.4)',
            }}>
            Abdulhamid
          </h1>

          <h1 className="hero-last-name font-display leading-[0.85] tracking-[-0.02em] mt-3"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              color: '#ff2d95',
              fontFamily: '"Press Start 2P", monospace',
              textShadow: '0 0 30px rgba(255, 45, 149, 0.4), 0 0 60px rgba(255, 45, 149, 0.15), -3px 0 rgba(0, 240, 255, 0.4), 3px 0 rgba(181, 55, 242, 0.4)',
            }}>
            Ali
          </h1>

          {/* Separator line */}
          <div className="mt-6 mb-4 w-full h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,45,149,0.3), rgba(0,240,255,0.3), transparent)' }} />

          {/* Subtitle */}
          <div className="hero-subtitle font-mono text-sm tracking-[0.25em] uppercase"
            style={{ color: 'rgba(255, 184, 0, 0.6)', fontFamily: '"Share Tech Mono", monospace' }}>
            &#47;&#47; SENIOR FRONTEND ENGINEER
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator absolute bottom-12 flex flex-col items-center gap-3"
        style={{ opacity: bootPhase === 'content' ? undefined : 0 }}>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(0, 240, 255, 0.3)', fontFamily: '"Share Tech Mono", monospace' }}>
          ▼ SCROLL
        </span>
        <div className="w-[1px] h-8 relative overflow-hidden">
          <div className="w-full h-full animate-pulse"
            style={{ background: 'linear-gradient(to bottom, rgba(0,240,255,0.5), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
