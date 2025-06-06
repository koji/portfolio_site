import { Button } from '@/components/ui/button';
import { Moon, Sun, TreeDeciduous } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type ThemeOption = 'light' | 'dark' | 'system';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeOption>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme or default to system
    const savedTheme = localStorage.getItem('theme') as ThemeOption | null;
    const initialTheme = savedTheme || 'system';

    // Determine the system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);

    // Apply theme based on selection or system preference
    applyTheme(initialTheme);

    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      if (initialTheme === 'system') {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (selectedTheme: ThemeOption) => {
    const isDark = selectedTheme === 'system' ? systemTheme === 'dark' : selectedTheme === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
  };

  const toggleTheme = () => {
    const themeOptions: ThemeOption[] = ['light', 'dark', 'system'];
    const currentIndex = themeOptions.indexOf(theme);
    const newTheme = themeOptions[(currentIndex + 1) % themeOptions.length];

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = () => {
    const _effectiveTheme = theme === 'system' ? systemTheme : theme;

    switch (theme) {
      case 'system':
        return <TreeDeciduous className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full overflow-hidden border border-border/30 backdrop-blur-sm hover:bg-accent/50"
      aria-label={`Switch to ${
        theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
      } mode`}
    >
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10" />
      <div className="relative z-10 flex items-center justify-center">{getThemeIcon()}</div>
      <span className="sr-only">
        {theme === 'system' ? 'System theme' : theme === 'dark' ? 'Dark mode' : 'Light mode'}
      </span>
    </Button>
  );
};

export { ThemeToggle };
