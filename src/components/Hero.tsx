import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Initial hidden state
    gsap.set('.hero-first-name', { opacity: 0, y: 60 });
    gsap.set('.hero-last-name', { opacity: 0, y: 60 });
    gsap.set('.hero-scroll-indicator', { opacity: 0 });

    // Entry timeline
    const tl = gsap.timeline({ delay: 0.6 });
    tl.to('.hero-first-name', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' })
      .to('.hero-last-name', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.9')
      .to('.hero-scroll-indicator', { opacity: 0.4, duration: 1, ease: 'power2.out' }, '-=0.3');

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
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="hero-content flex flex-col items-center text-center select-none">
        {/* First Name */}
        <h1 className="hero-first-name font-display font-800 leading-[0.85] tracking-[-0.04em] chromatic-strong"
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            color: '#e4e4e7',
          }}
        >
          Abdulhamid
        </h1>

        {/* Last Name */}
        <h1 className="hero-last-name font-display font-800 leading-[0.85] tracking-[-0.04em] chromatic-strong mt-2"
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            color: '#e4e4e7',
          }}
        >
          Ali
        </h1>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator absolute bottom-12 flex flex-col items-center gap-3">
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
