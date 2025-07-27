import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedShaderBackground from '../BonsaiShaderBackground';
import { describe, test, beforeEach, afterEach } from 'node:test';
import {
  calculateViewportDimensions,
  calculateResponsiveShaderSettings,
  calculateResponsiveShaderSettingsWithTransition,
  calculateOrientationOptimizations,
  calculateUltrawideOptimizations,
  processTouchInteraction,
  calculateTouchInteractionRadius,
  ResponsiveTransitionManager,
  ResponsiveScaleManager,
  handleMobileResizeOptimizations,
  type ViewportDimensions,
  type DeviceCapabilities,
  type ResponsiveShaderSettings,
  type TouchInteraction,
} from '../../utils/shaderUtils';

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
    dispose: jest.fn(),
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

describe('Responsive Scaling and Window Resize Handling', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  let originalDevicePixelRatio: number;
  let originalUserAgent: string;

  beforeEach(() => {
    // Store original values
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalDevicePixelRatio = window.devicePixelRatio;
    originalUserAgent = navigator.userAgent;

    // Reset to default desktop values
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { value: originalDevicePixelRatio, configurable: true });
    Object.defineProperty(navigator, 'userAgent', { value: originalUserAgent, configurable: true });
  });

  describe('Viewport Dimensions Calculation', () => {
    test('should calculate correct viewport dimensions for desktop', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

      const viewport = calculateViewportDimensions();

      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
      expect(viewport.aspectRatio).toBeCloseTo(1.78, 2);
      expect(viewport.orientation).toBe('landscape');
      expect(viewport.deviceType).toBe('desktop');
      expect(viewport.isUltrawide).toBe(false);
    });

    test('should calculate correct viewport dimensions for mobile portrait', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const viewport = calculateViewportDimensions();

      expect(viewport.width).toBe(375);
      expect(viewport.height).toBe(667);
      expect(viewport.aspectRatio).toBeCloseTo(0.56, 2);
      expect(viewport.orientation).toBe('portrait');
      expect(viewport.deviceType).toBe('mobile');
      expect(viewport.isUltrawide).toBe(false);
    });

    test('should calculate correct viewport dimensions for ultrawide display', () => {
      Object.defineProperty(window, 'innerWidth', { value: 3440, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1440, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

      const viewport = calculateViewportDimensions();

      expect(viewport.width).toBe(3440);
      expect(viewport.height).toBe(1440);
      expect(viewport.aspectRatio).toBeCloseTo(2.39, 2);
      expect(viewport.orientation).toBe('landscape');
      expect(viewport.deviceType).toBe('desktop');
      expect(viewport.isUltrawide).toBe(true);
    });

    test('should calculate correct viewport dimensions for tablet', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const viewport = calculateViewportDimensions();

      expect(viewport.width).toBe(768);
      expect(viewport.height).toBe(1024);
      expect(viewport.aspectRatio).toBe(0.75);
      expect(viewport.orientation).toBe('portrait');
      expect(viewport.deviceType).toBe('tablet');
      expect(viewport.isUltrawide).toBe(false);
    });
  });

  describe('Responsive Shader Settings Calculation', () => {
    const mockDeviceCapabilities: DeviceCapabilities = {
      tier: 'medium',
      score: 0.6,
      features: {
        webgl2: false,
        floatTextures: true,
        halfFloatTextures: true,
        depthTextures: false,
        instancedArrays: false,
        vertexArrayObjects: false,
        maxTextureSize: 4096,
        maxVertexAttribs: 16,
        maxFragmentUniforms: 64,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        cores: 8,
        deviceMemory: 8,
        pixelRatio: 1,
        refreshRate: 60,
        renderer: 'NVIDIA GeForce GTX 1060',
        vendor: 'NVIDIA Corporation',
      },
    };

    test('should calculate appropriate settings for desktop', () => {
      const viewport = calculateViewportDimensions();
      const settings = calculateResponsiveShaderSettings(viewport, mockDeviceCapabilities);

      expect(settings.renderScale).toBeGreaterThan(0.5);
      expect(settings.renderScale).toBeLessThanOrEqual(1.0);
      expect(settings.particleCount).toBeGreaterThan(50);
      expect(settings.particleCount).toBeLessThanOrEqual(200);
      expect(settings.interactionRadius).toBeGreaterThan(0.2);
      expect(settings.interactionRadius).toBeLessThanOrEqual(0.4);
      expect(settings.enableComplexEffects).toBe(true);
    });

    test('should calculate appropriate settings for mobile', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const mobileCapabilities: DeviceCapabilities = {
        ...mockDeviceCapabilities,
        tier: 'low',
        score: 0.3,
        features: {
          ...mockDeviceCapabilities.features,
          isMobile: true,
          isDesktop: false,
          cores: 4,
          deviceMemory: 4,
        },
      };

      const viewport = calculateViewportDimensions();
      const settings = calculateResponsiveShaderSettings(viewport, mobileCapabilities);

      expect(settings.renderScale).toBeLessThan(1.0);
      expect(settings.particleCount).toBeLessThan(100);
      expect(settings.interactionRadius).toBeLessThan(0.3);
      expect(settings.enableComplexEffects).toBe(false);
      expect(settings.debounceDelay).toBeGreaterThan(150);
    });

    test('should calculate appropriate settings for high-end devices', () => {
      const highEndCapabilities: DeviceCapabilities = {
        ...mockDeviceCapabilities,
        tier: 'high',
        score: 0.9,
        features: {
          ...mockDeviceCapabilities.features,
          webgl2: true,
          cores: 16,
          deviceMemory: 32,
          renderer: 'NVIDIA GeForce RTX 3080',
        },
      };

      const viewport = calculateViewportDimensions();
      const settings = calculateResponsiveShaderSettings(viewport, highEndCapabilities);

      expect(settings.renderScale).toBeGreaterThan(0.8);
      expect(settings.particleCount).toBeGreaterThan(100);
      expect(settings.interactionRadius).toBeGreaterThan(0.3);
      expect(settings.enableComplexEffects).toBe(true);
      expect(settings.qualityLevel).toBeGreaterThan(0.8);
    });

    test('should apply smooth transitions between settings', () => {
      const viewport = calculateViewportDimensions();
      const previousSettings: ResponsiveShaderSettings = {
        renderScale: 1.0,
        particleCount: 100,
        interactionRadius: 0.3,
        animationSpeed: 1.0,
        qualityLevel: 0.8,
        enableComplexEffects: true,
        debounceDelay: 150,
        transitionDuration: 300,
      };

      const newSettings = calculateResponsiveShaderSettingsWithTransition(
        viewport,
        mockDeviceCapabilities,
        {},
        previousSettings
      );

      // Changes should be limited to prevent jarring transitions
      const particleRatio = newSettings.particleCount / previousSettings.particleCount;
      const scaleRatio = newSettings.renderScale / previousSettings.renderScale;

      expect(particleRatio).toBeGreaterThan(0.7); // Max 30% decrease
      expect(particleRatio).toBeLessThan(1.3); // Max 30% increase
      expect(scaleRatio).toBeGreaterThan(0.8); // Max 20% decrease
      expect(scaleRatio).toBeLessThan(1.2); // Max 20% increase
    });
  });

  describe('Orientation Optimizations', () => {
    test('should optimize for portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });

      const viewport = calculateViewportDimensions();
      const settings = calculateOrientationOptimizations(viewport, 'landscape');

      expect(viewport.orientation).toBe('portrait');
      expect(settings.particleCount).toBeLessThan(100); // Reduced for portrait
      expect(settings.interactionRadius).toBeLessThan(0.3); // Smaller interaction area
      expect(settings.transitionDuration).toBe(400); // Longer transition for orientation change
    });

    test('should optimize for landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });

      const viewport = calculateViewportDimensions();
      const settings = calculateOrientationOptimizations(viewport, 'portrait');

      expect(viewport.orientation).toBe('landscape');
      expect(settings.particleCount).toBeGreaterThan(50); // More particles in landscape
      expect(settings.interactionRadius).toBeGreaterThan(0.2); // Larger interaction area
      expect(settings.transitionDuration).toBe(350); // Standard transition duration
    });
  });

  describe('Ultrawide Display Optimizations', () => {
    test('should optimize for ultrawide displays', () => {
      Object.defineProperty(window, 'innerWidth', { value: 3440, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1440, configurable: true });

      const viewport = calculateViewportDimensions();
      const settings = calculateUltrawideOptimizations(viewport, mockDeviceCapabilities);

      expect(viewport.isUltrawide).toBe(true);
      expect(settings.particleCount).toBeGreaterThan(100); // More particles for ultrawide
      expect(settings.interactionRadius).toBeGreaterThan(0.3); // Larger interaction radius
      expect(settings.renderScale).toBeLessThanOrEqual(1.0); // Optimized render scale
      expect(settings.animationSpeed).toBeGreaterThan(1.0); // Faster animations
    });

    test('should not apply ultrawide optimizations for standard displays', () => {
      const viewport = calculateViewportDimensions(); // Default 1920x1080
      const baseSettings = calculateResponsiveShaderSettings(viewport, mockDeviceCapabilities);
      const ultrawideSettings = calculateUltrawideOptimizations(viewport, mockDeviceCapabilities);

      expect(viewport.isUltrawide).toBe(false);
      expect(ultrawideSettings).toEqual(baseSettings); // Should be identical
    });
  });

  describe('Touch Interaction Processing', () => {
    const mockContainerRect: DOMRect = {
      left: 0,
      top: 0,
      width: 375,
      height: 667,
      right: 375,
      bottom: 667,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };

    test('should process touch interactions correctly', () => {
      const mockTouch: Touch = {
        identifier: 1,
        target: document.createElement('div'),
        clientX: 187.5, // Center X
        clientY: 333.5, // Center Y
        pageX: 187.5,
        pageY: 333.5,
        screenX: 187.5,
        screenY: 333.5,
        radiusX: 25,
        radiusY: 25,
        rotationAngle: 0,
        force: 0.8,
      };

      const touchInteraction = processTouchInteraction(mockTouch, mockContainerRect);

      expect(touchInteraction.isActive).toBe(true);
      expect(touchInteraction.position.x).toBeCloseTo(0.5, 2); // Normalized center X
      expect(touchInteraction.position.y).toBeCloseTo(0.5, 2); // Normalized center Y (flipped)
      expect(touchInteraction.pressure).toBe(0.8);
      expect(touchInteraction.radiusX).toBe(25);
      expect(touchInteraction.radiusY).toBe(25);
      expect(touchInteraction.rotationAngle).toBe(0);
      expect(touchInteraction.timestamp).toBeGreaterThan(0);
    });

    test('should clamp touch coordinates to valid range', () => {
      const mockTouch: Touch = {
        identifier: 1,
        target: document.createElement('div'),
        clientX: -50, // Outside left boundary
        clientY: 800, // Outside bottom boundary
        pageX: -50,
        pageY: 800,
        screenX: -50,
        screenY: 800,
        radiusX: 20,
        radiusY: 20,
        rotationAngle: 0,
        force: 1.0,
      };

      const touchInteraction = processTouchInteraction(mockTouch, mockContainerRect);

      expect(touchInteraction.position.x).toBe(0); // Clamped to minimum
      expect(touchInteraction.position.y).toBe(0); // Clamped to minimum (flipped)
    });

    test('should handle touch interactions with missing properties', () => {
      const mockTouch: Partial<Touch> = {
        identifier: 1,
        target: document.createElement('div'),
        clientX: 100,
        clientY: 200,
        pageX: 100,
        pageY: 200,
        screenX: 100,
        screenY: 200,
        // Missing radiusX, radiusY, rotationAngle, force
      };

      const touchInteraction = processTouchInteraction(mockTouch as Touch, mockContainerRect);

      expect(touchInteraction.isActive).toBe(true);
      expect(touchInteraction.pressure).toBe(1.0); // Default value
      expect(touchInteraction.radiusX).toBe(25); // Default value
      expect(touchInteraction.radiusY).toBe(25); // Default value
      expect(touchInteraction.rotationAngle).toBe(0); // Default value
    });
  });

  describe('Touch Interaction Radius Calculation', () => {
    test('should calculate appropriate radius for mobile devices', () => {
      const baseRadius = 0.3;
      const radius = calculateTouchInteractionRadius(baseRadius, undefined, 'mobile');

      expect(radius).toBeLessThan(baseRadius); // Should be smaller for mobile
      expect(radius).toBeGreaterThan(0.1); // Should be within bounds
      expect(radius).toBeLessThan(0.6); // Should be within bounds
    });

    test('should calculate appropriate radius for tablet devices', () => {
      const baseRadius = 0.3;
      const radius = calculateTouchInteractionRadius(baseRadius, undefined, 'tablet');

      expect(radius).toBeGreaterThan(baseRadius); // Should be larger for tablet
      expect(radius).toBeGreaterThan(0.1); // Should be within bounds
      expect(radius).toBeLessThan(0.6); // Should be within bounds
    });

    test('should adjust radius based on touch properties', () => {
      const baseRadius = 0.3;
      const touchInteraction: TouchInteraction = {
        isActive: true,
        position: { x: 0.5, y: 0.5 },
        pressure: 1.2,
        radiusX: 40,
        radiusY: 40,
        rotationAngle: 0,
        timestamp: Date.now(),
      };

      const radius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'mobile');

      expect(radius).toBeGreaterThan(0.1);
      expect(radius).toBeLessThan(0.6);
      // Should be adjusted based on touch size and pressure
    });

    test('should clamp radius to reasonable bounds', () => {
      const baseRadius = 2.0; // Unreasonably large
      const radius = calculateTouchInteractionRadius(baseRadius, undefined, 'desktop');

      expect(radius).toBeLessThanOrEqual(0.6); // Should be clamped to maximum
    });
  });

  describe('Responsive Transition Manager', () => {
    test('should manage smooth transitions between settings', () => {
      const transitionManager = new ResponsiveTransitionManager(300);

      const fromSettings: ResponsiveShaderSettings = {
        renderScale: 0.8,
        particleCount: 80,
        interactionRadius: 0.25,
        animationSpeed: 0.9,
        qualityLevel: 0.7,
        enableComplexEffects: false,
        debounceDelay: 200,
        transitionDuration: 300,
      };

      const toSettings: ResponsiveShaderSettings = {
        renderScale: 1.0,
        particleCount: 120,
        interactionRadius: 0.35,
        animationSpeed: 1.1,
        qualityLevel: 0.9,
        enableComplexEffects: true,
        debounceDelay: 150,
        transitionDuration: 300,
      };

      transitionManager.startTransition(fromSettings, toSettings);

      expect(transitionManager.isTransitioning()).toBe(true);
      expect(transitionManager.getProgress()).toBe(0);

      // Simulate time passing
      jest.spyOn(performance, 'now').mockReturnValue(150); // 50% through transition
      const interpolatedSettings = transitionManager.updateTransition();

      expect(interpolatedSettings).not.toBeNull();
      if (interpolatedSettings) {
        expect(interpolatedSettings.renderScale).toBeGreaterThan(fromSettings.renderScale);
        expect(interpolatedSettings.renderScale).toBeLessThan(toSettings.renderScale);
        expect(interpolatedSettings.particleCount).toBeGreaterThan(fromSettings.particleCount);
        expect(interpolatedSettings.particleCount).toBeLessThan(toSettings.particleCount);
      }
    });

    test('should complete transition after duration', () => {
      const transitionManager = new ResponsiveTransitionManager(300);

      const fromSettings: ResponsiveShaderSettings = {
        renderScale: 0.8,
        particleCount: 80,
        interactionRadius: 0.25,
        animationSpeed: 0.9,
        qualityLevel: 0.7,
        enableComplexEffects: false,
        debounceDelay: 200,
        transitionDuration: 300,
      };

      const toSettings: ResponsiveShaderSettings = {
        renderScale: 1.0,
        particleCount: 120,
        interactionRadius: 0.35,
        animationSpeed: 1.1,
        qualityLevel: 0.9,
        enableComplexEffects: true,
        debounceDelay: 150,
        transitionDuration: 300,
      };

      transitionManager.startTransition(fromSettings, toSettings);

      // Simulate transition completion
      jest.spyOn(performance, 'now').mockReturnValue(300);
      const finalSettings = transitionManager.updateTransition();

      expect(transitionManager.isTransitioning()).toBe(false);
      expect(finalSettings).toEqual(toSettings);
    });

    test('should handle transition cancellation', () => {
      const transitionManager = new ResponsiveTransitionManager(300);

      const fromSettings: ResponsiveShaderSettings = {
        renderScale: 0.8,
        particleCount: 80,
        interactionRadius: 0.25,
        animationSpeed: 0.9,
        qualityLevel: 0.7,
        enableComplexEffects: false,
        debounceDelay: 200,
        transitionDuration: 300,
      };

      const toSettings: ResponsiveShaderSettings = {
        renderScale: 1.0,
        particleCount: 120,
        interactionRadius: 0.35,
        animationSpeed: 1.1,
        qualityLevel: 0.9,
        enableComplexEffects: true,
        debounceDelay: 150,
        transitionDuration: 300,
      };

      transitionManager.startTransition(fromSettings, toSettings);
      expect(transitionManager.isTransitioning()).toBe(true);

      transitionManager.cancelTransition();
      expect(transitionManager.isTransitioning()).toBe(false);

      const result = transitionManager.updateTransition();
      expect(result).toBeNull();
    });
  });

  describe('Window Resize Handling', () => {
    test('should handle window resize events with debouncing', async () => {
      jest.useFakeTimers();

      render(<EnhancedShaderBackground />);

      // Change window size
      Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 720, configurable: true });

      // Trigger resize event
      fireEvent(window, new Event('resize'));

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

    test('should handle rapid resize events without performance issues', async () => {
      jest.useFakeTimers();

      render(<EnhancedShaderBackground />);

      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        Object.defineProperty(window, 'innerWidth', { value: 1920 + i * 10, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1080 + i * 5, configurable: true });

        fireEvent(window, new Event('resize'));
      }

      // Should handle all events without errors
      expect(() => {
        jest.advanceTimersByTime(500);
      }).not.toThrow();

      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();

      jest.useRealTimers();
    });

    test('should handle orientation changes on mobile devices', async () => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });

      jest.useFakeTimers();

      render(<EnhancedShaderBackground />);

      // Simulate orientation change
      Object.defineProperty(window, 'innerWidth', { value: 667, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 375, configurable: true });

      fireEvent(window, new Event('orientationchange'));

      expect(() => {
        jest.advanceTimersByTime(600); // Orientation changes have longer delays
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

      const viewport = calculateViewportDimensions();
      const resizeEvent = {
        viewport,
        previousViewport: viewport,
        resizeType: 'orientation' as const,
        timestamp: Date.now(),
      };

      const optimizations = handleMobileResizeOptimizations(viewport, resizeEvent);

      expect(optimizations.particleCount).toBeLessThan(100); // Reduced for mobile
      expect(optimizations.debounceDelay).toBeGreaterThan(150); // Longer debounce for orientation
      expect(optimizations.transitionDuration).toBeGreaterThan(300); // Longer transition
    });
  });

  describe('Component Integration Tests', () => {
    test('should render with responsive scaling enabled', () => {
      render(<EnhancedShaderBackground />);

      const container = screen.getByRole('presentation', { hidden: true });
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('absolute', 'inset-0', 'z-0', 'overflow-hidden');
    });

    test('should handle different screen sizes gracefully', () => {
      const screenSizes = [
        { width: 320, height: 568 }, // Small mobile
        { width: 375, height: 667 }, // iPhone
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 }, // Desktop
        { width: 3440, height: 1440 }, // Ultrawide
      ];

      screenSizes.forEach(({ width, height }) => {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });

        const { container } = render(<EnhancedShaderBackground />);
        const shaderElement = container.firstChild as HTMLElement;

        expect(shaderElement).toBeInTheDocument();
        expect(shaderElement).toHaveClass('absolute', 'inset-0', 'z-0', 'overflow-hidden');
      });
    });

    test('should maintain performance across different device types', () => {
      const deviceConfigs = [
        {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          width: 375,
          height: 667,
          cores: 2,
          memory: 2,
        },
        {
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
          width: 768,
          height: 1024,
          cores: 4,
          memory: 4,
        },
        {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          width: 1920,
          height: 1080,
          cores: 8,
          memory: 16,
        },
      ];

      deviceConfigs.forEach(({ userAgent, width, height, cores, memory }) => {
        Object.defineProperty(navigator, 'userAgent', { value: userAgent, configurable: true });
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
        Object.defineProperty(navigator, 'hardwareConcurrency', { value: cores, configurable: true });
        (navigator as any).deviceMemory = memory;

        const { container } = render(<EnhancedShaderBackground />);
        const shaderElement = container.firstChild as HTMLElement;

        expect(shaderElement).toBeInTheDocument();
      });
    });

    test('should handle touch interactions on mobile devices', () => {
      // Mock mobile environment
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });

      const { container } = render(<EnhancedShaderBackground interactionEnabled={true} />);
      const shaderElement = container.firstChild as HTMLElement;

      expect(shaderElement).toBeInTheDocument();

      // Simulate touch events
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [
          {
            identifier: 1,
            target: shaderElement,
            clientX: 187.5,
            clientY: 333.5,
            pageX: 187.5,
            pageY: 333.5,
            screenX: 187.5,
            screenY: 333.5,
            radiusX: 25,
            radiusY: 25,
            rotationAngle: 0,
            force: 0.8,
          } as Touch,
        ],
        bubbles: true,
      });

      expect(() => {
        shaderElement.dispatchEvent(touchStartEvent);
      }).not.toThrow();
    });
  });
});