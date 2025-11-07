
import React from 'react';

interface HeaderProps {
  currentView: 'discovery' | 'dashboard' | 'detail';
  setView: (view: 'discovery' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItemClasses = "px-4 py-2 border border-transparent hover:border-primary-lime transition-colors duration-200";
  const activeNavItemClasses = "border-primary-lime bg-primary-lime/10";

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-sm border-b border-dark-gray">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 
            className="text-xl md:text-2xl font-bold text-primary-lime cursor-pointer"
            onClick={() => setView('discovery')}
        >
          BORDERLESS SKU LAB
        </h1>
        <nav className="flex items-center border border-dark-gray">
          <button 
            onClick={() => setView('discovery')}
            className={`${navItemClasses} ${currentView === 'discovery' || currentView === 'detail' ? activeNavItemClasses : ''}`}
          >
            BUYER DISCOVERY
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`${navItemClasses} ${currentView === 'dashboard' ? activeNavItemClasses : ''} border-l border-dark-gray`}
          >
            SUPPLIER DASHBOARD
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
