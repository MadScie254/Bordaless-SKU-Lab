
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SearchIcon } from './icons';

interface CommandPaletteProps {
  onClose: () => void;
  navigate: (view: 'discovery' | 'dashboard') => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands = [
    { name: 'Go to Buyer Discovery', action: () => navigate('discovery') },
    { name: 'Go to Supplier Dashboard', action: () => navigate('dashboard') },
    // Add more commands here, e.g., search, create SKU
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-surface-glass backdrop-blur-lg border border-primary/50 text-text-base w-full max-w-xl shadow-glow-secondary animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b border-border">
          <SearchIcon className="h-5 w-5 text-text-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-text-base placeholder-text-muted outline-none"
          />
        </div>
        <div className="p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map(cmd => (
              <button
                key={cmd.name}
                onClick={cmd.action}
                className="w-full text-left p-3 hover:bg-primary/10 text-text-base rounded-md"
              >
                {cmd.name}
              </button>
            ))
          ) : (
            <p className="p-3 text-text-muted">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
