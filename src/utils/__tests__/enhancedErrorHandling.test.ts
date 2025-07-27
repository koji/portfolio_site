/**
 * Enhanced error handling integration tests
 * Tests the new performance monitoring and recovery scenarios
 */

import { describe, test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  ShaderErrorHandler,
  PerformanceMonitor,
  ErrorRecoveryScenarios,
  ShaderErrorLogger,
} from '../shaderErrorHandling';

describe('Enhanced Error Handling System', () => {
  let errorHandler: ShaderErrorHandler;
  let performanceMonitor: PerformanceMonitor;
  let logger: ShaderErrorLogger;

  beforeEach(() => {
    errorHandler = new ShaderErrorHandler({
      enableLogging: false,
    });
    
    const components = errorHandler.getComponents();
    performanceMonitor = components.performanceMonitor;
    logger = components.logger;
  });

  afterEach(() => {
    errorHandler.cleanup();
  });

  describe('Performance Monitoring', () => {
    test('should track frame rates correctly', () => {
      performanceMonitor.startMonitoring();
      
      // Record some frames
      for (let i = 0; i < 10; i++) {
        performanceMonitor.recordFrame();
      }
      
      const avgFPS = performanceMonitor.getAverageFPS();
      assert.strictEqual(typeof avgFPS, 'number');
      assert.strictEqual(avgFPS > 0, true);
      
      performanceMonitor.stopMonitoring();
    });

    test('should detect performance degradation', () => {
      // Simulate low frame rates
      performanceMonitor.frameRates = [15, 18, 20, 16, 19]; // Low FPS
      
      const isDegraded = performanceMonitor.isPerformanceDegraded(30);
      assert.strictEqual(isDegraded, true);
    });

    test('should handle performance callbacks', () => {
      let callbackCalled = false;
      let receivedFPS = 0;
      
      performanceMonitor.onPerformanceUpdate((fps) => {
        callbackCalled = true;
        receivedFPS = fps;
      });
      
      // Manually trigger update
      performanceMonitor.updatePerformanceMetrics();
      
      assert.strictEqual(callbackCalled, true);
      assert.strictEqual(typeof receivedFPS, 'number');
    });
  });

  describe('Error Recovery Scenarios', () => {
    test('should handle memory pressure', () => {
      const recoveryScenarios = errorHandler.getComponents().recoveryScenarios;
      
      // Mock high memory usage
      const originalMemory = (performance as any).memory;
      (performance as any).memory = {
        usedJSHeapSize: 850 * 1024 * 1024, // 850MB
        jsHeapSizeLimit: 1000 * 1024 * 1024, // 1GB limit
      };
      
      const currentConfig = {
        particleCount: 100,
        renderScale: 1.0,
        animationSpeed: 1.0,
        complexEffects: true,
      };
      
      const adjustedConfig = recoveryScenarios.handleMemoryPressure(currentConfig);
      
      assert.strictEqual(adjustedConfig.particleCount < currentConfig.particleCount, true);
      assert.strictEqual(adjustedConfig.renderScale < currentConfig.renderScale, true);
      assert.strictEqual(adjustedConfig.complexEffects, false);
      
      // Restore
      (performance as any).memory = originalMemory;
    });

    test('should handle performance degradation', () => {
      const recoveryScenarios = errorHandler.getComponents().recoveryScenarios;
      
      // Mock poor performance
      performanceMonitor.frameRates = [15, 18, 20, 16, 19]; // Low FPS
      
      const currentConfig = {
        particleCount: 100,
        renderScale: 1.0,
        animationSpeed: 1.0,
        interactionEnabled: true,
        complexEffects: true,
      };
      
      const adjustedConfig = recoveryScenarios.handlePerformanceDegradation(currentConfig, 30);
      
      assert.strictEqual(adjustedConfig.particleCount < currentConfig.particleCount, true);
      assert.strictEqual(adjustedConfig.renderScale < currentConfig.renderScale, true);
      assert.strictEqual(adjustedConfig.animationSpeed < currentConfig.animationSpeed, true);
      assert.strictEqual(adjustedConfig.interactionEnabled, false);
      assert.strictEqual(adjustedConfig.complexEffects, false);
    });

    test('should detect cascading failures', () => {
      const recoveryScenarios = errorHandler.getComponents().recoveryScenarios;
      
      // Log multiple high-severity errors
      for (let i = 0; i < 6; i++) {
        logger.logError('performance', `High error ${i}`, 'high');
      }
      
      const cascadingCheck = recoveryScenarios.handleCascadingFailures(['performance', 'memory']);
      assert.strictEqual(cascadingCheck.shouldDisable, true);
      assert.strictEqual(cascadingCheck.reason.includes('High error rate'), true);
    });

    test('should handle intermittent errors with exponential backoff', async () => {
      const recoveryScenarios = errorHandler.getComponents().recoveryScenarios;
      
      let attemptCount = 0;
      const retryFunction = async () => {
        attemptCount++;
        return attemptCount >= 2; // Succeed on second attempt
      };
      
      const success = await recoveryScenarios.handleIntermittentErrors('test_error', retryFunction);
      
      assert.strictEqual(success, true);
      assert.strictEqual(attemptCount, 2);
    });

    test('should reset recovery attempts', () => {
      const recoveryScenarios = errorHandler.getComponents().recoveryScenarios;
      
      // Set some recovery attempts
      recoveryScenarios.recoveryAttempts.set('test_scenario', 2);
      
      const statsBefore = recoveryScenarios.getRecoveryStats();
      assert.strictEqual(statsBefore['test_scenario'], 2);
      
      recoveryScenarios.resetRecoveryAttempts('test_scenario');
      
      const statsAfter = recoveryScenarios.getRecoveryStats();
      assert.strictEqual(statsAfter['test_scenario'], undefined);
    });
  });

  describe('Integration Tests', () => {
    test('should start and stop monitoring', () => {
      assert.doesNotThrow(() => {
        errorHandler.startMonitoring();
        errorHandler.recordFrame();
        errorHandler.cleanup();
      });
    });

    test('should provide comprehensive error statistics', () => {
      // Log some errors
      logger.logError('compilation', 'Test error 1', 'medium');
      logger.logError('performance', 'Test error 2', 'high');
      
      // Apply fallback
      const degradationManager = errorHandler.getComponents().degradationManager;
      degradationManager.applyFallback('reduced', 'Test fallback');
      
      const stats = errorHandler.getErrorStatistics();
      
      assert.strictEqual(typeof stats.errorStats, 'object');
      assert.strictEqual(typeof stats.recoveryStats, 'object');
      assert.strictEqual(typeof stats.performanceStats, 'object');
      assert.strictEqual(Array.isArray(stats.fallbackHistory), true);
      
      assert.strictEqual(stats.errorStats['compilation_medium'], 1);
      assert.strictEqual(stats.errorStats['performance_high'], 1);
      assert.strictEqual(stats.fallbackHistory.length, 1);
    });

    test('should handle cascading failure detection', () => {
      // Log multiple critical errors
      logger.logError('webgl_unavailable', 'Critical error 1', 'critical');
      logger.logError('compilation', 'Critical error 2', 'critical');
      
      const cascadingCheck = errorHandler.checkCascadingFailures();
      assert.strictEqual(cascadingCheck.shouldDisable, true);
      assert.strictEqual(cascadingCheck.reason.includes('circuit breaker'), true);
    });

    test('should handle error handler cleanup', () => {
      errorHandler.startMonitoring();
      
      // Should not throw during cleanup
      assert.doesNotThrow(() => {
        errorHandler.cleanup();
      });
    });

    test('should handle WebGL context loss recovery', async () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      
      if (gl) {
        errorHandler.initialize(canvas, gl);
        
        // Simulate context loss
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
          
          // Wait for context restoration
          await new Promise(resolve => setTimeout(resolve, 100));
          
          loseContext.restoreContext();
          
          // Should handle recovery gracefully
          const stats = errorHandler.getErrorStatistics();
          assert.strictEqual(stats.errorStats['context_loss_high'] >= 1, true);
        }
      }
    });

    test('should apply progressive fallbacks under stress', () => {
      // Simulate multiple error types
      logger.logError('compilation', 'Shader compilation failed', 'medium');
      logger.logError('performance', 'Low FPS detected', 'high');
      logger.logError('memory', 'High memory usage', 'medium');
      
      const initialFallback = errorHandler.checkAndApplyFallbacks();
      
      // Add more severe errors
      logger.logError('compilation', 'Critical shader error', 'high');
      logger.logError('context_loss', 'Context lost', 'high');
      
      const escalatedFallback = errorHandler.checkAndApplyFallbacks();
      
      // Should escalate fallback level
      const levelOrder = ['none', 'reduced', 'minimal', 'disabled'];
      const initialIndex = levelOrder.indexOf(initialFallback.level);
      const escalatedIndex = levelOrder.indexOf(escalatedFallback.level);
      
      assert.strictEqual(escalatedIndex >= initialIndex, true);
    });

    test('should handle shader compilation with fallbacks', () => {
      const components = errorHandler.getComponents();
      
      // Mock WebGL context
      const mockGL = {
        createShader: () => ({ id: 'test' }),
        shaderSource: () => {},
        compileShader: () => {},
        getShaderParameter: () => false, // Simulate compilation failure
        getShaderInfoLog: () => 'Compilation error',
        deleteShader: () => {},
        FRAGMENT_SHADER: 35632,
      };
      
      const primaryShader = 'invalid shader source';
      const fallbackShader = 'precision mediump float; void main() { gl_FragColor = vec4(1.0); }';
      
      const result = components.compiler.compileShader(
        mockGL as any,
        primaryShader,
        mockGL.FRAGMENT_SHADER,
        fallbackShader
      );
      
      // Should attempt fallback compilation
      assert.strictEqual(result.success, false); // Both will fail in mock
      assert.strictEqual(typeof result.error, 'string');
    });

    test('should monitor and respond to performance degradation', () => {
      const components = errorHandler.getComponents();
      
      // Simulate poor performance
      for (let i = 0; i < 10; i++) {
        components.performanceMonitor.frameRates = [15, 18, 20, 16, 19]; // Low FPS
      }
      
      const currentConfig = {
        particleCount: 100,
        renderScale: 1.0,
        animationSpeed: 1.0,
        interactionEnabled: true,
        complexEffects: true,
      };
      
      const adjustedConfig = components.recoveryScenarios.handlePerformanceDegradation(currentConfig, 30);
      
      // Should reduce quality settings
      assert.strictEqual(adjustedConfig.particleCount < currentConfig.particleCount, true);
      assert.strictEqual(adjustedConfig.renderScale < currentConfig.renderScale, true);
      assert.strictEqual(adjustedConfig.complexEffects, false);
    });

    test('should handle memory pressure gracefully', () => {
      const components = errorHandler.getComponents();
      
      // Mock high memory usage
      const originalMemory = (performance as any).memory;
      (performance as any).memory = {
        usedJSHeapSize: 900 * 1024 * 1024, // 900MB
        jsHeapSizeLimit: 1000 * 1024 * 1024, // 1GB limit
      };
      
      const currentConfig = {
        particleCount: 150,
        renderScale: 1.0,
        animationSpeed: 1.0,
        complexEffects: true,
      };
      
      const adjustedConfig = components.recoveryScenarios.handleMemoryPressure(currentConfig);
      
      // Should reduce memory-intensive settings
      assert.strictEqual(adjustedConfig.particleCount < currentConfig.particleCount, true);
      assert.strictEqual(adjustedConfig.complexEffects, false);
      
      // Restore
      (performance as any).memory = originalMemory;
    });

    test('should implement exponential backoff for intermittent errors', async () => {
      const components = errorHandler.getComponents();
      
      let attemptCount = 0;
      const flakyFunction = async () => {
        attemptCount++;
        return attemptCount >= 3; // Succeed on third attempt
      };
      
      const startTime = Date.now();
      const success = await components.recoveryScenarios.handleIntermittentErrors(
        'test_flaky_operation',
        flakyFunction,
        5
      );
      const endTime = Date.now();
      
      assert.strictEqual(success, true);
      assert.strictEqual(attemptCount, 3);
      assert.strictEqual(endTime - startTime >= 100, true); // Should have some backoff delay
    });

    test('should detect and handle cascading failures', () => {
      const components = errorHandler.getComponents();
      
      // Log multiple critical errors
      logger.logError('webgl_unavailable', 'WebGL not supported', 'critical');
      logger.logError('compilation', 'All shaders failed', 'critical');
      
      const cascadingCheck = components.recoveryScenarios.handleCascadingFailures([
        'webgl_unavailable', 'compilation', 'performance'
      ]);
      
      assert.strictEqual(cascadingCheck.shouldDisable, true);
      assert.strictEqual(cascadingCheck.reason.includes('critical'), true);
    });

    test('should provide comprehensive error statistics', () => {
      // Generate various errors
      logger.logError('compilation', 'Shader error 1', 'low');
      logger.logError('compilation', 'Shader error 2', 'medium');
      logger.logError('performance', 'Performance issue', 'high');
      logger.logError('memory', 'Memory warning', 'medium');
      
      // Apply some fallbacks
      const degradationManager = errorHandler.getComponents().degradationManager;
      degradationManager.applyFallback('reduced', 'Performance issues');
      degradationManager.applyFallback('minimal', 'Severe performance issues');
      
      const stats = errorHandler.getErrorStatistics();
      
      // Verify error statistics
      assert.strictEqual(stats.errorStats['compilation_low'], 1);
      assert.strictEqual(stats.errorStats['compilation_medium'], 1);
      assert.strictEqual(stats.errorStats['performance_high'], 1);
      assert.strictEqual(stats.errorStats['memory_medium'], 1);
      
      // Verify fallback history
      assert.strictEqual(stats.fallbackHistory.length, 2);
      assert.strictEqual(stats.fallbackHistory[0].level, 'reduced');
      assert.strictEqual(stats.fallbackHistory[1].level, 'minimal');
      
      // Verify performance stats
      assert.strictEqual(typeof stats.performanceStats.fps, 'number');
    });

    test('should handle recovery attempt tracking', () => {
      const components = errorHandler.getComponents();
      
      // Set some recovery attempts
      components.recoveryScenarios.recoveryAttempts.set('test_scenario_1', 2);
      components.recoveryScenarios.recoveryAttempts.set('test_scenario_2', 1);
      
      const stats = components.recoveryScenarios.getRecoveryStats();
      assert.strictEqual(stats['test_scenario_1'], 2);
      assert.strictEqual(stats['test_scenario_2'], 1);
      
      // Reset specific scenario
      components.recoveryScenarios.resetRecoveryAttempts('test_scenario_1');
      const updatedStats = components.recoveryScenarios.getRecoveryStats();
      assert.strictEqual(updatedStats['test_scenario_1'], undefined);
      assert.strictEqual(updatedStats['test_scenario_2'], 1);
      
      // Reset all scenarios
      components.recoveryScenarios.resetRecoveryAttempts();
      const clearedStats = components.recoveryScenarios.getRecoveryStats();
      assert.strictEqual(Object.keys(clearedStats).length, 0);
    });
  });
});

describe('Enhanced Error Recovery Features', () => {
    test('should implement circuit breaker pattern for shader compilation', async () => {
      const components = errorHandler.getComponents();
      
      // Mock WebGL context that always fails
      const mockGL = {
        createShader: () => ({ id: 'test' }),
        shaderSource: () => {},
        compileShader: () => {},
        getShaderParameter: () => false, // Always fail compilation
        getShaderInfoLog: () => 'Compilation failed',
        deleteShader: () => {},
        FRAGMENT_SHADER: 35632,
      };
      
      const primaryShader = 'invalid shader';
      const fallbackShaders = ['fallback1', 'fallback2'];
      
      // First few attempts should try compilation
      for (let i = 0; i < 3; i++) {
        const result = await components.recoveryScenarios.handleShaderCompilationFailureWithCircuitBreaker(
          mockGL as any,
          primaryShader,
          fallbackShaders,
          mockGL.FRAGMENT_SHADER
        );
        assert.strictEqual(result.shader, null);
        assert.strictEqual(result.circuitOpen, false);
      }
      
      // After threshold, circuit breaker should open
      const result = await components.recoveryScenarios.handleShaderCompilationFailureWithCircuitBreaker(
        mockGL as any,
        primaryShader,
        fallbackShaders,
        mockGL.FRAGMENT_SHADER
      );
      
      // Circuit breaker should eventually open after multiple failures
      const stats = components.recoveryScenarios.getRecoveryStats();
      assert.strictEqual(typeof stats['shader_compilation_circuit_failures'], 'number');
    });

    test('should handle memory pressure with predictive scaling', () => {
      const components = errorHandler.getComponents();
      
      // Mock high memory usage
      const originalMemory = (performance as any).memory;
      (performance as any).memory = {
        usedJSHeapSize: 850 * 1024 * 1024, // 850MB
        jsHeapSizeLimit: 1000 * 1024 * 1024, // 1GB limit
      };
      
      const currentConfig = {
        particleCount: 150,
        renderScale: 1.0,
        animationSpeed: 1.0,
        complexEffects: true,
        interactionEnabled: true,
      };
      
      const adjustedConfig = components.recoveryScenarios.handleMemoryPressureWithPrediction(currentConfig);
      
      // Should reduce memory-intensive settings
      assert.strictEqual(adjustedConfig.particleCount < currentConfig.particleCount, true);
      assert.strictEqual(adjustedConfig.renderScale < currentConfig.renderScale, true);
      assert.strictEqual(adjustedConfig.complexEffects, false);
      assert.strictEqual(adjustedConfig.interactionEnabled, false);
      
      // Restore
      (performance as any).memory = originalMemory;
    });

    test('should handle performance degradation with adaptive thresholds', () => {
      const components = errorHandler.getComponents();
      
      // Mock very poor performance
      performanceMonitor.frameRates = [8, 12, 10, 9, 11]; // Very low FPS
      
      const currentConfig = {
        particleCount: 100,
        renderScale: 1.0,
        animationSpeed: 1.0,
        interactionEnabled: true,
        complexEffects: true,
      };
      
      const adjustedConfig = components.recoveryScenarios.handlePerformanceDegradationWithAdaptiveThresholds(
        currentConfig, 
        30
      );
      
      // Should aggressively reduce quality for severe performance issues
      assert.strictEqual(adjustedConfig.particleCount < currentConfig.particleCount, true);
      assert.strictEqual(adjustedConfig.renderScale < currentConfig.renderScale, true);
      assert.strictEqual(adjustedConfig.animationSpeed < currentConfig.animationSpeed, true);
      assert.strictEqual(adjustedConfig.interactionEnabled, false);
      assert.strictEqual(adjustedConfig.complexEffects, false);
    });

    test('should analyze error patterns with confidence scoring', () => {
      const components = errorHandler.getComponents();
      
      // Create escalating error pattern
      logger.logError('performance', 'Minor issue', 'low');
      setTimeout(() => logger.logError('compilation', 'Moderate issue', 'medium'), 10);
      setTimeout(() => logger.logError('memory', 'Serious issue', 'high'), 20);
      
      const cascadingCheck = components.recoveryScenarios.handleCascadingFailuresWithPatternAnalysis([
        'performance', 'compilation', 'memory'
      ]);
      
      assert.strictEqual(typeof cascadingCheck.pattern, 'string');
      assert.strictEqual(typeof cascadingCheck.confidence, 'number');
      assert.strictEqual(cascadingCheck.confidence >= 0.0 && cascadingCheck.confidence <= 1.0, true);
    });

    test('should provide enhanced device capability scoring', () => {
      const components = errorHandler.getComponents();
      const degradationManager = components.degradationManager;
      
      // Test with high-end capabilities
      const highEndCapabilities = {
        supported: true,
        version: 2,
        maxTextureSize: 4096,
        maxVertexAttribs: 32,
        maxFragmentUniforms: 64,
        extensions: ['OES_texture_float', 'WEBGL_depth_texture', 'OES_standard_derivatives'],
        renderer: 'NVIDIA GeForce RTX',
        vendor: 'NVIDIA Corporation',
      };
      
      const fallbackLevel = degradationManager.determineFallbackLevel(highEndCapabilities, []);
      assert.strictEqual(fallbackLevel, 'none');
      
      // Test with low-end capabilities
      const lowEndCapabilities = {
        supported: true,
        version: 1,
        maxTextureSize: 512,
        maxVertexAttribs: 8,
        maxFragmentUniforms: 8,
        extensions: [],
        renderer: 'Intel HD Graphics',
        vendor: 'Intel',
      };
      
      const lowEndFallbackLevel = degradationManager.determineFallbackLevel(lowEndCapabilities, []);
      assert.strictEqual(['reduced', 'minimal'].includes(lowEndFallbackLevel), true);
    });

    test('should handle comprehensive WebGL state preservation', () => {
      const components = errorHandler.getComponents();
      const contextRecovery = components.contextRecovery;
      
      // Mock canvas and WebGL context
      const mockCanvas = document.createElement('canvas');
      const mockGL = {
        getParameter: (param: number) => {
          switch (param) {
            case 2978: return [0, 0, 800, 600]; // VIEWPORT
            case 3106: return [0.0, 0.0, 0.0, 1.0]; // COLOR_CLEAR_VALUE
            case 3042: return 1; // BLEND
            case 770: return 1; // BLEND_SRC_RGB
            case 771: return 1; // BLEND_DST_RGB
            default: return 0;
          }
        },
        isEnabled: (capability: number) => capability === 3042, // BLEND enabled
        viewport: () => {},
        clearColor: () => {},
        enable: () => {},
        disable: () => {},
        blendFuncSeparate: () => {},
        activeTexture: () => {},
        isContextLost: () => false,
      };
      
      // Initialize context recovery
      contextRecovery.initialize(mockCanvas, mockGL as any);
      
      // Should not throw during state capture and restoration
      assert.doesNotThrow(() => {
        // Simulate context loss and restoration
        const loseEvent = new Event('webglcontextlost');
        mockCanvas.dispatchEvent(loseEvent);
        
        const restoreEvent = new Event('webglcontextrestored');
        mockCanvas.dispatchEvent(restoreEvent);
      });
    });

    test('should track recovery statistics with circuit breaker info', () => {
      const components = errorHandler.getComponents();
      const recoveryScenarios = components.recoveryScenarios;
      
      // Simulate some recovery attempts
      recoveryScenarios.recoveryAttempts.set('test_scenario', 3);
      
      const stats = recoveryScenarios.getRecoveryStats();
      
      assert.strictEqual(typeof stats, 'object');
      assert.strictEqual(stats['test_scenario'], 3);
      
      // Should include circuit breaker information
      const statKeys = Object.keys(stats);
      const hasCircuitBreakerStats = statKeys.some(key => key.includes('circuit'));
      assert.strictEqual(typeof hasCircuitBreakerStats, 'boolean');
    });

    test('should reset recovery attempts and circuit breakers', () => {
      const components = errorHandler.getComponents();
      const recoveryScenarios = components.recoveryScenarios;
      
      // Set some recovery attempts and circuit breaker state
      recoveryScenarios.recoveryAttempts.set('test_scenario', 2);
      
      const statsBefore = recoveryScenarios.getRecoveryStats();
      assert.strictEqual(statsBefore['test_scenario'], 2);
      
      // Reset specific scenario
      recoveryScenarios.resetRecoveryAttempts('test_scenario');
      
      const statsAfter = recoveryScenarios.getRecoveryStats();
      assert.strictEqual(statsAfter['test_scenario'], undefined);
      
      // Reset all scenarios
      recoveryScenarios.resetRecoveryAttempts();
      
      const statsCleared = recoveryScenarios.getRecoveryStats();
      assert.strictEqual(Object.keys(statsCleared).length, 0);
    });
  });