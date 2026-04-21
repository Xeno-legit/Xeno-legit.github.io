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
    gsap.set('.contact-form-wrapper', { opacity: 0, x: 80 });

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
      .to('.contact-form-wrapper', { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '<');
  }, { scope: sectionRef });

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 px-8 overflow-hidden">
      {/* Top separator */}
      <div className="silver-line shimmer w-full h-[1px] mb-20" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 items-center">
        {/* Left: Heading */}
        <div className="flex-1 pb-16 md:pb-0">
          <div>
            <h2
              className="contact-heading font-display font-700 tracking-tight mb-6 chromatic"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                color: '#e4e4e7',
                lineHeight: 0.9,
              }}
            >
              Let's talk.
            </h2>

            <p className="contact-heading text-lg font-sans max-w-sm mb-10" style={{ color: '#666' }}>
              Have a unique project in mind? Reach out to discuss details, or just to say hello.
            </p>

            {/* Status badge */}
            <div className="contact-badge flex gap-3 items-center">
              <span className="w-10 h-[1px] inline-block" style={{ background: 'rgba(200,200,210,0.3)' }} />
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full"
                style={{
                  color: '#999',
                  border: '1px solid rgba(200,200,210,0.12)',
                  background: 'rgba(200,200,210,0.03)',
                }}
              >
                Open for opportunities
              </span>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-form-wrapper flex-1 w-full max-w-lg">
          <form
            className="glass-panel p-10 rounded-lg relative"
            style={{
              border: '1px solid rgba(200,200,210,0.08)',
              boxShadow: '0 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Corner decoration */}
            <div
              className="absolute top-0 right-0 w-6 h-6 m-5"
              style={{
                borderTop: '2px solid rgba(200,200,210,0.2)',
                borderRight: '2px solid rgba(200,200,210,0.2)',
              }}
            />

            <div className="flex flex-col gap-8">
              <div>
                <label className="block text-xs font-mono font-medium mb-2 tracking-wider uppercase" style={{ color: '#666' }}>
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent px-0 py-3 outline-none transition-all font-sans text-base"
                  style={{
                    color: '#d4d4d8',
                    borderBottom: '1px solid rgba(200,200,210,0.1)',
                  }}
                  placeholder="John Doe"
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(200,200,210,0.4)';
                    e.target.style.boxShadow = '0 1px 0 0 rgba(200,200,210,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(200,200,210,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium mb-2 tracking-wider uppercase" style={{ color: '#666' }}>
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent px-0 py-3 outline-none transition-all font-sans text-base"
                  style={{
                    color: '#d4d4d8',
                    borderBottom: '1px solid rgba(200,200,210,0.1)',
                  }}
                  placeholder="john@example.com"
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(200,200,210,0.4)';
                    e.target.style.boxShadow = '0 1px 0 0 rgba(200,200,210,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(200,200,210,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium mb-2 tracking-wider uppercase" style={{ color: '#666' }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent px-0 py-3 outline-none transition-all resize-none font-sans text-base"
                  style={{
                    color: '#d4d4d8',
                    borderBottom: '1px solid rgba(200,200,210,0.1)',
                  }}
                  placeholder="How can I help you?"
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(200,200,210,0.4)';
                    e.target.style.boxShadow = '0 1px 0 0 rgba(200,200,210,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(200,200,210,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="button"
                className="w-full rounded px-4 py-4 font-mono text-xs tracking-[0.2em] uppercase mt-4 transition-all duration-300"
                style={{
                  color: '#999',
                  border: '1px solid rgba(200,200,210,0.15)',
                  background: 'rgba(200,200,210,0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(220,220,230,0.9)';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.borderColor = 'rgba(220,220,230,0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(200,200,210,0.03)';
                  e.currentTarget.style.color = '#999';
                  e.currentTarget.style.borderColor = 'rgba(200,200,210,0.15)';
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
