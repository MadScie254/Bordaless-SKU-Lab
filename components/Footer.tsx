
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-1 border-t border-border mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-text-muted">
        <p>&copy; {new Date().getFullYear()} Danco Analytics // A Verified Supply Chain Initiative</p>
        <p className="text-xs mt-1">TRANSLATING LOCAL PRODUCTION INTO GLOBAL OPPORTUNITY</p>
      </div>
    </footer>
  );
};

export default Footer;