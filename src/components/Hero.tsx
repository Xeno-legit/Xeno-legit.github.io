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

  // PC Boot-up sequence when intro video finishes
  useEffect(() => {
    if (!introFinished) return;

    // Phase 1: Horizontal power line appears (like CRT turning on)
    setBootPhase('powerline');

    const phosphorTimer = setTimeout(() => {
      // Phase 2: Screen phosphor glow expands
      setBootPhase('phosphor');
    }, 600);

    const contentTimer = setTimeout(() => {
      // Phase 3: Content fades in
      setBootPhase('content');
    }, 1400);

    return () => {
      clearTimeout(phosphorTimer);
      clearTimeout(contentTimer);
    };
  }, [introFinished]);

  // GSAP animations for hero content — only trigger after boot completes
  useGSAP(() => {
    if (bootPhase !== 'content') return;

    // Entry timeline — the text materializes with CRT flicker
    const tl = gsap.timeline({ delay: 0.1 });

    // Quick flicker before reveal
    tl.fromTo('.hero-first-name',
      { opacity: 0, scaleY: 0.3, transformOrigin: 'center center', filter: 'blur(8px)' },
      { opacity: 1, scaleY: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power4.out' }
    )
    .fromTo('.hero-last-name',
      { opacity: 0, scaleY: 0.3, transformOrigin: 'center center', filter: 'blur(8px)' },
      { opacity: 1, scaleY: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power4.out' },
      '-=0.3'
    )
    .fromTo('.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 0.4, duration: 1, ease: 'power2.out' },
      '-=0.1'
    );

    // Scroll parallax — push the hero name up and fade
    gsap.to('.hero-content', {
      y: -150,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }, { scope: sectionRef, dependencies: [bootPhase] });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* CRT Boot-up Effects Overlay (only visible during boot) */}
      {introFinished && bootPhase !== 'content' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* Phase 1: Horizontal scanline / power beam */}
          {bootPhase === 'powerline' && (
            <div className="crt-power-line" />
          )}

          {/* Phase 2: Phosphor glow expanding */}
          {bootPhase === 'phosphor' && (
            <div className="crt-phosphor-expand" />
          )}
        </div>
      )}

      {/* Hero Content — only render once boot reaches content phase */}
      <div
        className="hero-content flex flex-col items-center text-center select-none"
        style={{ opacity: bootPhase === 'content' ? undefined : 0 }}
      >
        {/* First Name */}
        <h1 className="hero-first-name font-display font-800 leading-[0.85] tracking-[-0.04em] chromatic-strong"
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            color: '#d1d1d1ff',
          }}
        >
          Abdulhamid
        </h1>

        {/* Last Name */}
        <h1 className="hero-last-name font-display font-800 leading-[0.85] tracking-[-0.04em] chromatic-strong mt-2"
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            color: '#d1d1d1ff',
          }}
        >
          Ali
        </h1>
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-indicator absolute bottom-12 flex flex-col items-center gap-3"
        style={{ opacity: bootPhase === 'content' ? undefined : 0 }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#666' }}>
          Scroll
        </span>
        <div className="w-[1px] h-8 relative overflow-hidden">
          <div
            className="w-full h-full animate-pulse"
            style={{
              background: 'linear-gradient(to bottom, rgba(200,200,210,0.5), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
