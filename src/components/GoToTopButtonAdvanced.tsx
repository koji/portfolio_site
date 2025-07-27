import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ArrowUp, ChevronsUp } from 'lucide-react';

type IconType = 'chevron' | 'arrow' | 'double-chevron';
type Position = 'bottom-right' | 'bottom-left' | 'bottom-center';
type Size = 'sm' | 'md' | 'lg';

interface GoToTopButtonAdvancedProps {
  className?: string;
  showAfter?: number;
  smoothScroll?: boolean;
  showScrollProgress?: boolean;
  icon?: IconType;
  position?: Position;
  size?: Size;
  hideOnTop?: boolean;
  animationDuration?: number;
  progressColor?: string;
  backgroundColor?: string;
  hoverColor?: string;
  textColor?: string;
}

const GoToTopButtonAdvanced: React.FC<GoToTopButtonAdvancedProps> = ({
  className = '',
  showAfter = 300,
  smoothScroll = true,
  showScrollProgress = true,
  icon = 'chevron',
  position = 'bottom-right',
  size = 'md',
  hideOnTop = true,
  animationDuration = 300,
  progressColor,
  backgroundColor,
  hoverColor,
  textColor,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    const shouldShow = scrollTop > showAfter && (!hideOnTop || scrollPercent < 95);
    setIsVisible(shouldShow);
    setScrollProgress(Math.min(scrollPercent, 100));
  }, [showAfter, hideOnTop]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  // Icon selection
  const IconComponent = {
    chevron: ChevronUp,
    arrow: ArrowUp,
    'double-chevron': ChevronsUp,
  }[icon];

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-xs',
    },
    md: {
      button: 'p-3',
      icon: 'w-5 h-5',
      text: 'text-sm',
    },
    lg: {
      button: 'p-4',
      icon: 'w-6 h-6',
      text: 'text-base',
    },
  }[size];

  // Position configurations
  const positionConfig = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
  }[position];

  // Custom styles
  const customStyles = {
    backgroundColor: backgroundColor || 'bg-primary',
    hoverColor: hoverColor || 'hover:bg-primary/90',
    textColor: textColor || 'text-primary-foreground',
    progressColor: progressColor || 'bg-primary-foreground/20',
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className={`
        fixed ${positionConfig} z-50
        ${customStyles.backgroundColor} ${customStyles.hoverColor} active:bg-primary/80
        ${customStyles.textColor}
        rounded-full ${sizeConfig.button}
        shadow-lg hover:shadow-xl
        transform hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        group
        relative overflow-hidden
        transition-all ease-in-out
        ${className}
      `}
      style={{
        transitionDuration: `${animationDuration}ms`,
      }}
      aria-label={`Go to top (${Math.round(scrollProgress)}% scrolled)`}
      title={`Go to top (${Math.round(scrollProgress)}% scrolled)`}
      tabIndex={0}
    >
      {/* Scroll progress indicator */}
      {showScrollProgress && (
        <>
          {/* Circular progress */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="stroke-current opacity-20"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`stroke-current transition-all duration-300 ${customStyles.progressColor}`}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${scrollProgress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </>
      )}
      
      {/* Icon */}
      <IconComponent 
        className={`${sizeConfig.icon} transition-transform duration-200 group-hover:-translate-y-0.5 relative z-10`}
        aria-hidden="true"
      />
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
    </button>
  );
};

export default GoToTopButtonAdvanced;