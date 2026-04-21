import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="font-sans antialiased text-zinc-900 bg-white">
      <Navbar />
      <Hero />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
