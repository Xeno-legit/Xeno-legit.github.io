import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Columns, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useGSAP(() => {
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });
    }

    gsap.set('.project-card', { opacity: 0, y: 80 });
    gsap.set('.projects-separator', { scaleX: 0, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 80%',
        scrub: 1.5,
      },
    });

    tl.to('.projects-separator', {
      scaleX: 1, opacity: 1, duration: 0.5,
      ease: 'power1.inOut', transformOrigin: 'center',
    })
    .to(lineRef.current, {
      scaleY: 1, duration: 4, ease: 'none',
    })
    .to('.project-card', {
      opacity: 1, y: 0, duration: 2, stagger: 1.5, ease: 'power2.out',
    }, '-=3.5');
  }, { scope: sectionRef });

  return (
    <section id="projects" ref={sectionRef} className="relative w-full pt-10 pb-[20vh] overflow-hidden">
      <div className="projects-separator silver-line shimmer w-full h-[1px] absolute top-0 left-0" />

      {/* Main container wrapper: No max-w limit here so cards can be massive */}
      <div className="w-full relative min-h-[1000px] mt-24 py-10 flex flex-col items-center gap-40 px-4 md:px-12">
        
        {/* SVG background central line (z-0) */}
        <div className="absolute inset-0 top-0 left-1/2 -translate-x-1/2 w-[40px] pointer-events-none z-0 flex justify-center">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 40 1000"
          >
            <defs>
              <filter id="white-glow-line" x="-200%" y="-20%" width="400%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              ref={lineRef}
              x1="20" y1="0" x2="20" y2="1000"
              stroke="#ffffff"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
              filter="url(#white-glow-line)"
            />
          </svg>
        </div>

        {/* Project 1 (z-10 to sit on top of the line) */}
        <div className="project-card relative z-10 w-full" style={{ maxWidth: 'clamp(800px, 66vw, 1200px)' }}>
          <ProjectItem
            icon={<Columns size={72} color="#ffffff" strokeWidth={1} />}
            title="Finance Dashboard"
            shortDesc="A sophisticated analytics tool for institutional metrics."
            fullDesc="Built specifically for high-frequency trading platforms, this dashboard aggregates real-time market data into a highly performant interface. It features custom WebGL charts, modular widget layouts, and sub-millisecond data synchronization via WebSockets."
          />
        </div>

        {/* Project 2 */}
        <div className="project-card relative z-10 w-full" style={{ maxWidth: 'clamp(800px, 66vw, 1200px)' }}>
          <ProjectItem
            icon={<Database size={72} color="#ffffff" strokeWidth={1} />}
            title="Graph Database"
            shortDesc="Distributed storage architecture for relationship mapping."
            fullDesc="Designed from the ground up for massive scale, this graph database implements a novel sharding strategy for lightning-fast traversal of deep relationship networks. Features an entirely custom-built query language and high-availability clustered architecture."
          />
        </div>

      </div>
    </section>
  );
}

interface ProjectItemProps {
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  fullDesc: string;
}

function ProjectItem({ icon, title, shortDesc, fullDesc }: ProjectItemProps) {
  return (
    <div 
      className="flex flex-col items-center gap-8 p-12 md:p-16 rounded-3xl glass-panel text-center backdrop-blur-2xl relative overflow-hidden"
      style={{
        boxShadow: '0 0 50px rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        // Deep opaque background so the white line definitively breaks behind it and doesn't pollute the content
        background: 'rgba(7,7,7,0.92)', 
      }}
    >
      {/* Icon with strong glow container */}
      <div
        className="project-logo flex items-center justify-center p-6 rounded-2xl"
        style={{
          boxShadow: '0 0 30px rgba(255,255,255,0.08) inset, 0 0 20px rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(20,20,20,0.6)',
        }}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="project-title text-4xl md:text-5xl font-display font-medium glow-silver" style={{ color: '#ffffff' }}>
          {title}
        </h3>
        <p className="font-mono text-sm tracking-widest uppercase" style={{ color: '#a1a1aa' }}>
          {shortDesc}
        </p>
      </div>

      <p className="project-desc text-base md:text-lg font-sans leading-relaxed max-w-4xl" style={{ color: '#71717a' }}>
        {fullDesc}
      </p>

      <button
        className="project-btn mt-6 px-10 py-4 font-mono text-sm tracking-[0.2em] uppercase rounded transition-all duration-300 relative overflow-hidden group"
        style={{
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.03)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#000000';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,1)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span className="relative z-10 font-bold">View project</span>
        {/* Fill effect on hover */}
        <div 
          className="absolute inset-0 z-0 bg-[#ffffff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </button>
    </div>
  );
}
