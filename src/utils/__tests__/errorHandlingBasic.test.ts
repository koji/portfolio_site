/**
 * Basic error handling tests that don't require DOM environment
 * Tests core functionality of the error handling system
 */

import { describe, test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  ShaderErrorLogger,
  GracefulDegradationManager,
  type ShaderError,
  type WebGLCapabilities,
} from '../shaderErrorHandling';

describe('Basic Error Handling System', () => {
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

      assert.strictEqual(['reduced', 'minimal'].includes(fallbackLevel), true);
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
      const levels = ['none', 'reduced', 'minimal', 'disabled'] as const;

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

    test('should reset to no degradation', () => {
      degradationManager.applyFallback('minimal', 'Test');
      degradationManager.reset();

      assert.strictEqual(degradationManager.getCurrentLevel(), 'none');
      assert.strictEqual(degradationManager.getFallbackHistory().length, 0);
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle error severity escalation', () => {
      const logger = new ShaderErrorLogger(false);
      const degradationManager = new GracefulDegradationManager(logger);

      // Start with low severity errors
      logger.logError('performance', 'Minor issue', 'low');
      let errors = logger.getRecentErrors();
      let fallbackLevel = degradationManager.determineFallbackLevel(
        { supported: true, version: 2, maxTextureSize: 2048, maxVertexAttribs: 16, maxFragmentUniforms: 32, extensions: [], renderer: 'test', vendor: 'test' },
        errors
      );
      
      // Should not require fallback for low severity
      assert.strictEqual(fallbackLevel, 'none');

      // Add high severity errors
      logger.logError('compilation', 'Major failure', 'high');
      logger.logError('context_loss', 'Context lost', 'high');
      errors = logger.getRecentErrors();
      fallbackLevel = degradationManager.determineFallbackLevel(
        { supported: true, version: 2, maxTextureSize: 2048, maxVertexAttribs: 16, maxFragmentUniforms: 32, extensions: [], renderer: 'test', vendor: 'test' },
        errors
      );

      // Should escalate fallback level
      assert.strictEqual(['reduced', 'minimal'].includes(fallbackLevel), true);
    });

    test('should provide comprehensive error statistics', () => {
      const logger = new ShaderErrorLogger(false);
      const degradationManager = new GracefulDegradationManager(logger);

      // Generate various errors
      logger.logError('compilation', 'Shader error 1', 'low');
      logger.logError('compilation', 'Shader error 2', 'medium');
      logger.logError('performance', 'Performance issue', 'high');
      logger.logError('memory', 'Memory warning', 'medium');

      // Apply some fallbacks
      degradationManager.applyFallback('reduced', 'Performance issues');
      degradationManager.applyFallback('minimal', 'Severe performance issues');

      const errorStats = logger.getErrorStats();
      const fallbackHistory = degradationManager.getFallbackHistory();

      // Verify error statistics
      assert.strictEqual(errorStats['compilation_low'], 1);
      assert.strictEqual(errorStats['compilation_medium'], 1);
      assert.strictEqual(errorStats['performance_high'], 1);
      assert.strictEqual(errorStats['memory_medium'], 1);

      // Verify fallback history
      assert.strictEqual(fallbackHistory.length, 2);
      assert.strictEqual(fallbackHistory[0].level, 'reduced');
      assert.strictEqual(fallbackHistory[1].level, 'minimal');
    });
  });
});