import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AudioButton } from './components/AudioButton/AudioButton';
import { FallingNeymar } from './components/FallingNeymar/FallingNeymar';
import { Footer } from './components/Footer/Footer';
import { GithubCorner } from './components/GithubCorner/GithubCorner';
import { Navbar } from './components/Navbar/Navbar';
import { LocaleContext, getLocaleFromPath } from './i18n/LocaleContext';
import { translations } from './i18n/translations';
import { useMetaTags } from './i18n/useMetaTags';

const STORAGE_KEY = 'audio-muted:neymar';

function HomePage() {
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== 'false',
  );

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
    <FallingNeymarPage isMuted={isMuted} toggleMute={toggleMute} />
  );
}

function FallingNeymarPage({ isMuted, toggleMute }: { isMuted: boolean; toggleMute: () => void }) {
  const { t } = useLocale();

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
          <span className="hidden md:inline">{t.dragInstruction.desktop}</span>
          <span className="md:hidden">{t.dragInstruction.mobile}</span>
        </p>
      </div>
      <Footer />
    </div>
  );
}

function LocaleLayout() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const t = translations[locale];
  const basePath = locale === 'pt' ? '' : `/${locale}`;

  useMetaTags(t);

  return (
    <LocaleContext.Provider value={{ locale, t, basePath }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/en" element={<HomePage />} />
        <Route path="/es" element={<HomePage />} />
      </Routes>
    </LocaleContext.Provider>
  );
}

import { useLocale } from './i18n/LocaleContext';

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<LocaleLayout />} />
    </Routes>
  );
}
