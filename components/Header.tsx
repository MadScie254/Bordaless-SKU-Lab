
import React from 'react';
import { MoonIcon, SunIcon, SoundOnIcon, SoundOffIcon, CommandIcon } from './icons';

interface HeaderProps {
  currentView: 'discovery' | 'dashboard' | 'detail' | 'market';
  setView: (view: 'discovery' | 'dashboard' | 'market') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onCommandPaletteOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, theme, toggleTheme, soundEnabled, toggleSound, onCommandPaletteOpen }) => {
  const navItemClasses = "px-4 py-2 border border-transparent hover:border-primary transition-colors duration-200 text-text-base";
  const activeNavItemClasses = "border-primary bg-primary/10 text-primary";

  return (
    <header className="sticky top-0 z-50 bg-surface-glass backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
            className="flex items-center gap-3 text-xl md:text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setView('discovery')}
        >
          <img src="/assets/logo.png" alt="Danco Analytics Logo" className="h-8 w-8 object-contain"/>
          <h1>Danco Analytics</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onCommandPaletteOpen} 
            className="hidden md:flex items-center gap-2 text-xs p-2 border border-border text-text-muted hover:bg-surface-2 transition-colors"
          >
            <CommandIcon className="h-4 w-4" /> CMD+K
          </button>
          <nav className="hidden md:flex items-center border border-border">
            <button 
              onClick={() => setView('discovery')}
              className={`${navItemClasses} ${currentView === 'discovery' || currentView === 'detail' ? activeNavItemClasses : ''}`}
            >
              DISCOVERY
            </button>
            <button 
              onClick={() => setView('market')}
              className={`${navItemClasses} ${currentView === 'market' ? activeNavItemClasses : ''} border-l border-border`}
            >
              MARKET TRENDS
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`${navItemClasses} ${currentView === 'dashboard' ? activeNavItemClasses : ''} border-l border-border`}
            >
              SUPPLIER DASHBOARD
            </button>
          </nav>
          <button 
            onClick={toggleSound} 
            className="p-2 border border-border hover:bg-surface-2 transition-colors"
            aria-label={`Toggle sound ${soundEnabled ? 'off' : 'on'}`}
          >
            {soundEnabled ? <SoundOnIcon className="h-5 w-5 text-primary" /> : <SoundOffIcon className="h-5 w-5 text-primary" />}
          </button>
          <button 
            onClick={toggleTheme} 
            className="p-2 border border-border hover:bg-surface-2 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5 text-primary" /> : <MoonIcon className="h-5 w-5 text-primary" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
