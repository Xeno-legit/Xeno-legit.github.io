import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';

export default function App() {
  return (
    <div className="relative min-h-screen font-sans antialiased text-[#e4e4e7]">
      
      {/* 1. UNIVERSAL SPACE BACKGROUND (fixed behind everything) */}
      <ThreeBackground />

      {/* 2. CRT EFFECTS (fixed overlays on top of everything) */}
      <div className="fixed inset-0 pointer-events-none z-[60] mix-blend-overlay opacity-50 crt-grain" />
      <div className="fixed inset-0 pointer-events-none z-[60] mix-blend-multiply crt-vignette" />
      <div className="fixed inset-0 pointer-events-none z-[60] mix-blend-multiply opacity-60 crt-scanlines" />
      <div className="fixed inset-0 pointer-events-none z-[70] crt-glitch"><div /></div>

      {/* 3. CRT BARREL LENS — curved border clips corners like a real CRT screen */}
      <div className="crt-barrel-overlay" />

      {/* 4. PAGE CONTENT (scrolls naturally via the body) */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
