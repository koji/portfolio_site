import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="text-xl font-bold font-japanese hover:text-primary transition-colors"
            >
              Koji/こうじ
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                About
              </button>

              {/* Projects Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="font-medium text-foreground/80 hover:text-primary"
                  >
                    Projects
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border">
                  <DropdownMenuItem
                    onClick={() => scrollToSection('work')}
                    className="cursor-pointer hover:bg-accent"
                  >
                    Work
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => scrollToSection('personal')}
                    className="cursor-pointer hover:bg-accent"
                  >
                    Personal Projects
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a
                href="https://baxin.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Blog
              </a>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2">
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('work')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left"
              >
                Work
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('personal')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left"
              >
                Personal Projects
              </button>
              <a
                href="https://baxin.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-foreground/80 hover:text-primary"
              >
                Blog
              </a>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-foreground/80 hover:text-primary w-full text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
