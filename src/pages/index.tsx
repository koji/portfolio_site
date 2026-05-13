import About from '@/components/About';
import Contact from '@/components/Contact';
import GoToTopButton from '@/components/GoToTopButton';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import PersonalProjects from '@/components/PersonalProjects';
import { WorkProjects } from '@/components/WorkProjects';
import React, { useEffect } from 'react';

export const Index = () => {
  useEffect(() => {
    if (!('scrollBehavior' in document.documentElement.style)) {
      import('smoothscroll-polyfill').then((smoothscroll) => {
        smoothscroll.polyfill();
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-notion-canvas text-notion-ink">
      <Navigation />

      <main>
        <Hero />
        <About />
        <WorkProjects />
        <PersonalProjects />
        <Contact />
      </main>

      <GoToTopButton
        position="bottom-right"
        showAfter={150}
        showScrollProgress={true}
        className="debug-go-to-top"
      />
    </div>
  );
};
