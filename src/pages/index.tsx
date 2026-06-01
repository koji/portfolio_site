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
    <a
      href="#main-content"
      onClick={() => document.getElementById('main-content')?.focus()}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:rounded focus:shadow-lg focus:text-[#37352F]"
    >
      Skip to content
    </a>
  <Navigation />

  <main id="main-content" tabIndex={-1}>
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
