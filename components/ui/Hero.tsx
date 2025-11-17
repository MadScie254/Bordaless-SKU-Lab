
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[60vh] min-h-[400px] mb-8 flex items-center justify-center text-center text-white overflow-hidden border border-border">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        poster="/assets/hero-poster.jpg"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 p-4 animate-fade-in">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary tracking-wide">
          VERIFIED GLOBAL SOURCING
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-text-base">
          Unlock direct access to a curated network of trusted artisans and producers. Every product, verified and ready for your supply chain.
        </p>
        <button className="px-8 py-4 bg-primary text-black font-bold border-2 border-primary/50 hover:bg-transparent hover:text-primary hover:border-primary transition-all duration-300 text-lg shadow-glow-primary hover:shadow-none">
          EXPLORE THE FEED
        </button>
      </div>
    </div>
  );
};

export default Hero;
