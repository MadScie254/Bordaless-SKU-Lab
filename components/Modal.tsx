
import React, { ReactNode } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-surface-glass backdrop-blur-lg border border-primary/50 text-text-base w-full max-w-2xl shadow-glow-secondary animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-primary/50">
          <h2 className="text-2xl font-bold text-secondary">{title}</h2>
          <button onClick={onClose} className="text-primary hover:opacity-80 transition-opacity">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;