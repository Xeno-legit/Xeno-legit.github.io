import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.set('.contact-heading', { opacity: 0, y: 50 });
    gsap.set('.contact-badge', { opacity: 0, y: 20 });
    gsap.set('.contact-form-wrapper', { opacity: 0, y: 40 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'center 30%',
        scrub: 1.5,
      },
    });

    tl.to('.contact-heading', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
      .to('.contact-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to('.contact-form-wrapper', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5');
  }, { scope: sectionRef });

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 px-8 overflow-hidden">
      <div className="silver-line shimmer w-full h-[1px] mb-20" />

      <div className="max-w-5xl mx-auto">
        {/* Header area */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-start mb-12">
          <div className="flex-1">
            <div className="contact-heading flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px]" style={{ background: '#ff2d95' }} />
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: 'rgba(255,45,149,0.4)', letterSpacing: '0.3em' }}>
                TRANSMISSION
              </span>
            </div>
            <h2 className="contact-heading font-display tracking-tight mb-4 chromatic"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#eee8ff', lineHeight: 0.95, fontFamily: '"Press Start 2P", monospace' }}>
              Let's talk.
            </h2>
            <p className="contact-heading max-w-sm mb-6"
              style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'rgba(0, 240, 255, 0.4)' }}>
              Have a unique project in mind? Send a transmission.
            </p>

            {/* Status badge */}
            <div className="contact-badge flex gap-3 items-center">
              <span className="w-2 h-2 rounded-full retro-blink" style={{ background: '#00f0ff', boxShadow: '0 0 8px rgba(0,240,255,0.5)' }} />
              <span style={{
                fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', letterSpacing: '0.15em',
                color: '#ffb800', border: '1px solid rgba(255,184,0,0.15)', background: 'rgba(255,184,0,0.03)',
                padding: '5px 14px', borderRadius: '2px', textTransform: 'uppercase',
              }}>
                ● Online — Open for opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Form — BBS terminal style */}
        <div className="contact-form-wrapper">
          <div style={{
            background: 'linear-gradient(160deg, rgba(20, 10, 45, 0.95) 0%, rgba(11, 4, 32, 0.98) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.08)',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0,0,0,0.5)',
          }}>
            {/* Terminal title bar */}
            <div className="flex items-center justify-between px-6 py-3"
              style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(0,240,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#ff2d95', boxShadow: '0 0 4px #ff2d95' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#ffb800' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#00f0ff' }} />
                <span className="ml-2" style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: 'rgba(0,240,255,0.3)', letterSpacing: '0.1em' }}>
                  msg://compose
                </span>
              </div>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: 'rgba(255,45,149,0.2)' }}>
                BBS v2.6
              </span>
            </div>

            {/* Form content */}
            <form className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: 'rgba(0,240,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    &gt; NAME_
                  </label>
                  <input type="text"
                    className="w-full bg-transparent py-3 outline-none transition-all"
                    style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: '#eee8ff',
                      borderBottom: '1px solid rgba(0, 240, 255, 0.1)', caretColor: '#00f0ff' }}
                    placeholder="John Doe"
                    onFocus={(e) => { e.target.style.borderBottomColor = 'rgba(0, 240, 255, 0.4)'; }}
                    onBlur={(e) => { e.target.style.borderBottomColor = 'rgba(0, 240, 255, 0.1)'; }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: 'rgba(0,240,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    &gt; EMAIL_
                  </label>
                  <input type="email"
                    className="w-full bg-transparent py-3 outline-none transition-all"
                    style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: '#eee8ff',
                      borderBottom: '1px solid rgba(0, 240, 255, 0.1)', caretColor: '#00f0ff' }}
                    placeholder="john@example.com"
                    onFocus={(e) => { e.target.style.borderBottomColor = 'rgba(0, 240, 255, 0.4)'; }}
                    onBlur={(e) => { e.target.style.borderBottomColor = 'rgba(0, 240, 255, 0.1)'; }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <label style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: 'rgba(0,240,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  &gt; MESSAGE_
                </label>
                <textarea rows={4}
                  className="w-full bg-transparent py-3 outline-none transition-all resize-none"
                  style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: '#eee8ff',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.1)', caretColor: '#00f0ff' }}
                  placeholder="Enter your transmission..."
                  onFocus={(e) => { e.target.style.borderBottomColor = 'rgba(0, 240, 255, 0.4)'; }}
                  onBlur={(e) => { e.target.style.borderBottomColor = 'rgba(0, 240, 255, 0.1)'; }}
                />
              </div>

              <button type="button"
                className="w-full py-4 transition-all duration-300"
                style={{
                  fontFamily: '"Press Start 2P", monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#ff2d95', border: '1px solid rgba(255,45,149,0.25)', background: 'rgba(255,45,149,0.05)',
                  borderRadius: '3px', textShadow: '0 0 8px rgba(255,45,149,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff2d95';
                  e.currentTarget.style.color = '#0b0420';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255,45,149,0.3)';
                  e.currentTarget.style.textShadow = 'none';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,45,149,0.05)';
                  e.currentTarget.style.color = '#ff2d95';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.textShadow = '0 0 8px rgba(255,45,149,0.3)';
                }}>
                ▸ SEND TRANSMISSION
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
