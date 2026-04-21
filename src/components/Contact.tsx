import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Initial states to avoid flashes and scrub-jumping
    gsap.set(".contact-text", { opacity: 0, y: 50 });
    // Lowered X offset translation so sliding feels deep but not excessively fast during scrub
    gsap.set(".contact-form", { opacity: 0, x: 80 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", // Triggers slightly earlier while entering view
        end: "center 30%", // Gives much more vertical scroll distance to execute beautifully
        scrub: 1.5, // 1.5 second smoothing on scrub physics matches Projects.tsx nicely!
      }
    });

    tl.to(".contact-text", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      .to(".contact-form", { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, "<");
      
  }, { scope: sectionRef });

  return (
    <section id="contact" ref={sectionRef} className="bg-zinc-50 py-32 px-8 overflow-hidden relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-8 items-center">
        
        {/* Left Side: Creative Contact Prompt */}
        <div className="contact-text flex-1 pb-16 md:pb-0">
          <div>
            <h2 className="text-6xl md:text-8xl font-display font-medium text-black mb-6 tracking-tight">
              Let's talk.
            </h2>
            <p className="text-xl text-zinc-500 font-sans max-w-sm mb-12">
              Have a unique project in mind? Reach out to discuss details, or just to say hello.
            </p>
            <div className="flex gap-4 items-center">
              <span className="w-12 h-[1px] bg-blue-600 inline-block" />
              <span className="font-mono text-sm tracking-wider uppercase text-blue-600 font-bold">
                Open for opportunities
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Side: Form sliding in from the right */}
        <div className="contact-form flex-1 w-full max-w-lg">
          <form 
            className="bg-white p-10 rounded-none md:rounded-2xl shadow-2xl shadow-zinc-200/50 relative border border-zinc-100"
          >
            {/* Edge decorative marker */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-600 m-6" />
            
            <div className="flex flex-col gap-8">
              <div>
                <label className="block text-sm font-sans font-medium text-zinc-900 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 focus:bg-white focus:border-blue-600 outline-none transition-all font-sans text-lg" 
                  placeholder="John Doe" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-sans font-medium text-zinc-900 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 focus:bg-white focus:border-blue-600 outline-none transition-all font-sans text-lg" 
                  placeholder="john@example.com" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-sans font-medium text-zinc-900 mb-2">Message</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-zinc-50 border-b-2 border-zinc-200 px-4 py-3 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none font-sans text-lg" 
                  placeholder="How can I help you?" 
                />
              </div>
              
              <button 
                type="button" 
                className="w-full bg-zinc-950 text-white rounded px-4 py-5 font-sans font-medium tracking-wide hover:bg-blue-600 hover:tracking-widest transition-all mt-4"
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
