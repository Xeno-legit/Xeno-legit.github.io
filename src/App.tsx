import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';
import monitorImg from '@/monitor.png';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans antialiased text-[#e4e4e7] bg-transparent flex items-center justify-center">
      
      {/* 1. UNIVERSAL SPACE BACKGROUND */}
      <ThreeBackground />

      {/* 2. THE HARDWARE FRAME CONTAINER */}
      {/* 
        This container perfectly locks to the aspect ratio of monitor.png (2134x1403).
        It will scale up as much as possible without breaking the window bounds (max-h-[95vh] max-w-[95vw]).
        This ensures the monitor NEVER STRETCHES Or distorts. Space flows around it. 
      */}
      <div 
        className="relative shadow-2xl flex items-center justify-center"
        style={{
          width: '100%',
          maxWidth: '100vw',
          maxHeight: '100vh',
          aspectRatio: '2134 / 1403', 
        }}
      >
        
        {/* The Monitor Image Overlay */}
        {/* We place it first in the DOM or last. If it's absolute, we control via zIndex. */}
        <img 
          src={monitorImg} 
          alt="Hardware Screen" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-[100]"
        />

        {/* 3. THE INTERNAL SCREEN CONTENT (Mapped perfectly to the glass cut-out) */}
        {/* The screen dives securely behind the physical bezel mask of the monitor image */}
        <div 
          className="absolute z-10 overflow-hidden"
          style={{
            top: '5.5%', 
            bottom: '9%', 
            left: '3.5%', 
            right: '20.5%',
            borderRadius: '20px', // Soft curve to ensure corners hide cleanly beneath the PNG's rounded mask
            background: 'rgba(5, 5, 5, 0.4)', // Very translucent tint, letting the universal starfield strictly through
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)', // Depth shadow along the inner rim of the glass
          }}
        >
          {/* Scrollable container inside the bounds */}
          <div className="w-full h-full overflow-y-auto overflow-x-hidden pt-12 pb-24 relative z-10 crt-screen">
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <Contact />
            <Footer />
          </div>

          {/* 4. VHS & CRT EFFECTS (Fixed directly to the screen glass boundaries) */}
          <div className="absolute inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-50 crt-grain" />
          <div className="absolute inset-0 pointer-events-none z-[60] mix-blend-multiply crt-vignette" />
          <div className="absolute inset-0 pointer-events-none z-[60] mix-blend-multiply opacity-60 crt-scanlines" />
          <div className="absolute inset-0 pointer-events-none z-[70] crt-glitch"><div /></div>
        
          {/* Glass reflection highlight on top of everything for the curved display illusion */}
          <div 
            className="absolute top-0 left-0 w-full h-[30%] pointer-events-none z-[80] rounded-b-[50%] opacity-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,1), transparent)'
            }}
          />
        </div>

      </div>
    </div>
  );
}
