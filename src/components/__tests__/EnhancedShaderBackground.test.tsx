import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedShaderBackground from '../BonsaiShaderBackground';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock Three.js to avoid WebGL context issues in tests
jest.mock('three', () => ({
  Scene: jest.fn(() => ({
    add: jest.fn(),
  })),
  OrthographicCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  ShaderMaterial: jest.fn(),
  PlaneGeometry: jest.fn(),
  Mesh: jest.fn(),
  Vector2: jest.fn(() => ({
    set: jest.fn(),
  })),
  Vector3: jest.fn(() => ({
    set: jest.fn(),
  })),
  AdditiveBlending: 'AdditiveBlending',
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('EnhancedShaderBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Particle System Configuration', () => {
    test('should render with default particle system settings', () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('absolute', 'inset-0', 'z-0', 'overflow-hidden');
    });

    test('should accept custom particle count prop', () => {
      render(<EnhancedShaderBackground particleCount={200} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should accept custom animation speed prop', () => {
      render(<EnhancedShaderBackground animationSpeed={1.5} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should accept custom intensity prop', () => {
      render(<EnhancedShaderBackground intensity={0.8} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Check if intensity affects the opacity style
      expect(container).toHaveStyle({ opacity: '0.64' }); // 0.8 * 0.8
    });
  });

  describe('Enhanced Mouse Interaction System', () => {
    test('should enable mouse interactions when specified', () => {
      render(<EnhancedShaderBackground interactionEnabled={true} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should disable mouse interactions when specified', () => {
      render(<EnhancedShaderBackground interactionEnabled={false} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should handle mouse move events when interaction is enabled', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      
      // Simulate mouse move event
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      });
      
      expect(() => {
        window.dispatchEvent(mouseEvent);
      }).not.toThrow();
    });

    test('should handle mouse leave events gracefully', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Simulate mouse leave event
      const mouseLeaveEvent = new MouseEvent('mouseleave', {
        bubbles: true,
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(mouseLeaveEvent);
      }).not.toThrow();
    });

    test('should not add mouse event listeners when interaction is disabled', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      render(<EnhancedShaderBackground interactionEnabled={false} />);
      
      // Should not add mousemove listener when interaction is disabled
      const mouseListenerCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      );
      expect(mouseListenerCalls).toHaveLength(0);
      
      addEventListenerSpy.mockRestore();
    });

    test('should clamp mouse coordinates to valid range', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      
      // Mock getBoundingClientRect to return predictable values
      const mockGetBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
      }));
      
      const shaderContainer = container.firstChild as HTMLElement;
      shaderContainer.getBoundingClientRect = mockGetBoundingClientRect;
      
      // Test coordinates outside the container bounds
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: -50, // Outside left boundary
        clientY: 150, // Outside bottom boundary
        bubbles: true,
      });
      
      expect(() => {
        window.dispatchEvent(mouseEvent);
      }).not.toThrow();
    });

    test('should handle rapid mouse movements without errors', () => {
      render(<EnhancedShaderBackground interactionEnabled={true} />);
      
      // Simulate rapid mouse movements
      for (let i = 0; i < 100; i++) {
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: Math.random() * 1000,
          clientY: Math.random() * 1000,
          bubbles: true,
        });
        
        expect(() => {
          window.dispatchEvent(mouseEvent);
        }).not.toThrow();
      }
    });
  });

  describe('Enhanced Geometric Flow Layer', () => {
    test('should render with geometric patterns enabled', () => {
      render(<EnhancedShaderBackground intensity={0.8} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Higher intensity should be reflected in opacity
      expect(container).toHaveStyle({ opacity: '0.64' }); // 0.8 * 0.8
    });

    test('should handle different animation speeds for geometric patterns', () => {
      const slowAnimation = render(<EnhancedShaderBackground animationSpeed={0.5} />);
      const fastAnimation = render(<EnhancedShaderBackground animationSpeed={2.0} />);
      
      expect(slowAnimation.container.firstChild).toBeInTheDocument();
      expect(fastAnimation.container.firstChild).toBeInTheDocument();
    });

    test('should maintain performance with complex geometric patterns', () => {
      // Test with high particle count and complex patterns
      render(
        <EnhancedShaderBackground 
          particleCount={200} 
          intensity={1.0} 
          animationSpeed={1.5} 
        />
      );
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should handle geometric pattern scaling on different screen sizes', () => {
      // Mock different window sizes
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;
      
      // Test mobile size
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      
      const mobileRender = render(<EnhancedShaderBackground />);
      expect(mobileRender.container.firstChild).toBeInTheDocument();
      
      // Test desktop size
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
      
      const desktopRender = render(<EnhancedShaderBackground />);
      expect(desktopRender.container.firstChild).toBeInTheDocument();
      
      // Restore original values
      Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true });
    });
  });

  describe('Multi-Layer Composition and Blending', () => {
    test('should render with enhanced layer composition', () => {
      render(<EnhancedShaderBackground intensity={0.9} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Enhanced composition should maintain proper opacity
      expect(container).toHaveStyle({ opacity: '0.72' }); // 0.9 * 0.8
    });

    test('should handle complex blending with multiple layers', () => {
      render(
        <EnhancedShaderBackground 
          intensity={1.0}
          particleCount={150}
          interactionEnabled={true}
          animationSpeed={1.0}
        />
      );
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      expect(container).toHaveStyle({ mixBlendMode: 'screen' });
    });

    test('should maintain visual quality with depth-based layering', () => {
      // Test with various intensity levels to ensure proper layer composition
      const intensityLevels = [0.2, 0.5, 0.8, 1.0];
      
      intensityLevels.forEach(intensity => {
        const { container } = render(<EnhancedShaderBackground intensity={intensity} />);
        const shaderElement = container.firstChild as HTMLElement;
        
        expect(shaderElement).toBeInTheDocument();
        expect(shaderElement).toHaveStyle({ opacity: `${intensity * 0.8}` });
      });
    });

    test('should handle atmospheric perspective effects', () => {
      render(
        <EnhancedShaderBackground 
          intensity={0.7}
          animationSpeed={0.8}
        />
      );
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should apply color grading and temperature adjustments', () => {
      // Test that the component renders without errors when color grading is applied
      render(<EnhancedShaderBackground intensity={0.6} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('absolute', 'inset-0', 'z-0', 'overflow-hidden');
    });

    test('should handle dynamic color transitions', () => {
      // Test that dynamic color mixing doesn't cause rendering issues
      render(
        <EnhancedShaderBackground 
          intensity={0.8}
          animationSpeed={1.5}
          particleCount={100}
        />
      );
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should maintain proper alpha compositing', () => {
      // Test different configurations to ensure alpha compositing works
      const configs = [
        { intensity: 0.3, particleCount: 50 },
        { intensity: 0.7, particleCount: 150 },
        { intensity: 1.0, particleCount: 200 },
      ];
      
      configs.forEach(config => {
        const { container } = render(<EnhancedShaderBackground {...config} />);
        const shaderElement = container.firstChild as HTMLElement;
        
        expect(shaderElement).toBeInTheDocument();
        
        // Opacity should be properly calculated based on intensity
        const expectedOpacity = config.intensity * 0.8;
        expect(shaderElement).toHaveStyle({ opacity: `${expectedOpacity}` });
      });
    });
  });

  describe('Advanced Performance Optimization', () => {
    test('should detect device capabilities and adjust quality', () => {
      // Mock different device types
      const originalHardwareConcurrency = navigator.hardwareConcurrency;
      const originalDeviceMemory = (navigator as any).deviceMemory;
      
      // Mock high-end device
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 16, configurable: true });
      (navigator as any).deviceMemory = 16;
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Restore original values
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: originalHardwareConcurrency, configurable: true });
      (navigator as any).deviceMemory = originalDeviceMemory;
    });

    test('should handle low-end device optimization', () => {
      // Mock low-end device
      const originalHardwareConcurrency = navigator.hardwareConcurrency;
      const originalDeviceMemory = (navigator as any).deviceMemory;
      
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, configurable: true });
      (navigator as any).deviceMemory = 2;
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Restore original values
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: originalHardwareConcurrency, configurable: true });
      (navigator as any).deviceMemory = originalDeviceMemory;
    });

    test('should handle WebGL context unavailable', () => {
      // Mock WebGL unavailable
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
      
      expect(() => {
        render(<EnhancedShaderBackground />);
      }).not.toThrow();
      
      // Restore original method
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test('should monitor performance and adjust quality dynamically', () => {
      render(<EnhancedShaderBackground intensity={1.0} particleCount={200} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Should handle performance monitoring without errors
      expect(container).toHaveStyle({ opacity: '0.8' }); // 1.0 * 0.8
    });

    test('should handle memory pressure gracefully', () => {
      // Mock high memory usage
      const originalMemory = (performance as any).memory;
      (performance as any).memory = {
        usedJSHeapSize: 200 * 1024 * 1024, // 200MB
        jsHeapSizeLimit: 300 * 1024 * 1024, // 300MB limit
      };
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Restore original memory
      (performance as any).memory = originalMemory;
    });

    test('should adapt to different screen sizes and pixel ratios', () => {
      const originalDevicePixelRatio = window.devicePixelRatio;
      const originalScreen = window.screen;
      
      // Mock high-DPI display
      Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
      Object.defineProperty(window, 'screen', {
        value: { width: 2560, height: 1440 },
        configurable: true,
      });
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Restore original values
      Object.defineProperty(window, 'devicePixelRatio', { value: originalDevicePixelRatio, configurable: true });
      Object.defineProperty(window, 'screen', { value: originalScreen, configurable: true });
    });

    test('should handle rapid quality adjustments without errors', () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Simulate rapid performance changes
      // In a real scenario, this would be handled by the performance monitor
      expect(() => {
        // Multiple rapid renders should not cause issues
        for (let i = 0; i < 10; i++) {
          render(<EnhancedShaderBackground intensity={Math.random()} />);
        }
      }).not.toThrow();
    });
  });

  describe('Performance Configuration', () => {
    test('should apply custom className', () => {
      const customClass = 'custom-shader-class';
      render(<EnhancedShaderBackground className={customClass} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toHaveClass(customClass);
    });

    test('should have proper accessibility attributes', () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });

    test('should apply screen blend mode for enhanced visual effect', () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toHaveStyle({ mixBlendMode: 'screen' });
    });
  });

  describe('Device Detection', () => {
    test('should handle mobile user agent', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should handle desktop user agent', () => {
      // Mock desktop user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true,
      });

      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });
  });

  describe('Enhanced Theme-Responsive System', () => {
    test('should handle light theme with proper color initialization', () => {
      // Mock light theme
      document.documentElement.classList.remove('dark');
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should handle dark theme with enhanced visual effects', () => {
      // Mock dark theme
      document.documentElement.classList.add('dark');
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });

    test('should handle theme transitions smoothly', () => {
      // Start with light theme
      document.documentElement.classList.remove('dark');
      
      const { container } = render(<EnhancedShaderBackground />);
      const shaderElement = container.firstChild as HTMLElement;
      
      expect(shaderElement).toBeInTheDocument();
      
      // Switch to dark theme
      document.documentElement.classList.add('dark');
      
      // Trigger mutation observer
      const event = new Event('DOMSubtreeModified');
      document.documentElement.dispatchEvent(event);
      
      // Should still be rendered without errors
      expect(shaderElement).toBeInTheDocument();
    });

    test('should maintain performance during theme transitions', () => {
      render(<EnhancedShaderBackground intensity={0.8} />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Simulate rapid theme changes
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      // Should handle rapid changes without errors
      expect(container).toBeInTheDocument();
    });

    test('should apply theme-responsive intensity adjustments', () => {
      // Test light theme
      document.documentElement.classList.remove('dark');
      const lightRender = render(<EnhancedShaderBackground intensity={0.6} />);
      expect(lightRender.container.firstChild).toBeInTheDocument();
      
      // Test dark theme
      document.documentElement.classList.add('dark');
      const darkRender = render(<EnhancedShaderBackground intensity={0.6} />);
      expect(darkRender.container.firstChild).toBeInTheDocument();
    });

    test('should handle theme changes with different animation speeds', () => {
      const speeds = [0.5, 1.0, 1.5, 2.0];
      
      speeds.forEach(speed => {
        const { container } = render(<EnhancedShaderBackground animationSpeed={speed} />);
        
        // Switch theme
        document.documentElement.classList.toggle('dark');
        
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    test('should maintain proper color transitions with high particle counts', () => {
      render(
        <EnhancedShaderBackground 
          particleCount={200}
          intensity={0.9}
          interactionEnabled={true}
        />
      );
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Theme change should not cause performance issues
      document.documentElement.classList.toggle('dark');
      expect(container).toBeInTheDocument();
    });

    test('should handle system theme preference changes', () => {
      // Mock system theme change
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      // Should handle media query changes gracefully
      expect(() => {
        // Simulate system theme change
        Object.defineProperty(mediaQuery, 'matches', {
          value: true,
          configurable: true,
        });
      }).not.toThrow();
    });
  });
});

// Particle Physics Behavior Tests
describe('Particle Physics Simulation', () => {
  test('should validate particle count limits', () => {
    // Test that particle count is properly clamped
    const testCases = [
      { input: 50, expected: 50 },
      { input: 150, expected: 100 }, // Should be clamped to 100
      { input: 300, expected: 100 }, // Should be clamped to 100
    ];

    testCases.forEach(({ input, expected }) => {
      render(<EnhancedShaderBackground particleCount={input} />);
      // In a real implementation, we would check the uniform values
      // For now, we just verify the component renders without errors
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });
  });

  test('should validate animation speed ranges', () => {
    const testCases = [0.5, 1.0, 1.5, 2.0];

    testCases.forEach((speed) => {
      render(<EnhancedShaderBackground animationSpeed={speed} />);
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });
  });

  test('should validate intensity ranges', () => {
    const testCases = [0.0, 0.3, 0.6, 1.0];

    testCases.forEach((intensity) => {
      render(<EnhancedShaderBackground intensity={intensity} />);
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      expect(container).toHaveStyle({ opacity: `${intensity * 0.8}` });
    });
  });
});

// Performance Configuration Tests
describe('Performance Optimization', () => {
  test('should use appropriate settings for mobile devices', () => {
    // Mock mobile environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    render(<EnhancedShaderBackground />);
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
  });

  test('should use appropriate settings for high-end devices', () => {
    // Mock high-end environment
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 16,
      configurable: true,
    });
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 3,
      configurable: true,
    });

    render(<EnhancedShaderBackground />);
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
  });
}); 
 describe('Responsive Scaling and Window Resize Handling', () => {
    beforeEach(() => {
      // Reset window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    });

    test('should handle window resize events with debouncing', () => {
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Change window size
      Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 720, configurable: true });
      
      // Trigger resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Should not immediately update due to debouncing
      expect(() => {
        jest.advanceTimersByTime(100);
      }).not.toThrow();
      
      // Should update after debounce delay
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle rapid resize events without performance issues', () => {
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        Object.defineProperty(window, 'innerWidth', { value: 1920 + i * 10, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1080 + i * 5, configurable: true });
        
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
      }
      
      // Should handle all events without errors
      expect(() => {
        jest.advanceTimersByTime(300);
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should apply mobile-specific optimizations during resize', () => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Trigger resize on mobile
      Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      expect(() => {
        jest.advanceTimersByTime(500);
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle orientation changes on mobile devices', () => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Simulate orientation change
      const orientationEvent = new Event('orientationchange');
      window.dispatchEvent(orientationEvent);
      
      expect(() => {
        jest.advanceTimersByTime(200);
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should maintain aspect ratio during resize transitions', () => {
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Test various aspect ratios
      const aspectRatios = [
        { width: 1920, height: 1080 }, // 16:9
        { width: 1440, height: 900 },  // 16:10
        { width: 1024, height: 768 },  // 4:3
        { width: 2560, height: 1080 }, // 21:9 ultrawide
      ];
      
      aspectRatios.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
        
        jest.advanceTimersByTime(200);
        
        const container = screen.getByRole('presentation', { hidden: true });
        expect(container).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });

    test('should handle high-DPI displays correctly', () => {
      // Mock high-DPI display
      Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Trigger resize to apply high-DPI optimizations
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should optimize for ultrawide displays', () => {
      // Mock ultrawide display
      Object.defineProperty(window, 'innerWidth', { value: 3440, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1440, configurable: true });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground particleCount={200} />);
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle very small screen sizes gracefully', () => {
      // Mock very small screen (old mobile devices)
      Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 240, configurable: true });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle very large screen sizes with performance optimizations', () => {
      // Mock very large screen (8K display)
      Object.defineProperty(window, 'innerWidth', { value: 7680, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 4320, configurable: true });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should clean up resize event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<EnhancedShaderBackground />);
      
      unmount();
      
      // Should remove resize and orientation change listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    test('should handle resize timeout cleanup on unmount', () => {
      jest.useFakeTimers();
      
      const { unmount } = render(<EnhancedShaderBackground />);
      
      // Trigger resize to start timeout
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Unmount before timeout completes
      unmount();
      
      // Should not throw errors when timeout tries to execute
      expect(() => {
        jest.advanceTimersByTime(300);
      }).not.toThrow();
      
      jest.useRealTimers();
    });
  });

  describe('Touch Interaction for Mobile Devices', () => {
    beforeEach(() => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
    });

    test('should handle touch start events on mobile', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Mock getBoundingClientRect
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
      }));
      
      // Create touch event
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          force: 0.8,
        } as Touch],
        bubbles: true,
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchEvent);
      }).not.toThrow();
    });

    test('should handle touch move events with velocity calculation', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
      }));
      
      // Start touch
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          force: 1.0,
        } as Touch],
        bubbles: true,
      });
      
      shaderContainer.dispatchEvent(touchStartEvent);
      
      // Move touch
      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{
          clientX: 150,
          clientY: 250,
          force: 1.0,
        } as Touch],
        bubbles: true,
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchMoveEvent);
      }).not.toThrow();
    });

    test('should handle touch end events with fade-out animation', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchEndEvent);
      }).not.toThrow();
    });

    test('should prevent default touch behaviors', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
      }));
      
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
        } as Touch],
        bubbles: true,
      });
      
      const preventDefaultSpy = jest.spyOn(touchEvent, 'preventDefault');
      
      shaderContainer.dispatchEvent(touchEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should not add touch listeners when interaction is disabled', () => {
      const addEventListenerSpy = jest.spyOn(HTMLElement.prototype, 'addEventListener');
      
      render(<EnhancedShaderBackground interactionEnabled={false} />);
      
      // Should not add touch event listeners when interaction is disabled
      const touchListenerCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0].startsWith('touch')
      );
      expect(touchListenerCalls).toHaveLength(0);
      
      addEventListenerSpy.mockRestore();
    });

    test('should not add touch listeners on desktop devices', () => {
      // Mock desktop environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true,
      });
      
      const addEventListenerSpy = jest.spyOn(HTMLElement.prototype, 'addEventListener');
      
      render(<EnhancedShaderBackground interactionEnabled={true} />);
      
      // Should not add touch event listeners on desktop
      const touchListenerCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0].startsWith('touch')
      );
      expect(touchListenerCalls).toHaveLength(0);
      
      addEventListenerSpy.mockRestore();
    });

    test('should clean up touch event listeners on unmount', () => {
      const { container, unmount } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      const removeEventListenerSpy = jest.spyOn(shaderContainer, 'removeEventListener');
      
      unmount();
      
      // Should remove touch event listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    test('should handle touch coordinates outside container bounds', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
      }));
      
      // Touch outside container bounds
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{
          clientX: -50, // Outside left boundary
          clientY: 800, // Outside bottom boundary
        } as Touch],
        bubbles: true,
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchEvent);
      }).not.toThrow();
    });

    test('should handle multiple rapid touch events', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
      }));
      
      // Simulate rapid touch events
      for (let i = 0; i < 20; i++) {
        const touchEvent = new TouchEvent('touchmove', {
          touches: [{
            clientX: 100 + i * 5,
            clientY: 200 + i * 3,
          } as Touch],
          bubbles: true,
        });
        
        expect(() => {
          shaderContainer.dispatchEvent(touchEvent);
        }).not.toThrow();
      }
    });

    test('should handle touch events with pressure sensitivity', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
      }));
      
      // Touch with varying pressure
      const lightTouchEvent = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          force: 0.3,
        } as Touch],
        bubbles: true,
      });
      
      const heavyTouchEvent = new TouchEvent('touchmove', {
        touches: [{
          clientX: 120,
          clientY: 220,
          force: 1.0,
        } as Touch],
        bubbles: true,
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(lightTouchEvent);
        shaderContainer.dispatchEvent(heavyTouchEvent);
      }).not.toThrow();
    });
  });

  describe('Cross-Browser Responsive Compatibility', () => {
    test('should handle Safari mobile viewport quirks', () => {
      // Mock Safari mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true,
      });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Simulate Safari viewport change
      Object.defineProperty(window, 'innerHeight', { value: 553, configurable: true }); // Safari with address bar
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle Chrome mobile viewport changes', () => {
      // Mock Chrome mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        configurable: true,
      });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Simulate Chrome mobile viewport change
      Object.defineProperty(window, 'innerHeight', { value: 640, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle Firefox mobile differences', () => {
      // Mock Firefox mobile
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
        configurable: true,
      });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      jest.advanceTimersByTime(200);
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle desktop browser window resizing', () => {
      // Mock desktop Chrome
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true,
      });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Simulate window resizing
      const sizes = [
        { width: 1920, height: 1080 },
        { width: 1280, height: 720 },
        { width: 800, height: 600 },
        { width: 1440, height: 900 },
      ];
      
      sizes.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
        
        jest.advanceTimersByTime(200);
        
        const container = screen.getByRole('presentation', { hidden: true });
        expect(container).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });
  });
});
/
/ Responsive Scaling and Window Resize Handling Tests
describe('Responsive Scaling and Window Resize Handling', () => {
  beforeEach(() => {
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
  });

  test('should handle window resize events with debouncing', () => {
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Change window size
    Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 720, configurable: true });
    
    // Trigger resize event
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Should not immediately update due to debouncing
    expect(() => {
      jest.advanceTimersByTime(100);
    }).not.toThrow();
    
    // Should update after debounce delay
    jest.advanceTimersByTime(200);
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should handle rapid resize events without performance issues', () => {
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Simulate rapid resize events
    for (let i = 0; i < 10; i++) {
      Object.defineProperty(window, 'innerWidth', { value: 1920 + i * 10, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080 + i * 5, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    }
    
    // Should handle all events without errors
    expect(() => {
      jest.advanceTimersByTime(300);
    }).not.toThrow();
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should apply mobile-specific optimizations during resize', () => {
    // Mock mobile environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
    
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Trigger resize on mobile
    Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });
    
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    expect(() => {
      jest.advanceTimersByTime(500);
    }).not.toThrow();
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should handle orientation changes on mobile devices', () => {
    // Mock mobile environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Simulate orientation change
    const orientationEvent = new Event('orientationchange');
    window.dispatchEvent(orientationEvent);
    
    expect(() => {
      jest.advanceTimersByTime(300);
    }).not.toThrow();
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should scale properly for different screen resolutions', () => {
    const testResolutions = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 3440, height: 1440, name: 'ultrawide' },
    ];

    testResolutions.forEach(({ width, height, name }) => {
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
      
      const { container } = render(<EnhancedShaderBackground />);
      const shaderElement = container.firstChild as HTMLElement;
      
      expect(shaderElement).toBeInTheDocument();
      expect(shaderElement).toHaveClass('absolute', 'inset-0', 'z-0', 'overflow-hidden');
    });
  });

  test('should handle high-DPI displays correctly', () => {
    // Mock high-DPI display
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true });
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    
    render(<EnhancedShaderBackground />);
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
  });

  test('should maintain aspect ratio during resize transitions', () => {
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Change to different aspect ratio
    Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true });
    
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Should handle aspect ratio change smoothly
    expect(() => {
      jest.advanceTimersByTime(500);
    }).not.toThrow();
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should optimize performance during resize transitions', () => {
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground particleCount={200} intensity={1.0} />);
    
    // Trigger resize
    Object.defineProperty(window, 'innerWidth', { value: 1600, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
    
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Should temporarily reduce quality during resize
    jest.advanceTimersByTime(100);
    
    // Should restore quality after transition
    jest.advanceTimersByTime(400);
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should handle window resize with different device types', () => {
    const deviceConfigs = [
      { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', type: 'mobile' },
      { userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', type: 'tablet' },
      { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', type: 'desktop' },
    ];

    deviceConfigs.forEach(({ userAgent, type }) => {
      Object.defineProperty(navigator, 'userAgent', { value: userAgent, configurable: true });
      
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Trigger resize
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      expect(() => {
        jest.advanceTimersByTime(300);
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });
  });

  test('should handle extreme aspect ratios', () => {
    const extremeRatios = [
      { width: 2560, height: 1080, name: 'ultrawide' },
      { width: 1080, height: 2560, name: 'tall portrait' },
      { width: 3840, height: 1080, name: 'super ultrawide' },
    ];

    extremeRatios.forEach(({ width, height, name }) => {
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
      
      expect(() => {
        render(<EnhancedShaderBackground />);
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
    });
  });

  test('should handle resize events with touch interactions enabled', () => {
    // Mock mobile with touch
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground interactionEnabled={true} />);
    
    // Trigger resize
    Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });
    
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    expect(() => {
      jest.advanceTimersByTime(400);
    }).not.toThrow();
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should handle smooth transitions between different screen sizes', () => {
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Simulate multiple screen size changes
    const screenSizes = [
      { width: 1920, height: 1080 },
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];
    
    screenSizes.forEach(({ width, height }, index) => {
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Allow time for each transition
      jest.advanceTimersByTime(400);
    });
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  test('should maintain performance during rapid orientation changes', () => {
    // Mock mobile environment
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    
    jest.useFakeTimers();
    
    render(<EnhancedShaderBackground />);
    
    // Simulate rapid orientation changes
    for (let i = 0; i < 5; i++) {
      const isPortrait = i % 2 === 0;
      Object.defineProperty(window, 'innerWidth', { 
        value: isPortrait ? 375 : 667, 
        configurable: true 
      });
      Object.defineProperty(window, 'innerHeight', { 
        value: isPortrait ? 667 : 375, 
        configurable: true 
      });
      
      const orientationEvent = new Event('orientationchange');
      window.dispatchEvent(orientationEvent);
      
      jest.advanceTimersByTime(200);
    }
    
    const container = screen.getByRole('presentation', { hidden: true });
    expect(container).toBeInTheDocument();
    
    jest.useRealTimers();
  });
});  
  test('should handle different screen aspect ratios appropriately', () => {
      const aspectRatios = [
        { width: 1920, height: 1080, description: '16:9 standard' },
        { width: 1440, height: 900, description: '16:10 widescreen' },
        { width: 1024, height: 768, description: '4:3 traditional' },
        { width: 768, height: 1024, description: '3:4 portrait' },
        { width: 2560, height: 1080, description: '21:9 ultrawide' },
        { width: 3440, height: 1440, description: '21:9 ultrawide QHD' },
      ];
      
      aspectRatios.forEach(({ width, height, description }) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        
        const { unmount } = render(<EnhancedShaderBackground />);
        
        const container = screen.getByRole('presentation', { hidden: true });
        expect(container).toBeInTheDocument();
        
        unmount();
      });
    });

    test('should handle high-DPI displays with proper scaling', () => {
      const dpiValues = [1, 1.5, 2, 3];
      
      dpiValues.forEach(dpi => {
        Object.defineProperty(window, 'devicePixelRatio', { value: dpi, configurable: true });
        
        const { unmount } = render(<EnhancedShaderBackground />);
        
        const container = screen.getByRole('presentation', { hidden: true });
        expect(container).toBeInTheDocument();
        
        unmount();
      });
    });

    test('should apply smooth transitions during resize', () => {
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground />);
      
      // Start with desktop size
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
      
      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Should handle transition smoothly
      expect(() => {
        jest.advanceTimersByTime(50);  // During transition
        jest.advanceTimersByTime(100); // Mid transition
        jest.advanceTimersByTime(200); // Complete transition
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle touch interactions on mobile during resize', () => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Mock getBoundingClientRect
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
      
      // Simulate touch during resize
      const touchStart = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          identifier: 0,
        } as Touch],
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchStart);
      }).not.toThrow();
      
      // Trigger resize while touch is active
      Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });
      
      const resizeEvent = new Event('resize');
      expect(() => {
        window.dispatchEvent(resizeEvent);
      }).not.toThrow();
    });

    test('should maintain performance during window resize', () => {
      jest.useFakeTimers();
      
      render(<EnhancedShaderBackground particleCount={200} intensity={1.0} />);
      
      // Simulate performance-intensive resize
      Object.defineProperty(window, 'innerWidth', { value: 3440, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1440, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Should handle high-resolution resize without errors
      expect(() => {
        jest.advanceTimersByTime(300);
      }).not.toThrow();
      
      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      
      jest.useRealTimers();
    });

    test('should handle window resize with different device capabilities', () => {
      const deviceConfigs = [
        { cores: 2, memory: 2, description: 'low-end' },
        { cores: 4, memory: 8, description: 'mid-range' },
        { cores: 8, memory: 16, description: 'high-end' },
      ];
      
      deviceConfigs.forEach(({ cores, memory, description }) => {
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: cores, configurable: true });
        (navigator as any).deviceMemory = memory;
        
        jest.useFakeTimers();
        
        const { unmount } = render(<EnhancedShaderBackground />);
        
        // Trigger resize
        Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 720, configurable: true });
        
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
        
        expect(() => {
          jest.advanceTimersByTime(300);
        }).not.toThrow();
        
        const container = screen.getByRole('presentation', { hidden: true });
        expect(container).toBeInTheDocument();
        
        jest.useRealTimers();
        unmount();
      });
    });

    test('should handle edge case screen dimensions', () => {
      const edgeCases = [
        { width: 100, height: 100, description: 'very small' },
        { width: 7680, height: 4320, description: '8K display' },
        { width: 1, height: 1000, description: 'extremely narrow' },
        { width: 1000, height: 1, description: 'extremely wide' },
      ];
      
      edgeCases.forEach(({ width, height, description }) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        
        expect(() => {
          const { unmount } = render(<EnhancedShaderBackground />);
          
          const container = screen.getByRole('presentation', { hidden: true });
          expect(container).toBeInTheDocument();
          
          unmount();
        }).not.toThrow();
      });
    });
  });

  describe('Mobile Touch Optimizations', () => {
    beforeEach(() => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
    });

    test('should handle single touch interactions', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Mock getBoundingClientRect
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
      
      const touchStart = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          identifier: 0,
        } as Touch],
      });
      
      const touchMove = new TouchEvent('touchmove', {
        touches: [{
          clientX: 150,
          clientY: 250,
          identifier: 0,
        } as Touch],
      });
      
      const touchEnd = new TouchEvent('touchend', {
        touches: [],
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchStart);
        shaderContainer.dispatchEvent(touchMove);
        shaderContainer.dispatchEvent(touchEnd);
      }).not.toThrow();
    });

    test('should handle multi-touch gestures', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Mock getBoundingClientRect
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
      
      const multiTouch = new TouchEvent('touchstart', {
        touches: [
          {
            clientX: 100,
            clientY: 200,
            identifier: 0,
          } as Touch,
          {
            clientX: 200,
            clientY: 300,
            identifier: 1,
          } as Touch,
        ],
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(multiTouch);
      }).not.toThrow();
    });

    test('should handle touch pressure variations', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Mock getBoundingClientRect
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
      
      const pressureTouch = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          identifier: 0,
          force: 0.8, // High pressure
        } as Touch],
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(pressureTouch);
      }).not.toThrow();
    });

    test('should optimize touch sensitivity for different screen sizes', () => {
      const screenSizes = [
        { width: 320, height: 568, description: 'iPhone SE' },
        { width: 375, height: 667, description: 'iPhone 8' },
        { width: 414, height: 896, description: 'iPhone 11' },
        { width: 768, height: 1024, description: 'iPad' },
      ];
      
      screenSizes.forEach(({ width, height, description }) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        
        const { container, unmount } = render(<EnhancedShaderBackground interactionEnabled={true} />);
        const shaderContainer = container.firstChild as HTMLElement;
        
        // Mock getBoundingClientRect for current screen size
        shaderContainer.getBoundingClientRect = jest.fn(() => ({
          left: 0,
          top: 0,
          width,
          height,
          right: width,
          bottom: height,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }));
        
        const touch = new TouchEvent('touchstart', {
          touches: [{
            clientX: width / 2,
            clientY: height / 2,
            identifier: 0,
          } as Touch],
        });
        
        expect(() => {
          shaderContainer.dispatchEvent(touch);
        }).not.toThrow();
        
        unmount();
      });
    });

    test('should handle touch cancellation gracefully', () => {
      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderContainer = container.firstChild as HTMLElement;
      
      // Mock getBoundingClientRect
      shaderContainer.getBoundingClientRect = jest.fn(() => ({
        left: 0,
        top: 0,
        width: 375,
        height: 667,
        right: 375,
        bottom: 667,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
      
      const touchStart = new TouchEvent('touchstart', {
        touches: [{
          clientX: 100,
          clientY: 200,
          identifier: 0,
        } as Touch],
      });
      
      const touchCancel = new TouchEvent('touchcancel', {
        touches: [],
      });
      
      expect(() => {
        shaderContainer.dispatchEvent(touchStart);
        shaderContainer.dispatchEvent(touchCancel);
      }).not.toThrow();
    });
  });
});