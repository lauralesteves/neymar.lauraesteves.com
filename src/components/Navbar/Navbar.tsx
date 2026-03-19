import { LanguageFlag } from './LanguageFlag';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="flex items-center justify-between px-6 py-1">
        <span className="font-logo text-white" style={{ fontSize: '3em' }}>
          Neymar
        </span>
        <LanguageFlag />
      </div>
    </nav>
  );
}
