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
        <div className="fixed inset-0 z-[3000] bg-[#0b0420] flex items-center justify-center">
          <button
            onClick={handlePowerOn}
            className="power-button group vhs-flicker"
            aria-label="Power On"
          >
            {/* Power icon (IEC 5009) */}
            <svg
              viewBox="0 0 24 24"
              width="64"
              height="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="power-icon"
            >
              <path d="M12 2v8" />
              <path d="M16.24 5.76a8 8 0 1 1-8.48 0" />
            </svg>
          </button>
        </div>
      )}

      {/* ═══ PHASE 2: INTRO VIDEO ═══ */}
      {phase === 'intro-video' && (
        <div className="fixed inset-0 z-[3000] bg-[#0b0420] flex items-center justify-center">
          <video
            src={introVideoSrc}
            autoPlay
            playsInline
            onEnded={handleIntroEnded}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
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
      <div className="vhs-tracking" />
      <div className="vhs-bleed" />
      <div className="vhs-screen-flicker" />


      {/* Synthwave grid background — fixed behind everything */}
      <ThreeBackground />

      {/* Page Content — Simple fade in, CRT lens effect handles the rest */}
      <div
        className={`crt-container relative z-10 ${phase === 'site' ? 'crt-turn-on vhs-flicker vhs-duration-3 crt-curved' : ''}`}
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
            style={{
              width: '100%',
              height: '100%',
              objectFit: isFullScreenVideo ? 'cover' : 'contain',
            }}
          />

          {/* Go Back button — only on ERROR video */}
          {isErrorVideo && (
            <button
              onClick={handleGoBack}
              className="absolute top-8 left-8 z-10 flex items-center gap-2 px-5 py-3 font-mono text-xs tracking-[0.2em] uppercase rounded transition-all duration-300 group"
              style={{
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                e.currentTarget.style.boxShadow = 'none';
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
