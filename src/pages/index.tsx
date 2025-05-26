
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import { WorkProjects } from '@/components/WorkProjects';
import PersonalProjects from '@/components/PersonalProjects';
import Contact from '@/components/Contact';
import BonsaiShaderBackground from '@/components/BonsaiShaderBackground';

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
    </div>
  );
};
