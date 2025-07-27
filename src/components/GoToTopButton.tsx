import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

interface GoToTopButtonProps {
  className?: string;
  showAfter?: number; // Show button after scrolling this many pixels
  smoothScroll?: boolean;
  showScrollProgress?: boolean; // Show scroll progress indicator
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'; // Button position
}

const GoToTopButton: React.FC<GoToTopButtonProps> = ({
  className = '',
  showAfter = 150, // Show after scrolling just 150px
  smoothScroll = true,
  showScrollProgress = true,
  position = 'bottom-right',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Show button after scrolling past threshold and keep it visible
    // Only hide when actually at the very top (scrollTop <= 10)
    setIsVisible(scrollTop > showAfter);
    setScrollProgress(Math.min(scrollPercent, 100));
  }, [showAfter]);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Throttle scroll events for better performance
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

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    updateScrollState();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateScrollState]);

  const scrollToTop = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    if (smoothScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }

    // Focus management for accessibility
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  // Position configurations - explicit and safe positioning
  const getPositionStyles = () => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'bottom-center':
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
      default:
        return `${baseClasses} bottom-6 right-6`;
    }
  };

  const positionClasses = getPositionStyles();

  // Don't render the button at all when not visible for better performance
  if (!isVisible) {
    return null;
  }

  // Inline styles as fallback to ensure proper positioning
  const getInlineStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 50,
      bottom: '1.5rem',
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyles, left: '1.5rem' };
      case 'bottom-center':
        return { ...baseStyles, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
      default:
        return { ...baseStyles, right: '1.5rem' };
    }
  };

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      style={getInlineStyles()}
      className={`
        bg-primary hover:bg-primary/90 active:bg-primary/80
        text-primary-foreground
        rounded-full p-3 min-w-[48px] min-h-[48px] flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
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
      tabIndex={0}
    >
      {/* Scroll progress indicator - Circular progress ring */}
      {showScrollProgress && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 36 36"
        >
          <path
            className="stroke-current opacity-20"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-current opacity-60 transition-all duration-300"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${scrollProgress}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      )}
      
      {/* Icon */}
      <ChevronUp 
        className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 relative z-10" 
        aria-hidden="true"
      />
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
    </button>
  );
};

export default GoToTopButton;