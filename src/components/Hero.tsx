import React from 'react';

const WorkspaceMockup = () => (
  <div className="bg-white rounded-[12px] border border-[#E9E9E7] shadow-notion-mockup overflow-hidden">
    {/* Mockup Header */}
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E9E9E7]">
      <span className="text-base">📋</span>
      <span className="text-sm font-semibold text-[#37352F]">Project Dashboard</span>
    </div>

    {/* Table Header */}
    <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 bg-[#F7F6F3] border-b border-[#E9E9E7]">
      <span className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Project</span>
      <span className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide">Status</span>
      <span className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide hidden sm:block">
        Stack
      </span>
    </div>

    {/* Rows */}
    <div className="divide-y divide-[#E9E9E7]">
      {/* Row 1: Opentrons App */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3">
        <span className="text-sm text-[#37352F] font-medium">Opentrons App</span>
        <span className="px-2 py-0.5 text-xs font-medium bg-[#EDFAF4] text-[#2D7D52] rounded-[4px] whitespace-nowrap">
          ● Active
        </span>
        <div className="hidden sm:flex gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 text-xs bg-[#EAF4FE] text-[#1A6FAD] rounded-[4px]">
            React
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">TS</span>
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">
            Redux
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#EDFAF4] text-[#2D7D52] rounded-[4px]">Electron</span>
          <span className="px-2 py-0.5 text-xs bg-[#FDEEF0] text-[#C53B5A] rounded-[4px]">
            Vite
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">
            CSS Modules
          </span>
        </div>
      </div>

      {/* Row 2: Opentrons AI */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3">
        <span className="text-sm text-[#37352F] font-medium">Opentrons AI</span>
        <span className="px-2 py-0.5 text-xs font-medium bg-[#EDFAF4] text-[#2D7D52] rounded-[4px] whitespace-nowrap">
          ● Active
        </span>
        <div className="hidden sm:flex gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">TS</span>
          <span className="px-2 py-0.5 text-xs bg-[#EAF4FE] text-[#1A6FAD] rounded-[4px]">
            React
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#EDFAF4] text-[#2D7D52] rounded-[4px]">
            Zustand
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#FDEEF0] text-[#C53B5A] rounded-[4px]">
            Vite
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">
            CSS Modules
          </span>
        </div>
      </div>

      {/* Row 3: IoT Hub System */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3">
        <span className="text-sm text-[#37352F] font-medium">IoT Hub System</span>
        <span className="px-2 py-0.5 text-xs font-medium bg-[#FEF0E4] text-[#C25A1C] rounded-[4px] whitespace-nowrap">
          ● 2020
        </span>
        <div className="hidden sm:flex gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 text-xs bg-[#FDEEF0] text-[#C53B5A] rounded-[4px]">
            Webpack
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">TS</span>
          <span className="px-2 py-0.5 text-xs bg-[#EAF4FE] text-[#1A6FAD] rounded-[4px]">
            React
          </span>
          {/* Redux を追加 */}
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">
            Redux
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#F1EFFE] text-[#5B46D9] rounded-[4px]">
            Three.js
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#FDEEF0] text-[#C53B5A] rounded-[4px]">
            Python
          </span>
          <span className="px-2 py-0.5 text-xs bg-[#FDEEF0] text-[#C53B5A] rounded-[4px]">
            styled-components
          </span>
        </div>
      </div>
    </div>

    {/* Footer row */}
    <div className="px-5 py-3 border-t border-[#E9E9E7] flex flex-wrap gap-2">
      {['React', 'TypeScript', 'Redux', 'Node.js', 'Python', 'Three.js', 'styled-components', 'CSS Modules'].map((tech) => (
        <span
          key={tech}
          className="px-2 py-0.5 text-xs text-[#787774] border border-[#E9E9E7] rounded-[4px] bg-white"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);

const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById('work');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#191E2C] pt-16">
      {/* Decorative colored dots */}
      <div className="absolute top-24 left-12 w-3 h-3 rounded-full bg-[#FEF0E4] opacity-80" />
      <div className="absolute top-40 left-32 w-2 h-2 rounded-full bg-[#FAED6A] opacity-70" />
      <div className="absolute top-20 right-16 w-4 h-4 rounded-full bg-[#EDFAF4] opacity-70" />
      <div className="absolute top-48 right-32 w-2.5 h-2.5 rounded-full bg-[#F1EFFE] opacity-80" />
      <div className="absolute top-36 right-64 w-2 h-2 rounded-full bg-[#FEF0E4] opacity-60" />
      <div className="absolute top-60 left-1/4 w-2 h-2 rounded-full bg-[#EAF4FE] opacity-70" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-24 pb-16">
        {/* Japanese Greeting */}
        <p className="text-white/65 font-japanese text-lg mb-3 animate-fade-in">こんにちは</p>

        {/* Main Heading */}
        <h1
          className="text-[60px] sm:text-[72px] lg:text-[80px] font-semibold text-white tracking-[-2px] leading-[1.05] mb-6 animate-fade-in"
          style={{ animationDelay: '0.15s' }}
        >
          I'm Koji
        </h1>

        {/* Subtitle */}
        <p
          className="text-[18px] text-white/80 leading-[1.5] mb-4 animate-fade-in"
          style={{ animationDelay: '0.25s' }}
        >
          Developer & Creator
        </p>

        {/* Description */}
        <p
          className="text-[16px] text-white/60 max-w-xl mx-auto leading-[1.6] mb-10 animate-fade-in"
          style={{ animationDelay: '0.35s' }}
        >
          Building digital experiences with modern web technologies, open-source contributions, and
          a passion for clean, accessible design.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16 animate-fade-in"
          style={{ animationDelay: '0.45s' }}
        >
          <button
            type="button"
            onClick={scrollToProjects}
            className="bg-[#7766E4] text-white rounded-[8px] px-[24px] py-[11px] text-sm font-medium hover:bg-[#6655D8] transition-colors"
          >
            View My Work
          </button>
          <button
            type="button"
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border border-white/30 text-white/85 bg-transparent rounded-[8px] px-[24px] py-[11px] text-sm font-medium hover:border-white/60 hover:text-white transition-colors"
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
