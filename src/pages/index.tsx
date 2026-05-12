import About from '@/components/About';
import ChaosBackground from '@/components/ChaosBackground';
import Contact from '@/components/Contact';
import GoToTopButton from '@/components/GoToTopButton';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import PersonalProjects from '@/components/PersonalProjects';
import { WorkProjects } from '@/components/WorkProjects';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Smooth scrolling polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      import('smoothscroll-polyfill').then((smoothscroll) => {
        smoothscroll.polyfill();
      });
    }
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace('#', '');
    const element = document.getElementById(sectionId);
    if (!element) return;

    const timer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth' });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Shader-based Chaos Background */}
      <ChaosBackground />

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
