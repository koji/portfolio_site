import About from '@/components/About';
import BonsaiShaderBackground from '@/components/BonsaiShaderBackground';
import Contact from '@/components/Contact';
import GoToTopButton from '@/components/GoToTopButton';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import PersonalProjects from '@/components/PersonalProjects';
import { WorkProjects } from '@/components/WorkProjects';
import React, { useEffect } from 'react';

export const Index = () => {
  useEffect(() => {
    // Smooth scrolling polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      import('smoothscroll-polyfill').then((smoothscroll) => {
        smoothscroll.polyfill();
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Shader-based Bonsai Background */}
      <BonsaiShaderBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />

        <main>
          <Hero />
          <About />
          <WorkProjects />
          <PersonalProjects />
          <Contact />
        </main>
      </div>

      {/* Go to Top Button - Positioned on the right for better accessibility */}
      <GoToTopButton 
        position="bottom-right"
        showAfter={150}
        showScrollProgress={true}
        className="debug-go-to-top"
      />
    </div>
  );
};
