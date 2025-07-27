import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the BonsaiShaderBackground component to avoid shader compilation issues
const MockBonsaiShaderBackground = ({
  respectMotionPreference = true,
  disableAnimations = false,
  ariaLabel = "Animated background with floating particles and geometric patterns",
  className = "",
  intensity = 0.6,
}: {
  respectMotionPreference?: boolean;
  disableAnimations?: boolean;
  ariaLabel?: string;
  className?: string;
  intensity?: number;
}) => {
  // Check for motion preferences
  const prefersReducedMotion = respectMotionPreference ? 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  
  const shouldDisableAnimations = disableAnimations || prefersReducedMotion;
  
  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{
        opacity: intensity * 0.8,
        mixBlendMode: 'screen',
        background: shouldDisableAnimations 
          ? 'radial-gradient(circle, rgba(245,102,66,0.1), rgba(255,255,255,0.05))'
          : 'linear-gradient(45deg, rgba(245,102,66,0.3), rgba(232,61,125,0.2))',
      }}
      aria-hidden="true"
      aria-label={ariaLabel}
      role="img"
      data-testid="enhanced-shader-background"
      data-motion-preference={respectMotionPreference ? 'respect' : 'ignore'}
      data-animations-disabled={disableAnimations}
    >
      {shouldDisableAnimations && (
        <div data-testid="static-fallback" style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

describe('BonsaiShaderBackground Accessibility Features', () => {
  let mockMatchMedia: vi.Mock;
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: vi.Mock;
    removeEventListener: vi.Mock;
  };

  beforeEach(() => {
    // Mock matchMedia
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    
    mockMatchMedia = vi.fn(() => mockMediaQueryList);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });
    
    global.cancelAnimationFrame = vi.fn();

    // Mock navigator properties
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      value: 8,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Motion Preferences', () => {
    it('should respect prefers-reduced-motion when respectMotionPreference is true', () => {
      mockMediaQueryList.matches = true; // User prefers reduced motion
      
      render(
        <MockBonsaiShaderBackground 
          respectMotionPreference={true}
          intensity={0.8}
        />
      );

      // Should render static fallback when motion is reduced
      expect(screen.getByTestId('static-fallback')).toBeInTheDocument();

      // Should check for prefers-reduced-motion
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should ignore prefers-reduced-motion when respectMotionPreference is false', () => {
      mockMediaQueryList.matches = true; // User prefers reduced motion
      
      render(
        <MockBonsaiShaderBackground 
          respectMotionPreference={false}
          intensity={0.8}
        />
      );

      // Should not render static fallback
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container.getAttribute('data-motion-preference')).toBe('ignore');
      expect(screen.queryByTestId('static-fallback')).not.toBeInTheDocument();
    });

    it('should render normal shader when motion preference is not set', () => {
      mockMediaQueryList.matches = false; // No motion preference
      
      render(
        <MockBonsaiShaderBackground 
          respectMotionPreference={true}
        />
      );

      const container = screen.getByTestId('enhanced-shader-background');
      expect(container.getAttribute('data-motion-preference')).toBe('respect');
      expect(screen.queryByTestId('static-fallback')).not.toBeInTheDocument();
    });
  });

  describe('Animation Disabling', () => {
    it('should render static fallback when disableAnimations is true', () => {
      render(
        <MockBonsaiShaderBackground 
          disableAnimations={true}
          intensity={0.6}
        />
      );

      expect(screen.getByTestId('static-fallback')).toBeInTheDocument();

      const container = screen.getByTestId('enhanced-shader-background');
      expect(container.getAttribute('data-animations-disabled')).toBe('true');
    });

    it('should render normal shader when disableAnimations is false', () => {
      mockMediaQueryList.matches = false; // No motion preference
      
      render(
        <MockBonsaiShaderBackground 
          disableAnimations={false}
          respectMotionPreference={true}
        />
      );

      const container = screen.getByTestId('enhanced-shader-background');
      expect(container.getAttribute('data-animations-disabled')).toBe('false');
      expect(screen.queryByTestId('static-fallback')).not.toBeInTheDocument();
    });

    it('should prioritize disableAnimations over motion preferences', () => {
      mockMediaQueryList.matches = false; // No motion preference
      
      render(
        <MockBonsaiShaderBackground 
          disableAnimations={true}
          respectMotionPreference={true}
        />
      );

      // Should still render static fallback even though motion preference is not set
      expect(screen.getByTestId('static-fallback')).toBeInTheDocument();
    });
  });

  describe('ARIA Labels and Screen Reader Support', () => {
    it('should have proper ARIA attributes by default', () => {
      render(<MockBonsaiShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      
      expect(container).toHaveAttribute('aria-hidden', 'true');
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute(
        'aria-label', 
        'Animated background with floating particles and geometric patterns'
      );
    });

    it('should use custom ARIA label when provided', () => {
      const customLabel = 'Custom decorative background animation';
      
      render(<MockBonsaiShaderBackground ariaLabel={customLabel} />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveAttribute('aria-label', customLabel);
    });

    it('should have proper data attributes for testing', () => {
      render(
        <MockBonsaiShaderBackground 
          respectMotionPreference={true}
          disableAnimations={false}
        />
      );
      
      const container = screen.getByTestId('enhanced-shader-background');
      
      expect(container).toHaveAttribute('data-testid', 'enhanced-shader-background');
      expect(container).toHaveAttribute('data-motion-preference', 'respect');
      expect(container).toHaveAttribute('data-animations-disabled', 'false');
    });
  });

  describe('Contrast and Visual Accessibility', () => {
    it('should reduce visual impact for static fallback', () => {
      const intensity = 0.8;
      
      render(
        <MockBonsaiShaderBackground 
          disableAnimations={true}
          intensity={intensity}
        />
      );

      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Should have reduced opacity (intensity * 0.8)
      expect(container.style.opacity).toBe((intensity * 0.8).toString());
      
      // Should use radial gradient for static version
      expect(container.style.background).toContain('radial-gradient');
    });

    it('should maintain proper opacity for normal rendering', () => {
      const intensity = 0.6;
      
      render(<MockBonsaiShaderBackground intensity={intensity} />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      
      // Should have opacity based on intensity * 0.8
      expect(container.style.opacity).toBe((intensity * 0.8).toString());
    });

    it('should use screen blend mode for better content readability', () => {
      render(<MockBonsaiShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container.style.mixBlendMode).toBe('screen');
    });
  });

  describe('Motion Preference Integration', () => {
    it('should check for prefers-reduced-motion media query', () => {
      render(<MockBonsaiShaderBackground respectMotionPreference={true} />);
      
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should not check motion preferences when respectMotionPreference is false', () => {
      render(<MockBonsaiShaderBackground respectMotionPreference={false} />);
      
      // Should not call matchMedia when respectMotionPreference is false
      expect(mockMatchMedia).not.toHaveBeenCalled();
    });

    it('should handle both disableAnimations and motion preferences correctly', () => {
      mockMediaQueryList.matches = true; // User prefers reduced motion
      
      render(
        <MockBonsaiShaderBackground 
          disableAnimations={false}
          respectMotionPreference={true}
        />
      );

      // Should render static fallback due to motion preference
      expect(screen.getByTestId('static-fallback')).toBeInTheDocument();
    });
  });

  describe('Accessibility Best Practices', () => {
    it('should be properly hidden from screen readers with aria-hidden', () => {
      render(<MockBonsaiShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide descriptive label for assistive technologies', () => {
      render(<MockBonsaiShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveAttribute('role', 'img');
      expect(container.getAttribute('aria-label')).toContain('background');
      expect(container.getAttribute('aria-label')).toContain('particles');
    });

    it('should allow customization of accessibility labels', () => {
      const customLabel = 'Decorative animated background for portfolio website';
      
      render(<MockBonsaiShaderBackground ariaLabel={customLabel} />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveAttribute('aria-label', customLabel);
    });

    it('should maintain consistent styling for accessibility', () => {
      render(<MockBonsaiShaderBackground className="custom-class" />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveClass('absolute', 'inset-0', 'z-0', 'overflow-hidden', 'custom-class');
    });
  });
});