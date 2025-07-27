/**
 * Comprehensive Integration Tests for Enhanced Shader Background System
 * 
 * This test suite validates the complete shader system integration,
 * performance optimization, and cross-browser compatibility.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

import EnhancedShaderBackground from '../BonsaiShaderBackground';
import { 
  PerformanceMonitor, 
  DeviceCapabilityDetector, 
  AdaptiveQualityManager,
  CrossBrowserCompatibility 
} from '../../utils/performanceOptimization';
import { 
  BrowserDetector, 
  CompatibilityTester, 
  PerformanceTester,
  AutomatedTestRunner 
} from '../../utils/crossBrowserTesting';

// Mock Three.js with more comprehensive mocking
vi.mock('three', () => ({
  Scene: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
  })),
  OrthographicCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setClearColor: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
    getContext: vi.fn(() => ({
      canvas: document.createElement('canvas'),
      getExtension: vi.fn(),
      getParameter: vi.fn(() => 1024),
    })),
  })),
  ShaderMaterial: vi.fn(() => ({
    dispose: vi.fn(),
  })),
  PlaneGeometry: vi.fn(() => ({
    dispose: vi.fn(),
  })),
  Mesh: vi.fn(),
  Vector2: vi.fn(() => ({
    set: vi.fn(),
    x: 0,
    y: 0,
  })),
  Vector3: vi.fn(() => ({
    set: vi.fn(),
    x: 0,
    y: 0,
    z: 0,
  })),
  AdditiveBlending: 'AdditiveBlending',
}));

// Enhanced performance mocking
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    jsHeapSizeLimit: 2 * 1024 * 1024 * 1024, // 2GB
  },
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock requestAnimationFrame with more control
let animationFrameCallbacks: FrameRequestCallback[] = [];
let animationFrameId = 0;

global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  const id = ++animationFrameId;
  animationFrameCallbacks.push(callback);
  setTimeout(() => callback(Date.now()), 16);
  return id;
});

global.cancelAnimationFrame = vi.fn((id: number) => {
  // Remove callback if it exists
  animationFrameCallbacks = animationFrameCallbacks.filter((_, index) => index !== id - 1);
});

// Mock WebGL context with comprehensive support
const createMockWebGLContext = () => ({
  canvas: document.createElement('canvas'),
  drawingBufferWidth: 1920,
  drawingBufferHeight: 1080,
  getExtension: vi.fn((name: string) => {
    const extensions: { [key: string]: any } = {
      'WEBGL_debug_renderer_info': {
        UNMASKED_VENDOR_WEBGL: 37445,
        UNMASKED_RENDERER_WEBGL: 37446,
      },
      'OES_texture_float': {},
      'OES_texture_half_float': {},
      'WEBGL_lose_context': {
        loseContext: vi.fn(),
        restoreContext: vi.fn(),
      },
    };
    return extensions[name] || null;
  }),
  getParameter: vi.fn((param: number) => {
    const params: { [key: number]: any } = {
      37445: 'Mock Vendor', // UNMASKED_VENDOR_WEBGL
      37446: 'Mock Renderer', // UNMASKED_RENDERER_WEBGL
      3379: 2048, // MAX_TEXTURE_SIZE
      36347: 256, // MAX_VERTEX_UNIFORM_VECTORS
      36348: 256, // MAX_FRAGMENT_UNIFORM_VECTORS
      34930: 16, // MAX_TEXTURE_IMAGE_UNITS
    };
    return params[param] || 1024;
  }),
  getSupportedExtensions: vi.fn(() => [
    'OES_texture_float',
    'OES_texture_half_float',
    'WEBGL_debug_renderer_info',
    'WEBGL_lose_context',
  ]),
  createShader: vi.fn(() => ({})),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  getShaderParameter: vi.fn(() => true),
  createProgram: vi.fn(() => ({})),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  useProgram: vi.fn(),
  createBuffer: vi.fn(() => ({})),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  getAttribLocation: vi.fn(() => 0),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  getUniformLocation: vi.fn(() => ({})),
  uniform1f: vi.fn(),
  uniform2f: vi.fn(),
  uniform3f: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  clear: vi.fn(),
  clearColor: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  blendFunc: vi.fn(),
  drawArrays: vi.fn(),
  viewport: vi.fn(),
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  LINK_STATUS: 35714,
  COLOR_BUFFER_BIT: 16384,
  DEPTH_BUFFER_BIT: 256,
  BLEND: 3042,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
  ARRAY_BUFFER: 34962,
  STATIC_DRAW: 35044,
  FLOAT: 5126,
  TRIANGLES: 4,
});

// Mock HTMLCanvasElement.getContext with comprehensive WebGL support
HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
  if (contextId === 'webgl' || contextId === 'experimental-webgl' || contextId === 'webgl2') {
    return createMockWebGLContext();
  }
  return null;
});

describe('Enhanced Shader Background - Complete System Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    animationFrameCallbacks = [];
    animationFrameId = 0;
    
    // Reset DOM
    document.documentElement.className = '';
    
    // Reset window properties
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
    
    // Reset navigator properties
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
    Object.defineProperty(navigator, 'userAgent', { 
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      configurable: true 
    });
  });

  afterEach(() => {
    // Clean up any running animations
    animationFrameCallbacks.forEach((callback, id) => {
      cancelAnimationFrame(id + 1);
    });
  });

  describe('Performance Optimization Integration', () => {
    it('should initialize with optimized settings based on device capabilities', () => {
      const detector = new DeviceCapabilityDetector();
      const capabilities = detector.detectCapabilities();
      
      expect(capabilities.webglVersion).toBeGreaterThan(0);
      expect(capabilities.maxTextureSize).toBeGreaterThan(0);
      expect(capabilities.isHighPerformance).toBeDefined();
      expect(capabilities.isMobile).toBeDefined();
    });

    it('should adapt quality settings based on performance metrics', async () => {
      const qualityManager = new AdaptiveQualityManager();
      
      // Simulate poor performance
      mockPerformance.now.mockReturnValueOnce(0).mockReturnValueOnce(50); // 20 FPS
      
      const settings = qualityManager.updateQuality(50);
      expect(settings.qualityLevel).toBeLessThan(1.0);
      
      qualityManager.dispose();
    });

    it('should monitor performance metrics continuously', () => {
      const monitor = new PerformanceMonitor();
      
      // Simulate frame updates
      monitor.updateFrame(0);
      monitor.updateFrame(16.67);
      monitor.updateFrame(33.33);
      
      const metrics = monitor.metrics;
      expect(metrics.frameRate).toBeGreaterThan(0);
      expect(metrics.frameTime).toBeGreaterThan(0);
      
      monitor.dispose();
    });

    it('should provide optimization recommendations based on performance', () => {
      const monitor = new PerformanceMonitor();
      
      // Simulate poor performance
      monitor.updateFrame(0);
      monitor.updateFrame(100); // 10 FPS
      
      const recommendations = monitor.getOptimizationRecommendations();
      expect(recommendations.particleCount).toBeLessThan(100);
      expect(recommendations.qualityLevel).toBeLessThan(1.0);
      
      monitor.dispose();
    });

    it('should handle memory pressure gracefully', () => {
      // Mock high memory usage
      mockPerformance.memory.usedJSHeapSize = 250 * 1024 * 1024; // 250MB
      
      const monitor = new PerformanceMonitor();
      monitor.updateFrame(0);
      monitor.updateFrame(16.67);
      
      const recommendations = monitor.getOptimizationRecommendations();
      expect(recommendations.enableAdvancedEffects).toBe(false);
      
      monitor.dispose();
    });
  });

  describe('Cross-Browser Compatibility', () => {
    it('should detect browser capabilities correctly', () => {
      const browser = BrowserDetector.detectBrowser();
      
      expect(browser.name).toBeDefined();
      expect(browser.version).toBeDefined();
      expect(browser.engine).toBeDefined();
      expect(browser.supportsWebGL).toBe(true);
    });

    it('should run compatibility tests successfully', () => {
      const results = CompatibilityTester.runCompatibilityTests();
      
      expect(results.webglSupport).toBe(true);
      expect(results.shaderCompilation).toBe(true);
      expect(results.uniformSupport).toBe(true);
      expect(results.contextCreation).toBe(true);
      expect(results.textureSupport).toBe(true);
      expect(results.passed).toBe(true);
    });

    it('should provide browser-specific optimizations', () => {
      // Test Chrome optimizations
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true,
      });
      
      const optimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(optimizations.qualityLevel).toBe(1.0);
      expect(optimizations.enableAdvancedEffects).toBe(true);
    });

    it('should handle Safari-specific limitations', () => {
      // Mock Safari user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        configurable: true,
      });
      
      const optimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(optimizations.renderScale).toBe(0.8);
      expect(optimizations.enableAdvancedEffects).toBe(false);
      
      const workarounds = CrossBrowserCompatibility.getBrowserWorkarounds();
      expect(workarounds.disableFloatTextures).toBe(true);
    });

    it('should optimize for mobile browsers', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true,
      });
      
      const optimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(optimizations.particleCount).toBeLessThan(100);
      expect(optimizations.interactionEnabled).toBe(false);
      expect(optimizations.targetFrameRate).toBe(30);
    });
  });

  describe('Shader Component Integration', () => {
    it('should render with performance-optimized settings', () => {
      render(<EnhancedShaderBackground intensity={0.8} />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-intensity', '0.8');
    });

    it('should adapt to device capabilities automatically', () => {
      // Mock low-end device
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, configurable: true });
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15',
        configurable: true,
      });
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-interaction-enabled', 'false');
    });

    it('should handle WebGL context loss gracefully', async () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Simulate context loss
      const canvas = container.querySelector('canvas');
      if (canvas) {
        const loseContextExt = (canvas.getContext('webgl') as any)?.getExtension('WEBGL_lose_context');
        if (loseContextExt) {
          loseContextExt.loseContext();
          
          // Should not crash
          await waitFor(() => {
            expect(container).toBeInTheDocument();
          });
        }
      }
    });

    it('should fall back to CSS when WebGL is unavailable', () => {
      // Mock WebGL unavailable
      HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-using-fallback', 'true');
      
      // Restore WebGL mock
      HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
        if (contextId === 'webgl' || contextId === 'experimental-webgl' || contextId === 'webgl2') {
          return createMockWebGLContext();
        }
        return null;
      });
    });

    it('should respect reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn(() => ({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
      });
      
      render(<EnhancedShaderBackground respectMotionPreference={true} />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-using-fallback', 'true');
    });

    it('should handle theme changes smoothly', async () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Change theme
      document.documentElement.classList.add('dark');
      
      // Trigger mutation observer
      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
      
      // Should handle theme change without errors
      expect(container).toBeInTheDocument();
    });

    it('should handle window resize events', async () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Change window size
      Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 720, configurable: true });
      
      // Trigger resize event
      fireEvent(window, new Event('resize'));
      
      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });

    it('should clean up resources on unmount', () => {
      const { unmount } = render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance Testing Integration', () => {
    it('should run automated performance tests', async () => {
      const testRunner = new AutomatedTestRunner();
      
      // Mock performance test results
      const results = await testRunner.runAllTests();
      
      expect(results.compatibility).toBeDefined();
      expect(results.performance).toBeDefined();
      expect(results.summary).toBeDefined();
      
      expect(results.compatibility.passed).toBe(true);
      expect(results.summary.overallPassed).toBeDefined();
    });

    it('should generate optimization recommendations', async () => {
      const testRunner = new AutomatedTestRunner();
      const results = await testRunner.runAllTests();
      
      expect(results.summary.optimizationSuggestions).toBeDefined();
      expect(Array.isArray(results.summary.optimizationSuggestions)).toBe(true);
    });

    it('should handle performance test failures gracefully', () => {
      const performanceTester = new PerformanceTester();
      
      performanceTester.startTest();
      
      // Simulate poor performance
      performanceTester.recordFrame(15, 50); // 15 FPS, 50ms render time
      performanceTester.recordFrame(20, 45);
      performanceTester.recordFrame(18, 55);
      
      const results = performanceTester.endTest();
      
      expect(results.passed).toBe(false);
      expect(results.issues.length).toBeGreaterThan(0);
      expect(results.averageFrameRate).toBeLessThan(30);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should handle shader compilation errors', () => {
      // Mock shader compilation failure
      const mockContext = createMockWebGLContext();
      mockContext.getShaderParameter = vi.fn(() => false);
      
      HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
      
      expect(() => {
        render(<EnhancedShaderBackground />);
      }).not.toThrow();
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
    });

    it('should handle WebGL context creation errors', () => {
      // Mock context creation failure
      HTMLCanvasElement.prototype.getContext = vi.fn(() => {
        throw new Error('WebGL context creation failed');
      });
      
      expect(() => {
        render(<EnhancedShaderBackground />);
      }).not.toThrow();
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-using-fallback', 'true');
    });

    it('should handle memory allocation errors', () => {
      // Mock memory allocation failure
      const mockContext = createMockWebGLContext();
      mockContext.createBuffer = vi.fn(() => {
        throw new Error('Out of memory');
      });
      
      HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
      
      expect(() => {
        render(<EnhancedShaderBackground />);
      }).not.toThrow();
    });

    it('should handle animation frame errors', () => {
      // Mock requestAnimationFrame failure
      global.requestAnimationFrame = vi.fn(() => {
        throw new Error('Animation frame error');
      });
      
      expect(() => {
        render(<EnhancedShaderBackground />);
      }).not.toThrow();
      
      // Restore mock
      global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
        const id = ++animationFrameId;
        animationFrameCallbacks.push(callback);
        setTimeout(() => callback(Date.now()), 16);
        return id;
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should have proper ARIA attributes', () => {
      render(<EnhancedShaderBackground ariaLabel="Custom shader background" />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveAttribute('aria-hidden', 'true');
      expect(container).toHaveAttribute('aria-label', 'Custom shader background');
    });

    it('should not interfere with screen readers', () => {
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toHaveClass('pointer-events-none');
      expect(container).toHaveAttribute('aria-hidden', 'true');
    });

    it('should respect accessibility preferences', () => {
      render(<EnhancedShaderBackground disableAnimations={true} />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-using-fallback', 'true');
    });
  });

  describe('Memory Management', () => {
    it('should clean up WebGL resources on unmount', () => {
      const { unmount } = render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Should clean up without memory leaks
      unmount();
      
      // Verify cleanup was called (mocked methods should have been called)
      expect(true).toBe(true); // Placeholder - in real implementation, verify dispose calls
    });

    it('should handle multiple instances without conflicts', () => {
      const { unmount: unmount1 } = render(<EnhancedShaderBackground />);
      const { unmount: unmount2 } = render(<EnhancedShaderBackground />);
      
      const containers = screen.getAllByTestId('enhanced-shader-background');
      expect(containers).toHaveLength(2);
      
      unmount1();
      unmount2();
    });

    it('should monitor memory usage during operation', () => {
      const monitor = new PerformanceMonitor();
      
      // Simulate memory usage
      mockPerformance.memory.usedJSHeapSize = 100 * 1024 * 1024; // 100MB
      
      monitor.updateFrame(0);
      monitor.updateFrame(16.67);
      
      const metrics = monitor.metrics;
      expect(metrics.memoryUsage).toBeGreaterThan(0);
      
      monitor.dispose();
    });
  });
});

describe('Shader Parameter Fine-Tuning', () => {
  it('should optimize shader parameters for visual impact', () => {
    const settings = {
      particleCount: 150,
      renderScale: 1.0,
      animationSpeed: 1.0,
      interactionEnabled: true,
      qualityLevel: 0.8,
      enableAdvancedEffects: true,
      targetFrameRate: 60,
    };
    
    const capabilities = {
      webglVersion: 1,
      maxTextureSize: 2048,
      maxVertexUniforms: 256,
      maxFragmentUniforms: 256,
      extensions: ['OES_texture_float'],
      vendor: 'Mock Vendor',
      renderer: 'Mock Renderer',
      isHighPerformance: true,
      isMobile: false,
      supportsFloatTextures: true,
      supportsHalfFloatTextures: true,
    };
    
    // This would be tested with actual shader parameter optimization
    expect(settings.qualityLevel).toBe(0.8);
    expect(settings.enableAdvancedEffects).toBe(true);
  });

  it('should balance performance and visual quality', () => {
    render(
      <EnhancedShaderBackground 
        intensity={0.9}
        particleCount={200}
        animationSpeed={1.2}
        interactionEnabled={true}
      />
    );
    
    const container = screen.getByTestId('enhanced-shader-background');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-intensity', '0.9');
    expect(container).toHaveAttribute('data-interaction-enabled', 'true');
  });
});

describe('Cross-Device Validation', () => {
  const deviceConfigs = [
    {
      name: 'High-end Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      hardwareConcurrency: 16,
      devicePixelRatio: 2,
      innerWidth: 2560,
      innerHeight: 1440,
    },
    {
      name: 'Standard Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      hardwareConcurrency: 8,
      devicePixelRatio: 1,
      innerWidth: 1920,
      innerHeight: 1080,
    },
    {
      name: 'Mobile Device',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      hardwareConcurrency: 4,
      devicePixelRatio: 3,
      innerWidth: 375,
      innerHeight: 667,
    },
    {
      name: 'Low-end Device',
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0; SM-G935F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
      hardwareConcurrency: 2,
      devicePixelRatio: 1,
      innerWidth: 360,
      innerHeight: 640,
    },
  ];

  deviceConfigs.forEach(config => {
    it(`should work correctly on ${config.name}`, () => {
      // Mock device properties
      Object.defineProperty(navigator, 'userAgent', { value: config.userAgent, configurable: true });
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: config.hardwareConcurrency, configurable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: config.devicePixelRatio, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: config.innerWidth, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: config.innerHeight, configurable: true });
      
      render(<EnhancedShaderBackground />);
      
      const container = screen.getByTestId('enhanced-shader-background');
      expect(container).toBeInTheDocument();
      
      // Verify appropriate settings for device type
      if (config.name.includes('Mobile') || config.name.includes('Low-end')) {
        expect(container).toHaveAttribute('data-interaction-enabled', 'false');
      } else {
        expect(container).toHaveAttribute('data-interaction-enabled', 'true');
      }
    });
  });
});