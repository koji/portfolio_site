import { ChevronUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface GoToTopButtonProps {
  className?: string;
  showAfter?: number; // Show button after scrolling this many pixels
  smoothScroll?: boolean;
  showScrollProgress?: boolean; // Show scroll progress indicator
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'; // Button position
}

// Static position styles extracted outside component to avoid rebuilding on every render
const POSITION_STYLES: Record<NonNullable<GoToTopButtonProps['position']>, CSSProperties> = {
  'bottom-right': { position: 'fixed', zIndex: 50, bottom: '1.5rem', right: '1.5rem' },
  'bottom-left': { position: 'fixed', zIndex: 50, bottom: '1.5rem', left: '1.5rem' },
  'bottom-center': { position: 'fixed', zIndex: 50, bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' },
};

const GoToTopButton = ({
  className = '',
  showAfter = 150,
  smoothScroll = true,
  showScrollProgress = true,
  position = 'bottom-right',
}: GoToTopButtonProps): ReactNode => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    setIsVisible(scrollTop > showAfter);
    setScrollProgress(Math.min(scrollPercent, 100));
  }, [showAfter]);

  useEffect(() => {
    let ticking = false;
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
          animationFrameId = null;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateScrollState]);

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;

    if (smoothScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      style={POSITION_STYLES[position]}
      className={`
        bg-primary hover:bg-primary/90 active:bg-primary/80
        text-primary-foreground
        rounded-full p-3 min-w-[48px] min-h-[48px] flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-[transform,background-color,box-shadow] duration-300 ease-in-out
        hover:scale-110 active:scale-95
        ring-2 ring-primary/20 hover:ring-primary/40
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        group
        relative overflow-hidden
        animate-in slide-in-from-bottom-2 duration-300
        ${className}
      `}
      aria-label={`Go to top (${Math.round(scrollProgress)}% scrolled)`}
      title={`Go to top (${Math.round(scrollProgress)}% scrolled)`}
    >
      {/* Scroll progress indicator - Circular progress ring */}
      {showScrollProgress && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 36 36"
          aria-hidden="true"
        >
          <path
            className="stroke-current opacity-20"
            strokeWidth="2"
            fill="none"
            d="M18 2.08 a 15.92 15.92 0 0 1 0 31.84 a 15.92 15.92 0 0 1 0 -31.84"
          />
          <path
            className="stroke-current opacity-60 transition-[stroke-dasharray] duration-300 ease-out"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${scrollProgress}, 100`}
            d="M18 2.08 a 15.92 15.92 0 0 1 0 31.84 a 15.92 15.92 0 0 1 0 -31.84"
          />
        </svg>
      )}

      {/* Icon */}
      <ChevronUp
        className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 relative z-10"
        aria-hidden="true"
      />

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 scale-50 group-active:opacity-100 group-active:scale-100 transition-[transform,opacity] duration-150 pointer-events-none" />
    </button>
  );
};

export default GoToTopButton;
