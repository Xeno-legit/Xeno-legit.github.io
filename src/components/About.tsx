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
      if (i >= text.length) {
        clearInterval(int);
        setDone(true);
      }
    }, 35);
    return () => clearInterval(int);
  }, [text, started]);

  return (
    <span>
      {displayed}
      <span
        className={`font-bold ${done ? 'animate-pulse' : ''}`}
        style={{ color: '#888' }}
      >
        {done ? '█' : '▌'}
      </span>
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typewriterActive, setTypewriterActive] = useState(false);

  useGSAP(() => {
    // Initial hidden states
    gsap.set('.about-terminal', { opacity: 0, y: 40 });
    gsap.set('.about-divider', { height: 0, opacity: 0 });
    gsap.set('.about-image', { opacity: 0, x: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'center 40%',
        scrub: false,
        once: true,
        onEnter: () => {
          // Start typewriter only when section enters view
          setTimeout(() => setTypewriterActive(true), 800);
        },
      },
    });

    tl.to('.about-terminal', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
      .to('.about-divider', { height: 280, opacity: 1, duration: 1.2, ease: 'power2.inOut' }, '-=0.6')
      .to('.about-image', { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.8');
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-8 overflow-hidden">
      {/* Top separator */}
      <div className="silver-line shimmer w-full h-[1px] mb-20" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left: Terminal bio */}
        <div className="about-terminal w-full md:w-2/3">
          <div
            className="glass-panel rounded-lg p-8 relative"
            style={{ border: '1px solid rgba(200,200,210,0.08)' }}
          >
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(200,200,210,0.06)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#333' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#333' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#333' }} />
              <span className="ml-3 font-mono text-[10px] tracking-wider uppercase" style={{ color: '#555' }}>
                terminal
              </span>
            </div>

            {/* Terminal content */}
            <div className="font-mono text-sm leading-relaxed" style={{ color: '#999' }}>
              <div className="mb-3">
                <span style={{ color: '#666' }}>guest@portfolio</span>
                <span style={{ color: '#555' }}>:</span>
                <span style={{ color: '#777' }}>~</span>
                <span style={{ color: '#555' }}>$</span>
                <span className="ml-2 glow-silver" style={{ color: '#bbb' }}>whoami</span>
              </div>
              <div className="min-h-[80px]" style={{ color: '#888' }}>
                {typewriterActive && (
                  <Typewriter
                    text="Hello, world! I am a senior frontend engineer dedicated to crafting exceptionally smooth, animated, and performant user interfaces."
                    delay={200}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Silver divider line */}
        <div
          className="about-divider hidden md:block w-[1px]"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(200,200,210,0.3), transparent)',
            boxShadow: '0 0 8px rgba(200,200,210,0.05)',
          }}
        />

        {/* Right: Image placeholder */}
        <div className="about-image w-full md:w-1/3 flex justify-center md:justify-end">
          <div
            className="w-full aspect-square max-w-[320px] glass-panel rounded-lg relative overflow-hidden"
            style={{
              border: '1px solid rgba(200,200,210,0.08)',
            }}
          >
            {/* CRT scanline effect over the image area */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )`,
              }}
            />
            {/* Empty placeholder — just a subtle icon/text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-[10px] tracking-wider uppercase" style={{ color: '#333' }}>
                  [ image ]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
