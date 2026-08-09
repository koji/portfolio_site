import React from 'react';
import { DECORATIVE_DOTS } from '../types/hero';
import { WorkspaceMockup } from './WorkspaceMockup';

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#191E2C] pt-16">
      {/* Background Decorative Dots */}
      {DECORATIVE_DOTS.map((dot, index) => (
        <div
          key={index}
          aria-hidden="true"
          className={`absolute rounded-full ${dot.className}`}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-24 pb-16">
        <p className="text-white/65 font-japanese text-lg mb-3 animate-fade-in">
          こんにちは
        </p>

        <h1
          className="text-[60px] sm:text-[72px] lg:text-[80px] font-semibold text-white tracking-[-2px] leading-[1.05] mb-6 animate-fade-in"
          style={{ animationDelay: '0.15s' }}
        >
          I'm Koji
        </h1>

        <p
          className="text-[18px] text-white/80 leading-[1.5] mb-4 animate-fade-in"
          style={{ animationDelay: '0.25s' }}
        >
          Developer & Creator
        </p>

        <p
          className="text-[16px] text-white/60 max-w-xl mx-auto leading-[1.6] mb-10 animate-fade-in"
          style={{ animationDelay: '0.35s' }}
        >
          Building digital experiences with modern web technologies, open-source
          contributions, and a passion for clean, accessible design.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16 animate-fade-in"
          style={{ animationDelay: '0.45s' }}
        >
          <button
            type="button"
            onClick={() => handleScrollTo('work')}
            className="bg-[#7766E4] text-white rounded-[8px] px-[24px] py-[11px] text-sm font-medium hover:bg-[#6655D8] transition-colors cursor-pointer"
          >
            View My Work
          </button>
          <button
            type="button"
            onClick={() => handleScrollTo('contact')}
            className="border border-white/30 text-white/85 bg-transparent rounded-[8px] px-[24px] py-[11px] text-sm font-medium hover:border-white/60 hover:text-white transition-colors cursor-pointer"
          >
            Get In Touch
          </button>
        </div>

        {/* Workspace Mockup Card */}
        <div className="animate-fade-in" style={{ animationDelay: '0.55s' }}>
          <WorkspaceMockup />
        </div>
      </div>
    </section>
  );
};

export default Hero;
