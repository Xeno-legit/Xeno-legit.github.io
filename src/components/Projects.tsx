import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Columns, Database } from 'lucide-react';
import errorVideoSrc from '@/ERROR.mp4';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.set('.project-card', { opacity: 0, y: 80, rotateX: 4 });
    gsap.set('.projects-separator', { scaleX: 0, opacity: 0 });
    gsap.set('.projects-header', { opacity: 0, x: -30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1.5,
      },
    });

    tl.to('.projects-separator', { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power1.inOut', transformOrigin: 'center' })
      .to('.projects-header', { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to('.project-card', { opacity: 1, y: 0, rotateX: 0, duration: 2, stagger: 1, ease: 'power2.out' }, '-=0.2');
  }, { scope: sectionRef });

  return (
    <section id="projects" ref={sectionRef} className="relative w-full pt-10 pb-[20vh] overflow-hidden">
      <div className="projects-separator silver-line shimmer w-full h-[1px] absolute top-0 left-0" />

      {/* Section header — VHS label style */}
      <div className="max-w-6xl mx-auto px-8 mb-16">
        <div className="projects-header flex items-center gap-4">
          <div className="w-8 h-[2px]" style={{ background: 'linear-gradient(90deg, #ff2d95, transparent)' }} />
          <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: 'rgba(255, 45, 149, 0.5)', letterSpacing: '0.3em' }}>
            SELECTED_WORKS
          </span>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(0,240,255,0.1), transparent)' }} />
        </div>
      </div>

      {/* Project cards */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col gap-16">

        <div className="project-card">
          <VHSTapeCard
            icon={<Columns size={48} color="#00f0ff" strokeWidth={1.2} />}
            title="Finance Dashboard"
            tapeLabel="TAPE-001"
            tapeColor="#00f0ff"
            shortDesc="A sophisticated analytics tool for institutional metrics."
            fullDesc="Built specifically for high-frequency trading platforms, this dashboard aggregates real-time market data into a highly performant interface. It features custom WebGL charts, modular widget layouts, and sub-millisecond data synchronization via WebSockets."
            tags={['React', 'WebGL', 'WebSockets', 'D3.js']}
          />
        </div>

        <div className="project-card">
          <VHSTapeCard
            icon={<Database size={48} color="#ff2d95" strokeWidth={1.2} />}
            title="Graph Database"
            tapeLabel="TAPE-002"
            tapeColor="#ff2d95"
            shortDesc="Distributed storage architecture for relationship mapping."
            fullDesc="Designed from the ground up for massive scale, this graph database implements a novel sharding strategy for lightning-fast traversal of deep relationship networks. Features an entirely custom-built query language and high-availability clustered architecture."
            tags={['TypeScript', 'GraphQL', 'Node.js', 'Docker']}
          />
        </div>

      </div>
    </section>
  );
}

interface VHSTapeCardProps {
  icon: React.ReactNode;
  title: string;
  tapeLabel: string;
  tapeColor: string;
  shortDesc: string;
  fullDesc: string;
  tags: string[];
}

function VHSTapeCard({ icon, title, tapeLabel, tapeColor, shortDesc, fullDesc, tags }: VHSTapeCardProps) {
  const handleViewProjectClick = () => {
    window.dispatchEvent(new CustomEvent('play-video', { detail: { src: errorVideoSrc } }));
  };

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* VHS Tape Case outer shell */}
      <div className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(20, 10, 45, 0.95) 0%, rgba(11, 4, 32, 0.98) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.08)',
          borderRadius: '6px',
          boxShadow: `0 0 60px rgba(0,0,0,0.6), 0 0 1px ${tapeColor}22`,
        }}>

        {/* Tape spine — colored strip on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ background: `linear-gradient(180deg, ${tapeColor}, ${tapeColor}88, ${tapeColor})`, opacity: 0.6 }} />

        {/* Top bar — VHS label strip */}
        <div className="flex items-center justify-between px-8 py-3"
          style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.05)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: tapeColor, letterSpacing: '0.2em', opacity: 0.7 }}>
              {tapeLabel}
            </span>
            <div className="w-6 h-[1px]" style={{ background: `${tapeColor}33` }} />
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
              SP · HQ
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Reel holes */}
            <div className="w-4 h-4 rounded-full" style={{ border: `1px solid ${tapeColor}33`, background: 'rgba(0,0,0,0.4)' }}>
              <div className="w-1.5 h-1.5 rounded-full mx-auto mt-[3px]" style={{ background: `${tapeColor}22` }} />
            </div>
            <div className="w-4 h-4 rounded-full" style={{ border: `1px solid ${tapeColor}33`, background: 'rgba(0,0,0,0.4)' }}>
              <div className="w-1.5 h-1.5 rounded-full mx-auto mt-[3px]" style={{ background: `${tapeColor}22` }} />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10 pl-10">
          {/* Icon block */}
          <div className="flex-shrink-0 flex items-start justify-center pt-2">
            <div className="p-5 rounded-lg relative"
              style={{
                border: `1px solid ${tapeColor}20`,
                background: `${tapeColor}08`,
                boxShadow: `0 0 25px ${tapeColor}08 inset`,
              }}>
              {icon}
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2" style={{ borderTop: `1px solid ${tapeColor}44`, borderLeft: `1px solid ${tapeColor}44` }} />
              <div className="absolute bottom-0 right-0 w-2 h-2" style={{ borderBottom: `1px solid ${tapeColor}44`, borderRight: `1px solid ${tapeColor}44` }} />
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(12px, 2vw, 18px)', color: '#eee8ff', letterSpacing: '0.05em',
              textShadow: `0 0 20px ${tapeColor}33` }}>
              {title}
            </h3>
            <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', color: 'rgba(255, 184, 0, 0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {shortDesc}
            </p>
            <p style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: 'rgba(238, 232, 255, 0.45)', lineHeight: '1.6' }}>
              {fullDesc}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag}
                  style={{
                    fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', letterSpacing: '0.1em',
                    color: `${tapeColor}88`, border: `1px solid ${tapeColor}20`, background: `${tapeColor}08`,
                    padding: '4px 10px', borderRadius: '2px',
                  }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* View button */}
            <button onClick={handleViewProjectClick}
              className="mt-4 self-start px-8 py-3 text-[9px] tracking-[0.2em] uppercase relative overflow-hidden group transition-all duration-100 active:translate-y-1"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: '#0b0420', 
                border: '3px solid #0b0420', 
                background: tapeColor,
                borderRadius: '2px',
                boxShadow: `inset 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 0 rgba(0,0,0,0.3), 0 5px 0 #0b0420`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `inset 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 0 rgba(0,0,0,0.3), 0 8px 0 #0b0420, 0 10px 20px ${tapeColor}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `inset 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 0 rgba(0,0,0,0.3), 0 5px 0 #0b0420`;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = `inset 2px 2px 0 rgba(255,255,255,0.5), inset -2px -2px 0 rgba(0,0,0,0.3), 0 1px 0 #0b0420`;
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `inset 4px 4px 0 rgba(255,255,255,0.5), inset -4px -4px 0 rgba(0,0,0,0.3), 0 8px 0 #0b0420, 0 10px 20px ${tapeColor}33`;
              }}>
              <span className="relative z-10 font-bold">▸ View Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
