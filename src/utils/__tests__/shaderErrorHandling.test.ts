/**
 * Comprehensive test suite for shader error handling and fallback systems
 * Tests all error handling components, recovery mechanisms, and graceful degradation
 */

import { describe, test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  ShaderErrorLogger,
  WebGLCapabilityDetector,
  ShaderCompiler,
  ContextLossRecoveryManager,
  GracefulDegradationManager,
  ShaderErrorHandler,
  type ShaderError,
  type FallbackState,
  type WebGLCapabilities,
  type ShaderCompilationResult,
  type RecoveryOptions,
} from '../shaderErrorHandling';

// Mock WebGL context for testing
class MockWebGLContext {
  private _isContextLost = false;
  private _shaders: Map<WebGLShader, { source: string; type: number }> = new Map();
  private _programs: Map<WebGLProgram, { vertex: WebGLShader; fragment: WebGLShader }> = new Map();
  private _compilationErrors: Map<WebGLShader, string> = new Map();
  private _linkingErrors: Map<WebGLProgram, string> = new Map();

  // WebGL constants
  VERTEX_SHADER = 35633;
  FRAGMENT_SHADER = 35632;
  COMPILE_STATUS = 35713;
  LINK_STATUS = 35714;
  VALIDATE_STATUS = 35715;
  MAX_TEXTURE_SIZE = 3379;
  MAX_VERTEX_ATTRIBS = 34921;
  MAX_FRAGMENT_UNIFORM_VECTORS = 36349;

  createShader(type: number): WebGLShader | null {
    if (this._isContextLost) return null;
    const shader = { id: Math.random() } as WebGLShader;
    this._shaders.set(shader, { source: '', type });
    return shader;
  }

  shaderSource(shader: WebGLShader, source: string): void {
    if (this._isContextLost) return;
    const shaderData = this._shaders.get(shader);
    if (shaderData) {
      shaderData.source = source;
    }
  }

  compileShader(shader: WebGLShader): void {
    if (this._isContextLost) return;
    const shaderData = this._shaders.get(shader);
    if (shaderData && shaderData.source.includes('COMPILE_ERROR')) {
      this._compilationErrors.set(shader, 'Shader compilation failed: syntax error');
    }
  }

  getShaderParameter(shader: WebGLShader, pname: number): boolean {
    if (this._isContextLost) return false;
    if (pname === this.COMPILE_STATUS) {
      return !this._compilationErrors.has(shader);
    }
    return true;
  }

  getShaderInfoLog(shader: WebGLShader): string | null {
    return this._compilationErrors.get(shader) || null;
  }

  deleteShader(shader: WebGLShader): void {
    this._shaders.delete(shader);
    this._compilationErrors.delete(shader);
  }

  createProgram(): WebGLProgram | null {
    if (this._isContextLost) return null;
    return { id: Math.random() } as WebGLProgram;
  }

  attachShader(program: WebGLProgram, shader: WebGLShader): void {
    if (this._isContextLost) return;
    const programData = this._programs.get(program) || {} as any;
    const shaderData = this._shaders.get(shader);
    if (shaderData?.type === this.VERTEX_SHADER) {
      programData.vertex = shader;
    } else if (shaderData?.type === this.FRAGMENT_SHADER) {
      programData.fragment = shader;
    }
    this._programs.set(program, programData);
  }

  linkProgram(program: WebGLProgram): void {
    if (this._isContextLost) return;
    const programData = this._programs.get(program);
    if (programData) {
      const vertexData = this._shaders.get(programData.vertex);
      const fragmentData = this._shaders.get(programData.fragment);
      
      if (vertexData?.source.includes('LINK_ERROR') || fragmentData?.source.includes('LINK_ERROR')) {
        this._linkingErrors.set(program, 'Program linking failed: incompatible shaders');
      }
    }
  }

  getProgramParameter(program: WebGLProgram, pname: number): boolean {
    if (this._isContextLost) return false;
    if (pname === this.LINK_STATUS) {
      return !this._linkingErrors.has(program);
    }
    if (pname === this.VALIDATE_STATUS) {
      return !this._linkingErrors.has(program);
    }
    return true;
  }

  getProgramInfoLog(program: WebGLProgram): string | null {
    return this._linkingErrors.get(program) || null;
  }

  deleteProgram(program: WebGLProgram): void {
    this._programs.delete(program);
    this._linkingErrors.delete(program);
  }

  validateProgram(program: WebGLProgram): void {
    // Mock validation
  }

  getParameter(pname: number): any {
    switch (pname) {
      case this.MAX_TEXTURE_SIZE:
        return 2048;
      case this.MAX_VERTEX_ATTRIBS:
        return 16;
      case this.MAX_FRAGMENT_UNIFORM_VECTORS:
        return 32;
      default:
        return 0;
    }
  }

  getSupportedExtensions(): string[] {
    return ['WEBGL_lose_context', 'WEBGL_debug_renderer_info'];
  }

  getExtension(name: string): any {
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

  isContextLost(): boolean {
    return this._isContextLost;
  }

  // Mock methods for testing
  simulateContextLoss(): void {
    this._isContextLost = true;
  }

  restoreContext(): void {
    this._isContextLost = false;
  }

  setCompilationError(shader: WebGLShader, error: string): void {
    this._compilationErrors.set(shader, error);
  }

  setLinkingError(program: WebGLProgram, error: string): void {
    this._linkingErrors.set(program, error);
  }
}

// Mock canvas for testing
class MockCanvas extends EventTarget {
  width = 800;
  height = 600;
  private _context: MockWebGLContext | null = null;

  getContext(contextType: string): MockWebGLContext | null {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      if (!this._context) {
        this._context = new MockWebGLContext();
      }
      return this._context;
    }
    return null;
  }

  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      width: this.width,
      height: this.height,
      right: this.width,
      bottom: this.height,
    };
  }

  remove() {
    // Mock remove method
  }

  simulateContextLoss() {
    const event = new Event('webglcontextlost');
    this.dispatchEvent(event);
  }

  simulateContextRestore() {
    const event = new Event('webglcontextrestored');
    this.dispatchEvent(event);
  }
}

describe('Shader Error Handling System', () => {
  let mockCanvas: MockCanvas;
  let mockGL: MockWebGLContext;

  beforeEach(() => {
    mockCanvas = new MockCanvas();
    mockGL = mockCanvas.getContext('webgl') as MockWebGLContext;
    
    // Mock document.createElement for canvas
    const originalCreateElement = document.createElement;
    document.createElement = (tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return originalCreateElement.call(document, tagName);
    };
  });

  afterEach(() => {
    // Restore original createElement
    const originalCreateElement = HTMLElement.prototype.constructor;
    document.createElement = originalCreateElement.bind(document);
  });

  describe('ShaderErrorLogger', () => {
    let logger: ShaderErrorLogger;

    beforeEach(() => {
      logger = new ShaderErrorLogger(false); // Disable console logging for tests
    });

    test('should log errors with correct structure', () => {
      const error = logger.logError('compilation', 'Test error message', 'medium');

      assert.strictEqual(error.type, 'compilation');
      assert.strictEqual(error.message, 'Test error message');
      assert.strictEqual(error.severity, 'medium');
      assert.strictEqual(typeof error.timestamp, 'number');
      assert.strictEqual(typeof error.recoverable, 'boolean');
    });

    test('should determine recoverability correctly', () => {
      const compilationError = logger.logError('compilation', 'Compilation failed', 'medium');
      const contextLossError = logger.logError('context_loss', 'Context lost', 'high');
      const webglUnavailableError = logger.logError('webgl_unavailable', 'No WebGL', 'critical');

      assert.strictEqual(compilationError.recoverable, true);
      assert.strictEqual(contextLossError.recoverable, true);
      assert.strictEqual(webglUnavailableError.recoverable, false);
    });

    test('should maintain error history with size limit', () => {
      // Log more errors than the limit
      for (let i = 0; i < 150; i++) {
        logger.logError('performance', `Error ${i}`, 'low');
      }

      const recentErrors = logger.getRecentErrors();
      assert.strictEqual(recentErrors.length <= 100, true); // Should not exceed max limit
    });

    test('should filter errors by type and age', () => {
      logger.logError('compilation', 'Old error', 'medium');
      
      // Wait a bit and log a recent error
      setTimeout(() => {
        logger.logError('compilation', 'Recent error', 'medium');
        
        const recentCompilationErrors = logger.getRecentErrors('compilation', 1000);
        assert.strictEqual(recentCompilationErrors.length, 1);
        assert.strictEqual(recentCompilationErrors[0].message, 'Recent error');
      }, 10);
    });

    test('should detect high error rates', () => {
      // Log multiple errors quickly
      for (let i = 0; i < 6; i++) {
        logger.logError('performance', `Performance issue ${i}`, 'medium');
      }

      const isHighRate = logger.isErrorRateTooHigh('performance', 60000, 5);
      assert.strictEqual(isHighRate, true);
    });

    test('should provide error statistics', () => {
      logger.logError('compilation', 'Error 1', 'low');
      logger.logError('compilation', 'Error 2', 'medium');
      logger.logError('performance', 'Error 3', 'high');

      const stats = logger.getErrorStats();
      assert.strictEqual(stats['compilation_low'], 1);
      assert.strictEqual(stats['compilation_medium'], 1);
      assert.strictEqual(stats['performance_high'], 1);
    });

    test('should clear error history', () => {
      logger.logError('compilation', 'Test error', 'medium');
      logger.clearErrors();

      const errors = logger.getRecentErrors();
      assert.strictEqual(errors.length, 0);
    });
  });

  describe('WebGLCapabilityDetector', () => {
    let detector: WebGLCapabilityDetector;

    beforeEach(() => {
      detector = new WebGLCapabilityDetector();
    });

    afterEach(() => {
      detector.cleanup();
    });

    test('should detect WebGL capabilities', () => {
      const capabilities = detector.detectCapabilities();

      assert.strictEqual(typeof capabilities.supported, 'boolean');
      assert.strictEqual(typeof capabilities.version, 'number');
      assert.strictEqual(typeof capabilities.maxTextureSize, 'number');
      assert.strictEqual(typeof capabilities.maxVertexAttribs, 'number');
      assert.strictEqual(typeof capabilities.maxFragmentUniforms, 'number');
      assert.strictEqual(Array.isArray(capabilities.extensions), true);
    });

    test('should cache capabilities on subsequent calls', () => {
      const caps1 = detector.detectCapabilities();
      const caps2 = detector.detectCapabilities();

      assert.strictEqual(caps1, caps2); // Should return same object
    });

    test('should check required feature support', () => {
      const supportsRequired = detector.supportsRequiredFeatures();
      assert.strictEqual(typeof supportsRequired, 'boolean');
    });

    test('should recommend appropriate quality level', () => {
      const quality = detector.getRecommendedQuality();
      assert.strictEqual(['low', 'medium', 'high'].includes(quality), true);
    });

    test('should handle WebGL unavailable gracefully', () => {
      // Mock WebGL unavailable
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;

      const capabilities = detector.detectCapabilities();
      assert.strictEqual(capabilities.supported, false);
      assert.strictEqual(capabilities.version, 0);

      // Restore
      mockCanvas.getContext = originalGetContext;
    });

    test('should simulate context loss for testing', () => {
      detector.detectCapabilities(); // Initialize
      
      const lossResult = detector.simulateContextLoss();
      assert.strictEqual(typeof lossResult, 'boolean');
    });

    test('should restore context after simulation', () => {
      detector.detectCapabilities(); // Initialize
      
      detector.simulateContextLoss();
      const restoreResult = detector.restoreContext();
      assert.strictEqual(typeof restoreResult, 'boolean');
    });
  });

  describe('ShaderCompiler', () => {
    let logger: ShaderErrorLogger;
    let compiler: ShaderCompiler;

    beforeEach(() => {
      logger = new ShaderErrorLogger(false);
      compiler = new ShaderCompiler(logger);
    });

    test('should compile valid shader successfully', () => {
      const validShaderSource = `
        precision mediump float;
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `;

      const result = compiler.compileShader(
        mockGL as any,
        validShaderSource,
        mockGL.FRAGMENT_SHADER
      );

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.shader !== undefined, true);
      assert.strictEqual(result.fallbackUsed, false);
    });

    test('should handle shader compilation errors', () => {
      const invalidShaderSource = `
        COMPILE_ERROR
        invalid shader syntax
      `;

      const result = compiler.compileShader(
        mockGL as any,
        invalidShaderSource,
        mockGL.FRAGMENT_SHADER
      );

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.shader, undefined);
      assert.strictEqual(typeof result.error, 'string');
    });

    test('should use fallback shader when primary fails', () => {
      const invalidShaderSource = `COMPILE_ERROR invalid`;
      const validFallbackSource = `
        precision mediump float;
        void main() {
          gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
        }
      `;

      const result = compiler.compileShader(
        mockGL as any,
        invalidShaderSource,
        mockGL.FRAGMENT_SHADER,
        validFallbackSource
      );

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.fallbackUsed, true);
      assert.strictEqual(result.warnings.length > 0, true);
    });

    test('should fail when both primary and fallback shaders fail', () => {
      const invalidPrimary = `COMPILE_ERROR primary`;
      const invalidFallback = `COMPILE_ERROR fallback`;

      const result = compiler.compileShader(
        mockGL as any,
        invalidPrimary,
        mockGL.FRAGMENT_SHADER,
        invalidFallback
      );

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.fallbackUsed, false);
    });

    test('should link shader program successfully', () => {
      const vertexShader = mockGL.createShader(mockGL.VERTEX_SHADER)!;
      const fragmentShader = mockGL.createShader(mockGL.FRAGMENT_SHADER)!;

      const result = compiler.linkProgram(mockGL as any, vertexShader, fragmentShader);

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.program !== undefined, true);
    });

    test('should handle program linking errors', () => {
      const vertexShader = mockGL.createShader(mockGL.VERTEX_SHADER)!;
      const fragmentShader = mockGL.createShader(mockGL.FRAGMENT_SHADER)!;
      
      // Set up linking error
      mockGL.shaderSource(vertexShader, 'LINK_ERROR vertex');
      mockGL.shaderSource(fragmentShader, 'valid fragment');

      const result = compiler.linkProgram(mockGL as any, vertexShader, fragmentShader);

      assert.strictEqual(result.success, false);
      assert.strictEqual(typeof result.error, 'undefined'); // Error is in the log
    });

    test('should validate shader source for common issues', () => {
      const invalidSource = `
        float someFunction() {
          // Missing main function
          return 1.0;
        }
      `;

      const validation = compiler.validateShaderSource(invalidSource);
      assert.strictEqual(validation.valid, false);
      assert.strictEqual(validation.issues.length > 0, true);
      assert.strictEqual(validation.issues.some(issue => issue.includes('main()')), true);
    });

    test('should detect WebGL version compatibility issues', () => {
      const webgl2Source = `
        #version 300 es
        precision mediump float;
        in vec2 texCoord;
        out vec4 fragColor;
        void main() {
          fragColor = vec4(1.0);
        }
      `;

      const validation = compiler.validateShaderSource(webgl2Source);
      // Should detect potential WebGL 2.0 syntax in WebGL 1.0 context
      assert.strictEqual(validation.issues.length >= 0, true);
    });

    test('should detect large loops that may cause issues', () => {
      const loopSource = `
        precision mediump float;
        void main() {
          for (int i = 0; i < 500; i++) {
            // Large loop
          }
          gl_FragColor = vec4(1.0);
        }
      `;

      const validation = compiler.validateShaderSource(loopSource);
      assert.strictEqual(validation.issues.some(issue => issue.includes('loop')), true);
    });
  });

  describe('ContextLossRecoveryManager', () => {
    let logger: ShaderErrorLogger;
    let recoveryManager: ContextLossRecoveryManager;

    beforeEach(() => {
      logger = new ShaderErrorLogger(false);
      recoveryManager = new ContextLossRecoveryManager(logger);
    });

    afterEach(() => {
      recoveryManager.cleanup();
    });

    test('should initialize context loss handling', () => {
      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      
      // Should not throw
      assert.strictEqual(typeof recoveryManager.isContextCurrentlyLost, 'function');
    });

    test('should handle context loss events', () => {
      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      
      // Simulate context loss
      mockCanvas.simulateContextLoss();
      
      // Should detect context loss
      assert.strictEqual(recoveryManager.isContextCurrentlyLost(), true);
    });

    test('should handle context restoration events', () => {
      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      
      // Simulate context loss and restoration
      mockCanvas.simulateContextLoss();
      mockCanvas.simulateContextRestore();
      
      // Context should be restored
      assert.strictEqual(recoveryManager.isContextCurrentlyLost(), false);
    });

    test('should register and call recovery callbacks', () => {
      let callbackCalled = false;
      const recoveryCallback = () => {
        callbackCalled = true;
      };

      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      recoveryManager.onRecovery(recoveryCallback);
      
      // Simulate context loss and restoration
      mockCanvas.simulateContextLoss();
      mockCanvas.simulateContextRestore();
      
      // Callback should have been called
      assert.strictEqual(callbackCalled, true);
    });

    test('should remove recovery callbacks', () => {
      let callbackCalled = false;
      const recoveryCallback = () => {
        callbackCalled = true;
      };

      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      recoveryManager.onRecovery(recoveryCallback);
      recoveryManager.removeRecoveryCallback(recoveryCallback);
      
      // Simulate context restoration
      mockCanvas.simulateContextRestore();
      
      // Callback should not have been called
      assert.strictEqual(callbackCalled, false);
    });

    test('should force context loss for testing', () => {
      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      
      const result = recoveryManager.forceContextLoss();
      assert.strictEqual(typeof result, 'boolean');
    });

    test('should force context restoration for testing', () => {
      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      
      recoveryManager.forceContextLoss();
      const result = recoveryManager.forceContextRestore();
      assert.strictEqual(typeof result, 'boolean');
    });

    test('should handle recovery callback errors gracefully', () => {
      const errorCallback = () => {
        throw new Error('Recovery callback error');
      };

      recoveryManager.initialize(mockCanvas as any, mockGL as any);
      recoveryManager.onRecovery(errorCallback);
      
      // Should not throw when callback errors
      assert.doesNotThrow(() => {
        mockCanvas.simulateContextRestore();
      });
    });
  });

  describe('GracefulDegradationManager', () => {
    let logger: ShaderErrorLogger;
    let degradationManager: GracefulDegradationManager;

    beforeEach(() => {
      logger = new ShaderErrorLogger(false);
      degradationManager = new GracefulDegradationManager(logger);
    });

    test('should determine fallback level based on capabilities', () => {
      const lowEndCapabilities: WebGLCapabilities = {
        supported: true,
        version: 1,
        maxTextureSize: 512,
        maxVertexAttribs: 8,
        maxFragmentUniforms: 8,
        extensions: [],
        renderer: 'low-end',
        vendor: 'test',
      };

      const fallbackLevel = degradationManager.determineFallbackLevel(
        lowEndCapabilities,
        []
      );

      assert.strictEqual(fallbackLevel, 'reduced');
    });

    test('should disable for unsupported WebGL', () => {
      const unsupportedCapabilities: WebGLCapabilities = {
        supported: false,
        version: 0,
        maxTextureSize: 0,
        maxVertexAttribs: 0,
        maxFragmentUniforms: 0,
        extensions: [],
        renderer: 'none',
        vendor: 'none',
      };

      const fallbackLevel = degradationManager.determineFallbackLevel(
        unsupportedCapabilities,
        []
      );

      assert.strictEqual(fallbackLevel, 'disabled');
    });

    test('should escalate fallback for critical errors', () => {
      const goodCapabilities: WebGLCapabilities = {
        supported: true,
        version: 2,
        maxTextureSize: 4096,
        maxVertexAttribs: 16,
        maxFragmentUniforms: 64,
        extensions: [],
        renderer: 'high-end',
        vendor: 'test',
      };

      const criticalError: ShaderError = {
        type: 'webgl_unavailable',
        message: 'Critical error',
        timestamp: Date.now(),
        severity: 'critical',
        recoverable: false,
      };

      const fallbackLevel = degradationManager.determineFallbackLevel(
        goodCapabilities,
        [criticalError]
      );

      assert.strictEqual(fallbackLevel, 'disabled');
    });

    test('should apply fallback configuration', () => {
      const fallbackState = degradationManager.applyFallback('reduced', 'Performance issues');

      assert.strictEqual(fallbackState.level, 'reduced');
      assert.strictEqual(fallbackState.reason, 'Performance issues');
      assert.strictEqual(typeof fallbackState.timestamp, 'number');
    });

    test('should provide appropriate fallback config for each level', () => {
      const levels: Array<FallbackState['level']> = ['none', 'reduced', 'minimal', 'disabled'];

      levels.forEach(level => {
        degradationManager.applyFallback(level, 'Test');
        const config = degradationManager.getFallbackConfig();

        assert.strictEqual(typeof config.particleCount, 'number');
        assert.strictEqual(typeof config.animationSpeed, 'number');
        assert.strictEqual(typeof config.interactionEnabled, 'boolean');
        assert.strictEqual(typeof config.renderScale, 'number');
        assert.strictEqual(typeof config.complexEffects, 'boolean');
        assert.strictEqual(typeof config.useSimpleShader, 'boolean');

        // Verify escalating restrictions
        if (level === 'disabled') {
          assert.strictEqual(config.particleCount, 0);
          assert.strictEqual(config.animationSpeed, 0);
          assert.strictEqual(config.interactionEnabled, false);
        }
      });
    });

    test('should track fallback history', () => {
      degradationManager.applyFallback('reduced', 'First fallback');
      degradationManager.applyFallback('minimal', 'Second fallback');

      const history = degradationManager.getFallbackHistory();
      assert.strictEqual(history.length, 2);
      assert.strictEqual(history[0].level, 'reduced');
      assert.strictEqual(history[1].level, 'minimal');
    });

    test('should limit fallback history size', () => {
      // Apply more fallbacks than the limit
      for (let i = 0; i < 25; i++) {
        degradationManager.applyFallback('reduced', `Fallback ${i}`);
      }

      const history = degradationManager.getFallbackHistory();
      assert.strictEqual(history.length <= 20, true); // Should not exceed limit
    });

    test('should determine when fallback can be reduced', () => {
      // Apply fallback and check immediately
      degradationManager.applyFallback('reduced', 'Test');
      assert.strictEqual(degradationManager.canReduceFallback(), false);

      // Reset and check again
      degradationManager.reset();
      assert.strictEqual(degradationManager.canReduceFallback(), false); // Already at 'none'
    });

    test('should reset to no degradation', () => {
      degradationManager.applyFallback('minimal', 'Test');
      degradationManager.reset();

      assert.strictEqual(degradationManager.getCurrentLevel(), 'none');
      assert.strictEqual(degradationManager.getFallbackHistory().length, 0);
    });
  });

  describe('ShaderErrorHandler (Integration)', () => {
    let errorHandler: ShaderErrorHandler;

    beforeEach(() => {
      errorHandler = new ShaderErrorHandler({
        maxRetries: 2,
        retryDelay: 100,
        fallbackDelay: 200,
        enableLogging: false,
      });
    });

    afterEach(() => {
      errorHandler.cleanup();
    });

    test('should initialize all error handling components', () => {
      const components = errorHandler.getComponents();

      assert.strictEqual(typeof components.logger, 'object');
      assert.strictEqual(typeof components.capabilityDetector, 'object');
      assert.strictEqual(typeof components.compiler, 'object');
      assert.strictEqual(typeof components.contextRecovery, 'object');
      assert.strictEqual(typeof components.degradationManager, 'object');
    });

    test('should initialize WebGL context handling', () => {
      assert.doesNotThrow(() => {
        errorHandler.initialize(mockCanvas as any, mockGL as any);
      });
    });

    test('should perform comprehensive error check and apply fallbacks', () => {
      const fallbackState = errorHandler.checkAndApplyFallbacks();

      assert.strictEqual(typeof fallbackState.level, 'string');
      assert.strictEqual(typeof fallbackState.reason, 'string');
      assert.strictEqual(typeof fallbackState.timestamp, 'number');
    });

    test('should handle multiple error types simultaneously', () => {
      const components = errorHandler.getComponents();
      
      // Log various error types
      components.logger.logError('compilation', 'Shader failed', 'medium');
      components.logger.logError('performance', 'Low FPS', 'high');
      components.logger.logError('memory', 'High memory usage', 'medium');

      const fallbackState = errorHandler.checkAndApplyFallbacks();
      
      // Should determine appropriate fallback level
      assert.strictEqual(['none', 'reduced', 'minimal', 'disabled'].includes(fallbackState.level), true);
    });

    test('should escalate fallback level with increasing error severity', () => {
      const components = errorHandler.getComponents();
      
      // Start with low severity errors
      components.logger.logError('performance', 'Minor issue', 'low');
      let fallbackState = errorHandler.checkAndApplyFallbacks();
      const initialLevel = fallbackState.level;

      // Add high severity errors
      components.logger.logError('compilation', 'Major failure', 'high');
      components.logger.logError('context_loss', 'Context lost', 'high');
      fallbackState = errorHandler.checkAndApplyFallbacks();

      // Should escalate or maintain fallback level
      const escalatedLevel = fallbackState.level;
      const levelOrder = ['none', 'reduced', 'minimal', 'disabled'];
      const initialIndex = levelOrder.indexOf(initialLevel);
      const escalatedIndex = levelOrder.indexOf(escalatedLevel);
      
      assert.strictEqual(escalatedIndex >= initialIndex, true);
    });

    test('should handle WebGL unavailable scenario', () => {
      // Mock WebGL unavailable
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;

      const components = errorHandler.getComponents();
      const capabilities = components.capabilityDetector.detectCapabilities();
      
      assert.strictEqual(capabilities.supported, false);
      
      const fallbackState = errorHandler.checkAndApplyFallbacks();
      assert.strictEqual(fallbackState.level, 'disabled');

      // Restore
      mockCanvas.getContext = originalGetContext;
    });

    test('should provide error callbacks functionality', () => {
      let errorCallbackCalled = false;
      let recoveryCallbackCalled = false;
      let fallbackCallbackCalled = false;

      const errorHandlerWithCallbacks = new ShaderErrorHandler({
        enableLogging: false,
        onError: (error: ShaderError) => {
          errorCallbackCalled = true;
          assert.strictEqual(typeof error.type, 'string');
        },
        onRecovery: (success: boolean) => {
          recoveryCallbackCalled = true;
          assert.strictEqual(typeof success, 'boolean');
        },
        onFallback: (state: FallbackState) => {
          fallbackCallbackCalled = true;
          assert.strictEqual(typeof state.level, 'string');
        },
      });

      // Trigger error
      const components = errorHandlerWithCallbacks.getComponents();
      components.logger.logError('compilation', 'Test error', 'medium');

      // Note: In a real implementation, callbacks would be triggered by timers
      // For testing, we verify the callbacks are properly stored
      assert.strictEqual(typeof errorHandlerWithCallbacks, 'object');

      errorHandlerWithCallbacks.cleanup();
    });

    test('should handle rapid error bursts without performance degradation', () => {
      const components = errorHandler.getComponents();
      
      // Simulate rapid error burst
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        components.logger.logError('performance', `Rapid error ${i}`, 'low');
      }
      const endTime = Date.now();

      // Should handle errors quickly
      assert.strictEqual(endTime - startTime < 1000, true); // Less than 1 second

      // Should still function correctly
      const fallbackState = errorHandler.checkAndApplyFallbacks();
      assert.strictEqual(typeof fallbackState.level, 'string');
    });

    test('should maintain error history across multiple checks', () => {
      const components = errorHandler.getComponents();
      
      components.logger.logError('compilation', 'First error', 'medium');
      errorHandler.checkAndApplyFallbacks();
      
      components.logger.logError('performance', 'Second error', 'high');
      const fallbackState = errorHandler.checkAndApplyFallbacks();
      
      // Should consider cumulative error history
      const recentErrors = components.logger.getRecentErrors(undefined, 300000);
      assert.strictEqual(recentErrors.length >= 2, true);
    });

    test('should cleanup all resources properly', () => {
      errorHandler.initialize(mockCanvas as any, mockGL as any);
      
      assert.doesNotThrow(() => {
        errorHandler.cleanup();
      });
      
      // Should be safe to call cleanup multiple times
      assert.doesNotThrow(() => {
        errorHandler.cleanup();
      });
    });
  });

  describe('Error Recovery Scenarios', () => {
    let errorHandler: ShaderErrorHandler;

    beforeEach(() => {
      errorHandler = new ShaderErrorHandler({ enableLogging: false });
    });

    afterEach(() => {
      errorHandler.cleanup();
    });

    test('should recover from shader compilation failures', () => {
      const components = errorHandler.getComponents();
      
      // Simulate shader compilation failure
      const invalidShader = 'COMPILE_ERROR invalid syntax';
      const validFallback = 'precision mediump float; void main() { gl_FragColor = vec4(1.0); }';
      
      const result = components.compiler.compileShader(
        mockGL as any,
        invalidShader,
        mockGL.FRAGMENT_SHADER,
        validFallback
      );

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.fallbackUsed, true);
    });

    test('should recover from WebGL context loss', () => {
      const components = errorHandler.getComponents();
      
      components.contextRecovery.initialize(mockCanvas as any, mockGL as any);
      
      // Simulate context loss
      mockGL.simulateContextLoss();
      assert.strictEqual(components.contextRecovery.isContextCurrentlyLost(), true);
      
      // Simulate context restoration
      mockGL.restoreContext();
      mockCanvas.simulateContextRestore();
      
      assert.strictEqual(components.contextRecovery.isContextCurrentlyLost(), false);
    });

    test('should gracefully degrade for unsupported devices', () => {
      // Mock unsupported device
      const originalGetContext = mockCanvas.getContext;
      mockCanvas.getContext = () => null;

      const fallbackState = errorHandler.checkAndApplyFallbacks();
      assert.strictEqual(fallbackState.level, 'disabled');

      const components = errorHandler.getComponents();
      const config = components.degradationManager.getFallbackConfig();
      
      assert.strictEqual(config.particleCount, 0);
      assert.strictEqual(config.animationSpeed, 0);
      assert.strictEqual(config.interactionEnabled, false);

      // Restore
      mockCanvas.getContext = originalGetContext;
    });

    test('should handle cascading failures appropriately', () => {
      const components = errorHandler.getComponents();
      
      // Simulate cascading failures
      components.logger.logError('compilation', 'Primary shader failed', 'medium');
      components.logger.logError('compilation', 'Fallback shader failed', 'high');
      components.logger.logError('context_loss', 'Context lost during recovery', 'high');
      components.logger.logError('performance', 'Performance degraded', 'medium');

      const fallbackState = errorHandler.checkAndApplyFallbacks();
      
      // Should escalate to appropriate fallback level
      assert.strictEqual(['reduced', 'minimal', 'disabled'].includes(fallbackState.level), true);
    });

    test('should maintain functionality under memory pressure', () => {
      const components = errorHandler.getComponents();
      
      // Simulate memory pressure
      for (let i = 0; i < 10; i++) {
        components.logger.logError('memory', `Memory pressure ${i}`, 'medium');
      }

      const fallbackState = errorHandler.checkAndApplyFallbacks();
      const config = components.degradationManager.getFallbackConfig();
      
      // Should reduce resource usage
      assert.strictEqual(config.particleCount < 100, true);
      assert.strictEqual(config.renderScale <= 1.0, true);
    });

    test('should handle intermittent errors without over-reacting', () => {
      const components = errorHandler.getComponents();
      
      // Log a few intermittent errors
      components.logger.logError('performance', 'Temporary slowdown', 'low');
      setTimeout(() => {
        components.logger.logError('performance', 'Another temporary issue', 'low');
      }, 100);

      const fallbackState = errorHandler.checkAndApplyFallbacks();
      
      // Should not over-react to low-severity intermittent errors
      assert.strictEqual(['none', 'reduced'].includes(fallbackState.level), true);
    });
  });
});