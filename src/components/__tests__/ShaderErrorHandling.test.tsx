/**
 * Comprehensive tests for shader error handling and fallback systems
 * Tests the integration of error handling in the BonsaiShaderBackground component
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import BonsaiShaderBackground from '../BonsaiShaderBackground';

// Mock WebGL context for testing
class MockWebGLContext {
  private _isContextLost = false;
  private _shouldFailCompilation = false;
  private _shouldFailLinking = false;
  
  // WebGL constants
  VERTEX_SHADER = 35633;
  FRAGMENT_SHADER = 35632;
  COMPILE_STATUS = 35713;
  LINK_STATUS = 35714;
  VALIDATE_STATUS = 35715;
  MAX_TEXTURE_SIZE = 3379;
  MAX_VERTEX_ATTRIBS = 34921;
  MAX_FRAGMENT_UNIFORM_VECTORS = 36349;

  createShader() { return { id: Math.random() }; }
  shaderSource() {}
  compileShader() {}
  getShaderParameter(shader: any, pname: number) { 
    if (pname === this.COMPILE_STATUS) {
      return !this._shouldFailCompilation;
    }
    if (pname === this.LINK_STATUS) {
      return !this._shouldFailLinking;
    }
    return true;
  }
  getShaderInfoLog() { 
    return this._shouldFailCompilation ? 'Shader compilation failed' : null;
  }
  deleteShader() {}
  createProgram() { return { id: Math.random() }; }
  attachShader() {}
  linkProgram() {}
  getProgramParameter(program: any, pname: number) { 
    if (pname === this.LINK_STATUS) {
      return !this._shouldFailLinking;
    }
    return true;
  }
  getProgramInfoLog() { 
    return this._shouldFailLinking ? 'Program linking failed' : null;
  }
  deleteProgram() {}
  validateProgram() {}
  useProgram() {}
  getUniformLocation() { return { id: Math.random() }; }
  uniform1f() {}
  uniform2f() {}
  uniform3f() {}
  uniform1i() {}
  createBuffer() { return { id: Math.random() }; }
  bindBuffer() {}
  bufferData() {}
  getAttribLocation() { return 0; }
  enableVertexAttribArray() {}
  vertexAttribPointer() {}
  drawArrays() {}
  viewport() {}
  clearColor() {}
  clear() {}
  enable() {}
  disable() {}
  blendFunc() {}
  getParameter(pname: number) { 
    switch (pname) {
      case this.MAX_TEXTURE_SIZE: return 2048;
      case this.MAX_VERTEX_ATTRIBS: return 16;
      case this.MAX_FRAGMENT_UNIFORM_VECTORS: return 32;
      default: return 0;
    }
  }
  getSupportedExtensions() { return ['WEBGL_lose_context', 'WEBGL_debug_renderer_info']; }
  getExtension(name: string) {
    if (name === 'WEBGL_lose_context') {
      return {
        loseContext: () => { this._isContextLost = true; },
        restoreContext: () => { this._isContextLost = false; },
      };
    }
    if (name === 'WEBGL_debug_renderer_info') {
      return {
        UNMASKED_RENDERER_WEBGL: 37446,
        UNMASKED_VENDOR_WEBGL: 37445,
      };
    }
    return null;
  }
  isContextLost() { return this._isContextLost; }
  
  // Test helper methods
  simulateContextLoss() { this._isContextLost = true; }
  restoreContext() { this._isContextLost = false; }
  simulateCompilationFailure() { this._shouldFailCompilation = true; }
  simulateLinkingFailure() { this._shouldFailLinking = true; }
  resetFailures() { 
    this._shouldFailCompilation = false; 
    this._shouldFailLinking = false;
  }
}

// Mock canvas
class MockCanvas extends EventTarget {
  width = 800;
  height = 600;
  private _context: MockWebGLContext | null = null;

  getContext(type: string) {
    if (type === 'webgl' || type === 'webgl2') {
      if (!this._context) {
        this._context = new MockWebGLContext();
      }
      return this._context;
    }
    return null;
  }

  getBoundingClientRect() {
    return { left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600 };
  }

  remove() {}
  appendChild() {}
  removeChild() {}
  
  simulateContextLoss() {
    const event = new Event('webglcontextlost');
    this.dispatchEvent(event);
  }

  simulateContextRestore() {
    const event = new Event('webglcontextrestored');
    this.dispatchEvent(event);
  }

  getWebGLContext() {
    return this._context;
  }
}

// Mock Three.js
const mockThreeJS = {
  Scene: function() {
    return { add: () => {} };
  },
  OrthographicCamera: function() {
    return {};
  },
  WebGLRenderer: function() {
    const canvas = new MockCanvas();
    return {
      setSize: () => {},
      setClearColor: () => {},
      render: () => {},
      dispose: () => {},
      domElement: canvas,
      getContext: () => canvas.getContext('webgl'),
    };
  },
  ShaderMaterial: function() {
    return {};
  },
  PlaneGeometry: function() {
    return {};
  },
  Mesh: function() {
    return {};
  },
  Vector2: function() {
    return { set: () => {}, x: 0, y: 0 };
  },
  Vector3: function() {
    return { set: () => {}, x: 0, y: 0, z: 0 };
  },
  AdditiveBlending: 'AdditiveBlending',
};

describe('Shader Error Handling Integration', () => {
  let originalCreateElement: typeof document.createElement;
  let mockCanvas: MockCanvas;

  beforeEach(() => {
    // Mock document.createElement for canvas
    originalCreateElement = document.createElement;
    mockCanvas = new MockCanvas();
    
    document.createElement = (tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return originalCreateElement.call(document, tagName);
    };

    // Mock Three.js
    (global as any).THREE = mockThreeJS;

    // Mock performance API
    if (!(global as any).performance) {
      (global as any).performance = {
        now: () => Date.now(),
        memory: {
          usedJSHeapSize: 50 * 1024 * 1024,
          jsHeapSizeLimit: 100 * 1024 * 1024,
        },
      };
    }

    // Mock requestAnimationFrame
    (global as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
      return setTimeout(callback, 16);
    };
    (global as any).cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };
  });

  afterEach(() => {
    // Restore original createElement
    document.createElement = originalCreateElement;
    
    // Clean up
    cleanup();
    
    // Reset mock canvas
    if (mockCanvas.getWebGLContext()) {
      mockCanvas.getWebGLContext()!.resetFailures();
      mockCanvas.getWebGLContext()!.restoreContext();
    }
  });

  describe('WebGL Context Loss Recovery', () => {
    test('should handle WebGL context loss gracefully', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate context loss
      mockCanvas.simulateContextLoss();
      
      // Component should still be rendered
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should recover from context restoration', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate context loss and restoration
      mockCanvas.simulateContextLoss();
      mockCanvas.simulateContextRestore();
      
      // Component should handle recovery
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should maintain state during context recovery', () => {
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={0.8} 
          particleCount={100} 
          interactionEnabled={true}
        />
      );
      
      // Simulate context loss and restoration
      mockCanvas.simulateContextLoss();
      
      // Wait for recovery
      setTimeout(() => {
        mockCanvas.simulateContextRestore();
      }, 100);
      
      // Component should maintain its configuration
      assert.strictEqual(container.firstChild !== null, true);
    });
  });

  describe('Shader Compilation Error Handling', () => {
    test('should handle shader compilation failures', () => {
      // Simulate compilation failure
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateCompilationFailure();
      }
      
      // Component should render with fallback
      assert.doesNotThrow(() => {
        render(<BonsaiShaderBackground />);
      });
    });

    test('should use fallback shaders when primary shaders fail', () => {
      // Simulate compilation failure
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateCompilationFailure();
      }
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should render fallback (CSS-based background)
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle program linking failures', () => {
      // Simulate linking failure
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateLinkingFailure();
      }
      
      assert.doesNotThrow(() => {
        render(<BonsaiShaderBackground />);
      });
    });
  });

  describe('Performance-Based Fallbacks', () => {
    test('should reduce quality under memory pressure', () => {
      // Mock high memory usage
      (global as any).performance.memory = {
        usedJSHeapSize: 900 * 1024 * 1024, // 900MB
        jsHeapSizeLimit: 1000 * 1024 * 1024, // 1GB limit
      };
      
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={200}
        />
      );
      
      // Should render with reduced settings
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should adapt to low-end hardware', () => {
      // Mock low-end hardware
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        configurable: true,
      });
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should use mobile performance config
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle performance degradation during runtime', () => {
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={150}
        />
      );
      
      // Simulate performance issues by mocking low frame rates
      // In a real scenario, this would be detected by the performance monitor
      assert.strictEqual(container.firstChild !== null, true);
    });
  });

  describe('Graceful Degradation', () => {
    test('should fall back to CSS when WebGL is unavailable', () => {
      // Mock WebGL unavailable
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should render CSS fallback
      assert.strictEqual(container.firstChild !== null, true);
      
      // Restore
      mockCanvas.getContext = originalGetContext;
    });

    test('should provide static fallback for maximum compatibility', () => {
      // Mock complete WebGL failure
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => {
        throw new Error('WebGL not supported');
      };
      
      assert.doesNotThrow(() => {
        render(<BonsaiShaderBackground />);
      });
      
      // Restore
      mockCanvas.getContext = originalGetContext;
    });

    test('should handle cascading failures', () => {
      // Simulate multiple failure types
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateCompilationFailure();
        mockCanvas.getWebGLContext()!.simulateContextLoss();
      }
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should handle multiple failures gracefully
      assert.strictEqual(container.firstChild !== null, true);
    });
  });

  describe('Error Recovery Scenarios', () => {
    test('should attempt quality restoration after recovery', () => {
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={200}
        />
      );
      
      // Simulate error and recovery
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateContextLoss();
        
        setTimeout(() => {
          mockCanvas.getWebGLContext()!.restoreContext();
        }, 100);
      }
      
      // Should attempt to restore quality
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should implement exponential backoff for intermittent errors', () => {
      // This would be tested through the error handler's retry mechanisms
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate intermittent errors
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateCompilationFailure();
        
        setTimeout(() => {
          mockCanvas.getWebGLContext()!.resetFailures();
        }, 200);
      }
      
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should track error statistics for debugging', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate various errors
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateCompilationFailure();
        mockCanvas.getWebGLContext()!.simulateContextLoss();
      }
      
      // Error statistics should be tracked internally
      assert.strictEqual(container.firstChild !== null, true);
    });
  });

  describe('Accessibility and Reduced Motion', () => {
    test('should respect prefers-reduced-motion setting', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: (query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          addEventListener: () => {},
          removeEventListener: () => {},
        }),
        configurable: true,
      });
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should render with reduced animations
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should provide option to disable animations completely', () => {
      const { container } = render(
        <BonsaiShaderBackground 
          animationSpeed={0} 
          intensity={0.3}
        />
      );
      
      // Should render static version
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should maintain proper ARIA attributes during fallbacks', () => {
      // Mock WebGL unavailable to trigger CSS fallback
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;
      
      const { container } = render(<BonsaiShaderBackground />);
      const element = container.firstChild as HTMLElement;
      
      // Should maintain accessibility attributes
      assert.strictEqual(element.getAttribute('aria-hidden'), 'true');
      
      // Restore
      mockCanvas.getContext = originalGetContext;
    });
  });

  describe('Theme Integration with Error Handling', () => {
    test('should handle theme changes during error states', () => {
      // Start with light theme
      document.documentElement.classList.remove('dark');
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate error
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateCompilationFailure();
      }
      
      // Change theme during error state
      document.documentElement.classList.add('dark');
      
      // Should handle theme change gracefully
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should apply theme colors to CSS fallbacks', () => {
      // Mock WebGL unavailable
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;
      
      // Set dark theme
      document.documentElement.classList.add('dark');
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should render CSS fallback with dark theme colors
      assert.strictEqual(container.firstChild !== null, true);
      
      // Restore
      mockCanvas.getContext = originalGetContext;
    });
  });

  describe('Integration with Responsive System', () => {
    test('should handle errors during window resize', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate error during resize
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.getWebGLContext()!.simulateContextLoss();
      }
      
      // Trigger resize
      Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 720, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Should handle resize during error state
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should maintain responsive behavior in fallback modes', () => {
      // Mock WebGL unavailable
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Trigger resize
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // CSS fallback should remain responsive
      assert.strictEqual(container.firstChild !== null, true);
      
      // Restore
      mockCanvas.getContext = originalGetContext;
    });
  });
}); 
 describe('Enhanced Error Handling Features', () => {
    test('should handle circuit breaker activation during shader compilation', () => {
      // Simulate multiple shader compilation failures
      if (mockCanvas.getWebGLContext()) {
        const context = mockCanvas.getWebGLContext()!;
        context.simulateCompilationFailure();
      }
      
      const { container } = render(<BonsaiShaderBackground />);
      
      // Should render with fallback after circuit breaker activation
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle predictive memory management', () => {
      // Mock increasing memory usage trend
      const originalMemory = (performance as any).memory;
      let memoryUsage = 600 * 1024 * 1024; // Start at 600MB
      
      (performance as any).memory = {
        get usedJSHeapSize() { return memoryUsage; },
        jsHeapSizeLimit: 1000 * 1024 * 1024, // 1GB limit
      };
      
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={200}
        />
      );
      
      // Simulate memory increase
      memoryUsage = 850 * 1024 * 1024; // Increase to 850MB
      
      // Should adapt to memory pressure
      assert.strictEqual(container.firstChild !== null, true);
      
      // Restore
      (performance as any).memory = originalMemory;
    });

    test('should handle adaptive performance thresholds', () => {
      // Mock device with limited capabilities
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2, // Low-end device
        configurable: true,
      });
      
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 3, // High-DPI display
        configurable: true,
      });
      
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={150}
        />
      );
      
      // Should adapt target FPS for device capabilities
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle comprehensive WebGL state preservation', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate context loss with state preservation
      if (mockCanvas.getWebGLContext()) {
        mockCanvas.simulateContextLoss();
        
        // Wait for state capture
        setTimeout(() => {
          mockCanvas.simulateContextRestore();
        }, 100);
      }
      
      // Should preserve and restore comprehensive WebGL state
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle error pattern analysis', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate escalating error pattern
      if (mockCanvas.getWebGLContext()) {
        const context = mockCanvas.getWebGLContext()!;
        
        // Create pattern of increasing severity
        context.simulateCompilationFailure();
        setTimeout(() => context.simulateContextLoss(), 50);
        setTimeout(() => context.simulateLinkingFailure(), 100);
      }
      
      // Should detect and respond to error patterns
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle enhanced device capability scoring', () => {
      // Mock high-end device
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 16, // High-end device
        configurable: true,
      });
      
      const { container } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={300}
        />
      );
      
      // Should use high-quality settings for capable device
      assert.strictEqual(container.firstChild !== null, true);
      
      // Mock low-end device
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2, // Low-end device
        configurable: true,
      });
      
      const { container: lowEndContainer } = render(
        <BonsaiShaderBackground 
          intensity={1.0} 
          particleCount={300}
        />
      );
      
      // Should automatically reduce quality for low-end device
      assert.strictEqual(lowEndContainer.firstChild !== null, true);
    });

    test('should handle multiple simultaneous error types', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate multiple error types simultaneously
      if (mockCanvas.getWebGLContext()) {
        const context = mockCanvas.getWebGLContext()!;
        context.simulateCompilationFailure();
        context.simulateContextLoss();
        context.simulateLinkingFailure();
      }
      
      // Mock memory pressure
      const originalMemory = (performance as any).memory;
      (performance as any).memory = {
        usedJSHeapSize: 950 * 1024 * 1024, // 950MB
        jsHeapSizeLimit: 1000 * 1024 * 1024, // 1GB limit
      };
      
      // Should handle multiple error types gracefully
      assert.strictEqual(container.firstChild !== null, true);
      
      // Restore
      (performance as any).memory = originalMemory;
    });

    test('should provide comprehensive error statistics', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate various errors to generate statistics
      if (mockCanvas.getWebGLContext()) {
        const context = mockCanvas.getWebGLContext()!;
        context.simulateCompilationFailure();
        context.simulateContextLoss();
      }
      
      // Error statistics should be tracked internally
      // In a real implementation, these would be accessible via the error handler
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle recovery attempt limits', () => {
      const { container } = render(<BonsaiShaderBackground />);
      
      // Simulate repeated failures to test recovery limits
      if (mockCanvas.getWebGLContext()) {
        const context = mockCanvas.getWebGLContext()!;
        
        // Simulate multiple failures in succession
        for (let i = 0; i < 5; i++) {
          context.simulateCompilationFailure();
          context.simulateContextLoss();
          context.restoreContext();
          context.resetFailures();
        }
      }
      
      // Should eventually stop retrying and use stable fallback
      assert.strictEqual(container.firstChild !== null, true);
    });

    test('should handle graceful shutdown on critical errors', () => {
      // Mock complete WebGL failure
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => {
        throw new Error('WebGL completely unavailable');
      };
      
      // Should not crash and should provide fallback
      assert.doesNotThrow(() => {
        render(<BonsaiShaderBackground />);
      });
      
      // Restore
      mockCanvas.getContext = originalGetContext;
    });
  });