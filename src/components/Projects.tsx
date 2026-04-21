import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Columns, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trunkRef = useRef<SVGPathElement>(null);
  const leftBranchRef = useRef<SVGPathElement>(null);
  const rightBranchRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    // Force highly specific initial states to prevent browser popping and allow clean CSS parsing
    gsap.set([trunkRef.current, leftBranchRef.current, rightBranchRef.current], {
      strokeDasharray: 1,
      strokeDashoffset: 1
    });
    
    // Explicit initial positions so scrub rewind always has a base to revert to
    gsap.set(".project-title", { opacity: 0, y: 30 });
    gsap.set(".project-desc", { opacity: 0, y: 15 });
    gsap.set(".project-btn", { opacity: 0, y: 15 });
    gsap.set(".separator-line", { scaleX: 0, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        // Start sooner
        start: "top 60%", 
        // End MUCH deeper in the scroll so the animation has 600-800px to happen (fixes fast/unsmooth feel)
        end: "bottom 80%", 
        // Generous scrubbing duration creates deeply smooth rewind effect preventing jumpiness
        scrub: 1.5, 
      }
    });

    // Proportional GSAP scrubbing timeline.
    tl.to(".separator-line", { scaleX: 1, opacity: 1, duration: 1, ease: "power1.inOut", transformOrigin: "center" })
      .to(trunkRef.current, { strokeDashoffset: 0, duration: 3, ease: "none" })
      .to([leftBranchRef.current, rightBranchRef.current], { strokeDashoffset: 0, duration: 4, ease: "none" })
      // Use timeline offsets ("-=X") to gracefully overlap the logo spin, titles, and text
      .to(".project-logo", { rotation: 720, duration: 4.5, ease: "power2.inOut" }, "-=1.5")
      .to(".project-title", { opacity: 1, y: 0, duration: 2, stagger: 0.3 }, "-=3.5")
      .to(".project-desc", { opacity: 1, y: 0, duration: 2, stagger: 0.3 }, "-=3.2")
      .to(".project-btn", { opacity: 1, y: 0, duration: 2, stagger: 0.3 }, "-=2.8");
      
  }, { scope: sectionRef });

  return (
    // Massive bottom padding (`pb-[60vh]`) pushes the document down giving us raw scroll distance to slowly scrub our animation
    <section id="projects" ref={sectionRef} className="relative w-full bg-white pt-10 pb-[60vh] overflow-hidden">
      
      {/* Horizontal Blue Separator Line */}
      <div className="separator-line w-full h-[1px] bg-blue-200 absolute top-0 left-0" />

      <div ref={containerRef} className="max-w-[1000px] mx-auto w-full relative min-h-[600px] mt-24">
        
        {/* SVG Canvas carefully built with explicit math (0 0 1000 600) to prevent thick warped jagged strokes */}
        <svg 
          viewBox="0 0 1000 600" 
          className="absolute top-0 left-0 w-full h-[600px] pointer-events-none" 
          preserveAspectRatio="xMidYMin meet"
        >
          {/* Stroke width is locked natively minimizing thickness scaling. */}
          <g stroke="#3b82f6" fill="none" strokeWidth="1.5" strokeLinecap="round">
            {/* Trunk pulls flawlessly down the center */}
            <path 
              ref={trunkRef}
              d="M 500,0 L 500,200" 
              pathLength="1"
            />
            {/* Branches mathematically curve out and dive EXACTLY down to x=250 and x=750 */}
            <path 
              ref={leftBranchRef}
              d="M 500,200 C 500,450 250,450 250,600" 
              pathLength="1"
            />
            <path 
              ref={rightBranchRef}
              d="M 500,200 C 500,450 750,450 750,600" 
              pathLength="1"
            />
          </g>
        </svg>

        {/* Since x=250 in a 1000px viewBox is precisely 25%, placing elements at `left-[25%]` makes the line strike perfectly top-center of the logo instead of on the side. */}
        <div className="absolute top-[600px] left-[25%] -translate-x-1/2 pt-2 flex flex-col items-center text-center w-full max-w-[280px] md:max-w-[340px]">
          <ProjectItem 
            icon={<Columns size={48} className="text-black" strokeWidth={1.5} />} 
            title="Finance Dashboard" 
            desc="A sophisticated analytics tool for institutional metrics." 
          />
        </div>
        
        {/* x=750 is exactly 75% for the right logo. */}
        <div className="absolute top-[600px] left-[75%] -translate-x-1/2 pt-2 flex flex-col items-center text-center w-full max-w-[280px] md:max-w-[340px]">
          <ProjectItem 
            icon={<Database size={48} className="text-black" strokeWidth={1.5} />} 
            title="Graph Database" 
            desc="Distributed storage architecture for relationship mapping." 
          />
        </div>
      </div>
    </section>
  );
}

interface ProjectItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function ProjectItem({ icon, title, desc }: ProjectItemProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4">
      {/* Ensure logo perfectly kisses the end of the line */}
      <div className="project-logo bg-white flex items-center justify-center p-2">
        {icon}
      </div>
      <h3 className="project-title text-2xl md:text-3xl font-display font-medium text-black mt-2">
        {title}
      </h3>
      <p className="project-desc text-sm md:text-base text-zinc-500 font-sans leading-relaxed">
        {desc}
      </p>
      <button className="project-btn mt-4 px-8 py-3 bg-blue-600 text-white font-sans text-sm font-medium rounded hover:bg-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        View project
      </button>
    </div>
  );
}
