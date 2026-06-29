import { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';
import '../crt len effect/crt.css';

import introVideoSrc from '@/Websitestart.mp4';
import errorVideoSrc from '@/ERROR.mp4';
import movingVideoSrc from '@/Moving.mp4';

type AppPhase = 'power-screen' | 'intro-video' | 'boot-up' | 'site';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('power-screen');
  const [overlayVideo, setOverlayVideo] = useState<string | null>(null);
  const [overlayDuration, setOverlayDuration] = useState<number | null>(null);
  const [showAvText, setShowAvText] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Force scroll to top on refresh ──
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // ── Power button clicked → play intro ──
  const handlePowerOn = () => {
    setPhase('intro-video');
  };

  // ── Intro video: show for exactly 10 seconds ──
  useEffect(() => {
    if (phase !== 'intro-video') return;
    const timer = setTimeout(() => {
      setPhase('boot-up');
      setTimeout(() => {
        setPhase('site');
        setShowAvText(true);
        // Hide AV-1 text after 5 seconds
        setTimeout(() => setShowAvText(false), 5000);
      }, 1400);
    }, 10000);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Fallback: if video ends before 10s, let the timer handle it ──
  const handleIntroEnded = () => {
    // no-op — the 10s timer controls the transition
  };

  // ── Listen for overlay video events (Navbar / Projects) ──
  useEffect(() => {
    const handlePlayVideo = (e: any) => {
      setOverlayVideo(e.detail.src);
      setOverlayDuration(e.detail.duration ?? null);
    };
    window.addEventListener('play-video', handlePlayVideo as EventListener);
    return () => window.removeEventListener('play-video', handlePlayVideo as EventListener);
  }, []);

  // ── Auto-dismiss timed overlay videos ──
  useEffect(() => {
    if (overlayVideo && overlayDuration) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOverlayVideo(null);
        timerRef.current = null;
      }, overlayDuration);
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [overlayVideo, overlayDuration]);

  const handleOverlayEnded = useCallback(() => {
    if (!overlayDuration && overlayVideo !== errorVideoSrc) {
      setOverlayVideo(null);
    }
  }, [overlayDuration, overlayVideo]);

  const handleGoBack = useCallback(() => {
    setOverlayVideo(null);
  }, []);

  const isErrorVideo = overlayVideo === errorVideoSrc;
  const isFullScreenVideo = isErrorVideo || overlayVideo === movingVideoSrc;

  return (
    <div className="relative min-h-screen font-sans antialiased text-[#e4e4e7]">

      {/* ═══ PHASE 1: POWER SCREEN ═══ */}
      {phase === 'power-screen' && (
        <div className="fixed inset-0 z-[3000] bg-[#000000] flex items-center justify-center">
          <div className="relative group vhs-flicker">
            {/* White Border Layer */}
            <div 
              className="absolute inset-[-4px] bg-white pointer-events-none"
              style={{
                clipPath: 'polygon(35% 0%, 65% 0%, 65% 4%, 75% 4%, 75% 8%, 82% 8%, 82% 14%, 88% 14%, 88% 20%, 94% 20%, 94% 30%, 100% 30%, 100% 70%, 94% 70%, 94% 80%, 88% 80%, 88% 86%, 82% 86%, 82% 92%, 75% 92%, 75% 96%, 65% 96%, 65% 100%, 35% 100%, 35% 96%, 25% 96%, 25% 92%, 18% 92%, 18% 86%, 12% 86%, 12% 80%, 6% 80%, 6% 70%, 0% 70%, 0% 30%, 6% 30%, 6% 20%, 12% 20%, 12% 14%, 18% 14%, 18% 8%, 25% 8%, 25% 4%, 35% 4%)',
              }}
            />
            
            {/* Main Button */}
            <button
              onClick={handlePowerOn}
              className="relative w-32 h-32 bg-[#333333] flex items-center justify-center transition-all duration-100 active:scale-95"
              aria-label="Power On"
              style={{
                clipPath: 'polygon(35% 0%, 65% 0%, 65% 4%, 75% 4%, 75% 8%, 82% 8%, 82% 14%, 88% 14%, 88% 20%, 94% 20%, 94% 30%, 100% 30%, 100% 70%, 94% 70%, 94% 80%, 88% 80%, 88% 86%, 82% 86%, 82% 92%, 75% 92%, 75% 96%, 65% 96%, 65% 100%, 35% 100%, 35% 96%, 25% 96%, 25% 92%, 18% 92%, 18% 86%, 12% 86%, 12% 80%, 6% 80%, 6% 70%, 0% 70%, 0% 30%, 6% 30%, 6% 20%, 12% 20%, 12% 14%, 18% 14%, 18% 8%, 25% 8%, 25% 4%, 35% 4%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#444444';
                e.currentTarget.parentElement!.style.filter = 'drop-shadow(0 0 15px rgba(255,255,255,0.4))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
                e.currentTarget.parentElement!.style.filter = 'none';
              }}
            >
              {/* Power icon (IEC 5009) */}
              <svg
                viewBox="0 0 24 24"
                width="64"
                height="64"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="power-icon"
              >
                <path d="M12 2v8" />
                <path d="M16.24 5.76a8 8 0 1 1-8.48 0" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ═══ PHASE 2: INTRO VIDEO ═══ */}
      {(phase === 'intro-video' || phase === 'boot-up') && (
        <div
          className="fixed inset-0 z-[5000] bg-[#0b0420] flex items-center justify-center transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: phase === 'boot-up' ? 0 : 1,
            pointerEvents: phase === 'boot-up' ? 'none' : 'auto'
          }}
        >
          <video
            src={introVideoSrc}
            autoPlay
            playsInline
            onEnded={handleIntroEnded}
            className="video-full-screen"
          />
        </div>
      )}

      {/* ═══ PHASE 3: BOOT-UP ANIMATION ═══ */}
      {phase === 'boot-up' && (
        <div className="fixed inset-0 z-[3000] bg-[#0b0420] flex items-center justify-center pointer-events-none">
          <div className="crt-boot-sequence" />
        </div>
      )}

      {/* ═══ SITE CONTENT (visible after boot) ═══ */}

      {/* ═══ CRT LENS EFFECT OVERLAY (The actual 'Lens') ═══ */}
      <div className="scanlines pointer-events-none fixed inset-0 z-[10000000]">
        <div className="screen absolute inset-0">
          <div className="overlay absolute inset-0">
            {showAvText && (
              <div className="text crt-turn-on-text">
                <span>AV-1</span>
                <span>AV-1</span>
                <span>AV-1</span>
                <span>AV-1</span>
                <span>AV-1</span>
              </div>
            )}
            {/* Added interlacing and chromatic aberration inside the lens */}
            <div className="crt-interlace" />
            <div className="crt-chromatic" />
          </div>
        </div>
      </div>

      {/* SVG Filter for CRT Curvature */}
      <svg className="hidden-svg" width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
        <defs>
          <filter id="crt-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
            {/* Simulation of bulge using displacement map */}
            <feTurbulence type="fractalNoise" baseFrequency="0.00001" numOctaves="1" result="noise" />
            <feDisplacementMap in="blur" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Other VHS Overlays */}
      <div className="crt-screen" />
      <div className="vhs-grain" />
      <div className="vhs-scanlines" />
      <div className="vhs-tracking" />
      <div className="vhs-bleed" />
      <div className="vhs-screen-flicker" />
      <div className="crt-phosphor" />


      {/* Synthwave grid background — fixed behind everything */}
      <ThreeBackground />

      {/* Page Content — Simple fade in, CRT lens effect handles the rest */}
      <div
        className={`crt-container relative z-10 ${phase === 'site' ? 'crt-turn-on vhs-flicker vhs-duration-3 crt-curved v-sync-jitter' : ''}`}
        style={{
          opacity: phase === 'site' ? undefined : 0,
          pointerEvents: phase === 'site' ? 'auto' : 'none',
          background: 'transparent',
        }}
      >
        <Navbar />
        <Hero introFinished={phase === 'site'} />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </div>

      {/* ═══ OVERLAY VIDEOS (Error / Moving) ═══ */}
      {overlayVideo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#0b0420]">
          <video
            ref={videoRef}
            key={overlayVideo}
            src={overlayVideo}
            autoPlay
            playsInline
            loop={isErrorVideo}
            onEnded={handleOverlayEnded}
            className="video-full-screen z-[2000]"
            style={{
              transform: overlayVideo === movingVideoSrc ? 'scale(1.1)' : 'none',
            }}
          />

          {/* Go Back button — only on ERROR video */}
          {isErrorVideo && (
            <button
              onClick={handleGoBack}
              className="absolute top-8 left-8 z-10 flex items-center gap-2 px-5 py-3 font-mono text-xs tracking-[0.2em] uppercase transition-all duration-100 group active:translate-y-1"
              style={{
                color: '#0b0420',
                border: '3px solid #0b0420',
                background: '#ffffff',
                borderRadius: '2px',
                boxShadow: 'inset 4px 4px 0 rgba(255,255,255,0.8), inset -4px -4px 0 rgba(0,0,0,0.2), 0 5px 0 #0b0420',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'inset 4px 4px 0 rgba(255,255,255,0.8), inset -4px -4px 0 rgba(0,0,0,0.2), 0 8px 0 #0b0420, 0 10px 20px rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'inset 4px 4px 0 rgba(255,255,255,0.8), inset -4px -4px 0 rgba(0,0,0,0.2), 0 5px 0 #0b0420';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = 'inset 2px 2px 0 rgba(255,255,255,0.8), inset -2px -2px 0 rgba(0,0,0,0.2), 0 1px 0 #0b0420';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'inset 4px 4px 0 rgba(255,255,255,0.8), inset -4px -4px 0 rgba(0,0,0,0.2), 0 8px 0 #0b0420, 0 10px 20px rgba(255,255,255,0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span className="font-bold">Go Back</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
