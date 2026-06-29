import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const int = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(int); setDone(true); }
    }, 35);
    return () => clearInterval(int);
  }, [text, started]);

  return (
    <span>{displayed}
      <span className={`font-bold ${done ? 'retro-blink' : ''}`} style={{ color: '#00f0ff' }}>
        {done ? '█' : '▌'}
      </span>
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typewriterActive, setTypewriterActive] = useState(false);

  useGSAP(() => {
    gsap.set('.about-monitor', { opacity: 0, y: 60, rotateX: 5 });
    gsap.set('.about-stats', { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top 70%', scrub: false, once: true,
        onEnter: () => setTimeout(() => setTypewriterActive(true), 800),
      },
    });

    tl.to('.about-monitor', { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power3.out' })
      .to('.about-stats', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.5');
  }, { scope: sectionRef });

  const stats = [
    { label: 'EXPERIENCE', value: '6+', unit: 'YRS' },
    { label: 'PROJECTS', value: '40+', unit: 'BUILT' },
    { label: 'STACK', value: 'TS', unit: 'REACT' },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 px-8 overflow-hidden">
      <div className="silver-line shimmer w-full h-[1px] mb-20" />

      <div className="max-w-5xl mx-auto">
        {/* ═══ RETRO MONITOR BEZEL ═══ */}
        <div className="about-monitor relative"
          style={{
            background: 'linear-gradient(145deg, #1a1030 0%, #0d0520 50%, #0a0318 100%)',
            borderRadius: '16px',
            padding: '6px',
            boxShadow: '0 0 80px rgba(0,0,0,0.6), 0 0 2px rgba(0,240,255,0.1), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}>

          {/* Monitor brand label */}
          <div className="flex items-center justify-between px-6 py-2">
            <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'rgba(255,45,149,0.3)', letterSpacing: '0.3em' }}>
              RETROVISION
            </span>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff2d95', boxShadow: '0 0 6px #ff2d95' }} />
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: 'rgba(0,240,255,0.3)' }}>
                PWR
              </span>
            </div>
          </div>

          {/* Screen area — inner bezel */}
          <div style={{
            background: 'rgba(6, 1, 20, 0.95)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 240, 255, 0.06)',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Scanline overlay on screen */}
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }} />

            {/* Screen reflection glare */}
            <div className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)',
              }} />

            <div className="p-8 md:p-12">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-6 pb-4"
                style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.06)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff2d95', boxShadow: '0 0 4px rgba(255,45,149,0.4)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffb800', boxShadow: '0 0 4px rgba(255,184,0,0.4)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00f0ff', boxShadow: '0 0 4px rgba(0,240,255,0.4)' }} />
                <span className="ml-3 text-[10px] tracking-wider uppercase"
                  style={{ color: 'rgba(0, 240, 255, 0.3)', fontFamily: '"Share Tech Mono", monospace' }}>
                  about://whoami
                </span>
              </div>

              {/* Terminal content */}
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '14px', lineHeight: '1.8', color: 'rgba(0, 240, 255, 0.6)' }}>
                <div className="mb-3">
                  <span style={{ color: '#ff2d95' }}>guest@portfolio</span>
                  <span style={{ color: 'rgba(0,240,255,0.2)' }}>:</span>
                  <span style={{ color: '#b537f2' }}>~</span>
                  <span style={{ color: 'rgba(0,240,255,0.2)' }}>$ </span>
                  <span className="glow-cyan" style={{ color: '#00f0ff' }}>cat about.txt</span>
                </div>
                <div className="min-h-[80px]" style={{ color: 'rgba(238, 232, 255, 0.6)' }}>
                  {typewriterActive && (
                    <Typewriter
                      text="Hello, world! I am a senior frontend engineer dedicated to crafting exceptionally smooth, animated, and performant user interfaces. I specialize in React, TypeScript, and WebGL."
                      delay={200}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Monitor bottom strip — knobs / controls */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex gap-3">
              {['BRIGHT', 'CONTRAST', 'COLOR'].map((knob) => (
                <div key={knob} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full"
                    style={{ border: '1px solid rgba(0,240,255,0.1)', background: 'rgba(0,240,255,0.03)' }} />
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: 'rgba(0,240,255,0.2)', letterSpacing: '0.1em' }}>
                    {knob}
                  </span>
                </div>
              ))}
            </div>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: 'rgba(255,184,0,0.2)' }}>
              MODEL VHS-2026
            </span>
          </div>
        </div>

        {/* ═══ STATS STRIP ═══ */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="about-stats text-center py-6 relative"
              style={{
                background: 'rgba(11, 4, 32, 0.6)',
                border: '1px solid rgba(0, 240, 255, 0.06)',
                borderRadius: '4px',
              }}>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(18px, 3vw, 32px)', color: '#00f0ff',
                textShadow: '0 0 15px rgba(0,240,255,0.3)' }}>
                {s.value}
              </div>
              <div className="mt-1" style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: 'rgba(255,45,149,0.4)', letterSpacing: '0.2em' }}>
                {s.unit}
              </div>
              <div className="mt-1" style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
