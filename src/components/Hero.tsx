import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

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
      if (i >= text.length) clearInterval(int);
    }, 40);
    return () => clearInterval(int);
  }, [text, started]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse font-bold text-blue-500">_</span>
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Ensure styles are set so flashes don't happen
    gsap.set(".hero-name", { opacity: 0 });
    gsap.set(".hero-line", { height: 0, opacity: 0 });
    gsap.set(".hero-img", { opacity: 0, x: 60 });

    // Core Entry Animation using GSAP completely replacing framer
    const entryTl = gsap.timeline();
    entryTl.to(".hero-name", { opacity: 1, duration: 1.5, ease: "power2.out", delay: 0.5 })
      .to(".hero-line", { height: 350, opacity: 1, duration: 1.5, ease: "power2.inOut" }, "-=1")
      .to(".hero-img", { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }, "-=1.2");

    // Smooth scrub to gently push hero content out and fade as user scrolls vertically
    gsap.to(".hero-content-layer", {
      y: -120,
      opacity: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5, // 1.5s smoothing gives premium depth
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="bg-white min-h-screen pt-24 px-8 flex justify-center items-center overflow-hidden">
      <div className="hero-content-layer max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-16">

        {/* Left Side: Name and Description */}
        <div className="w-full md:w-2/3 flex flex-col items-start gap-6">
          <h1 className="hero-name text-6xl md:text-8xl font-display font-bold text-blue-600 tracking-tight">
            Abdulhamid
            <br />
            Ali
          </h1>

          <div className="font-mono text-zinc-600 text-sm md:text-base leading-relaxed w-full h-32 mt-4">
            <div className="text-blue-500 font-bold mb-2">$ whoami</div>
            <Typewriter
              text="> Hello, world! I am a senior frontend engineer dedicated to crafting exceptionally smooth, animated, and performant user interfaces."
              delay={1500}
            />
          </div>
        </div>

        {/* Middle: Fading Line */}
        <div className="hero-line hidden md:block w-[1px] bg-zinc-200" />

        {/* Right Side: Profile Picture (Fades in from right) */}
        <div className="hero-img w-full md:w-1/3 flex justify-end">
          <div className="w-72 h-72 md:w-full md:aspect-square overflow-hidden bg-zinc-100 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
            <img
              src=""
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
