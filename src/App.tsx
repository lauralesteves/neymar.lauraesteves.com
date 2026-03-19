import { useCallback, useEffect, useState } from 'react';
import { AudioButton } from './components/AudioButton/AudioButton';
import { FallingNeymar } from './components/FallingNeymar/FallingNeymar';
import { Footer } from './components/Footer/Footer';
import { GithubCorner } from './components/GithubCorner/GithubCorner';
import { Navbar } from './components/Navbar/Navbar';

const STORAGE_KEY = 'audio-muted:neymar';

export default function App() {
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== 'false',
  );

  // Unlock audio on first user interaction
  useEffect(() => {
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      const ctx = new AudioContext();
      ctx.resume().then(() => ctx.close());
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/campo.webp')", backgroundColor: '#7bbcf3' }}
    >
      <GithubCorner />
      <Navbar />
      <FallingNeymar isMuted={isMuted} />
      <div className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3" style={{ bottom: 'calc(var(--spacing) * 16 + 14px)' }}>
        <AudioButton isMuted={isMuted} onToggle={toggleMute} />
        <p className="bg-black text-white text-xs font-body font-semibold text-center whitespace-nowrap rounded-full px-6 py-2 shadow-lg">
          <span className="hidden md:inline">Clique e arraste o Neymar caído para jogá-lo de novo</span>
          <span className="md:hidden">Toque e arraste o Neymar caído para jogá-lo de novo</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}
