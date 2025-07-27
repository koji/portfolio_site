/**
 * Final System Validation Tests
 * 
 * Comprehensive tests to validate the complete enhanced shader system
 * including performance optimization and cross-browser compatibility.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  AdaptiveQualityManager,
  ShaderParameterOptimizer,
  CrossBrowserCompatibility,
  DeviceCapabilityDetector
} from '../performanceOptimization';
import { 
  BrowserDetector,
  CompatibilityTester,
  PerformanceTester,
  AutomatedTestRunner
} from '../crossBrowserTesting';

describe('Final System Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Performance Optimization Integration', () => {
    it('should optimize shader parameters for different device types', () => {
      const detector = new DeviceCapabilityDetector();
      const capabilities = detector.detectCapabilities();
      const settings = detector.getRecommendedSettings();
      
      const optimizedUniforms = ShaderParameterOptimizer.getOptimizedUniforms(settings, capabilities);
      
      expect(optimizedUniforms).toBeDefined();
      expect(optimizedUniforms.particleCount).toBeGreaterThan(0);
      expect(optimizedUniforms.qualityLevel).toBeGreaterThanOrEqual(0);
      expect(optimizedUniforms.qualityLevel).toBeLessThanOrEqual(1);
      expect(typeof optimizedUniforms.enableDepthSimulation).toBe('boolean');
      expect(typeof optimizedUniforms.enableGlowEffects).toBe('boolean');
    });

    it('should provide browser-specific shader modifications', () => {
      const modifications = ShaderParameterOptimizer.getShaderModifications();
      
      expect(modifications).toBeDefined();
      expect(typeof modifications).toBe('object');
      expect(modifications.precision).toBeDefined();
    });

    it('should adapt quality dynamically based on performance', () => {
      const manager = new AdaptiveQualityManager();
      
      // Test initial settings
      const initialSettings = manager.getSettings();
      expect(initialSettings.particleCount).toBeGreaterThan(0);
      
      // Test quality update
      const updatedSettings = manager.updateQuality(16.67);
      expect(updatedSettings).toBeDefined();
      
      // Test metrics
      const metrics = manager.getMetrics();
      expect(metrics.frameRate).toBeGreaterThan(0);
      
      manager.dispose();
    });
  });

  describe('Cross-Browser Compatibility Validation', () => {
    it('should detect browser information correctly', () => {
      const browser = BrowserDetector.detectBrowser();
      
      expect(browser).toBeDefined();
      expect(browser.name).toBeDefined();
      expect(browser.version).toBeDefined();
      expect(browser.engine).toBeDefined();
      expect(browser.platform).toBeDefined();
      expect(typeof browser.isMobile).toBe('boolean');
      expect(typeof browser.supportsWebGL).toBe('boolean');
      expect(typeof browser.supportsWebGL2).toBe('boolean');
    });

    it('should run compatibility tests successfully', () => {
      const results = CompatibilityTester.runCompatibilityTests();
      
      expect(results).toBeDefined();
      expect(results.browser).toBeDefined();
      expect(typeof results.webglSupport).toBe('boolean');
      expect(typeof results.shaderCompilation).toBe('boolean');
      expect(typeof results.uniformSupport).toBe('boolean');
      expect(typeof results.contextCreation).toBe('boolean');
      expect(typeof results.textureSupport).toBe('boolean');
      expect(typeof results.passed).toBe('boolean');
      expect(Array.isArray(results.issues)).toBe(true);
    });

    it('should provide appropriate optimizations for different browsers', () => {
      // Test Chrome optimizations
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true,
      });
      
      const chromeOptimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(chromeOptimizations).toBeDefined();
      
      // Test Safari optimizations
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        configurable: true,
      });
      
      const safariOptimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(safariOptimizations).toBeDefined();
      expect(safariOptimizations.renderScale).toBeLessThanOrEqual(1.0);
    });

    it('should handle mobile browser optimizations', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true,
      });
      
      const mobileOptimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(mobileOptimizations).toBeDefined();
      expect(mobileOptimizations.particleCount).toBeLessThan(100);
      expect(mobileOptimizations.interactionEnabled).toBe(false);
      expect(mobileOptimizations.targetFrameRate).toBeLessThanOrEqual(30);
    });
  });

  describe('Performance Testing Integration', () => {
    it('should run performance tests', () => {
      const tester = new PerformanceTester();
      
      tester.startTest();
      
      // Simulate some frame recordings
      tester.recordFrame(60, 16.67);
      tester.recordFrame(58, 17.2);
      tester.recordFrame(62, 16.1);
      
      const results = tester.endTest();
      
      expect(results).toBeDefined();
      expect(results.browser).toBeDefined();
      expect(results.averageFrameRate).toBeGreaterThan(0);
      expect(results.minFrameRate).toBeGreaterThan(0);
      expect(results.maxFrameRate).toBeGreaterThan(0);
      expect(results.frameDrops).toBeGreaterThanOrEqual(0);
      expect(results.testDuration).toBeGreaterThan(0);
      expect(typeof results.passed).toBe('boolean');
      expect(Array.isArray(results.issues)).toBe(true);
    });

    it('should run automated test suite', async () => {
      const testRunner = new AutomatedTestRunner();
      
      const results = await testRunner.runAllTests();
      
      expect(results).toBeDefined();
      expect(results.compatibility).toBeDefined();
      expect(results.performance).toBeDefined();
      expect(results.summary).toBeDefined();
      
      expect(results.summary.browser).toBeDefined();
      expect(typeof results.summary.overallPassed).toBe('boolean');
      expect(results.summary.compatibilityScore).toBeGreaterThanOrEqual(0);
      expect(results.summary.performanceScore).toBeGreaterThanOrEqual(0);
      expect(results.summary.recommendation).toBeDefined();
      expect(Array.isArray(results.summary.criticalIssues)).toBe(true);
      expect(Array.isArray(results.summary.warnings)).toBe(true);
      expect(Array.isArray(results.summary.optimizationSuggestions)).toBe(true);
    });
  });

  describe('System Integration Validation', () => {
    it('should provide complete optimization pipeline', () => {
      // Initialize all components
      const detector = new DeviceCapabilityDetector();
      const manager = new AdaptiveQualityManager();
      
      // Get device capabilities
      const capabilities = detector.detectCapabilities();
      expect(capabilities).toBeDefined();
      
      // Get optimized settings
      const settings = manager.getSettings();
      expect(settings).toBeDefined();
      
      // Get optimized uniforms
      const uniforms = ShaderParameterOptimizer.getOptimizedUniforms(settings, capabilities);
      expect(uniforms).toBeDefined();
      
      // Get browser optimizations
      const browserOpts = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(browserOpts).toBeDefined();
      
      // Cleanup
      manager.dispose();
    });

    it('should handle error conditions gracefully', () => {
      // Test with WebGL unavailable
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
      
      const detector = new DeviceCapabilityDetector();
      const capabilities = detector.detectCapabilities();
      
      expect(capabilities).toBeDefined();
      expect(capabilities.webglVersion).toBe(0);
      expect(capabilities.maxTextureSize).toBe(0);
      
      // Restore
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    it('should validate performance thresholds', () => {
      const tester = new PerformanceTester();
      
      tester.startTest();
      
      // Simulate poor performance
      tester.recordFrame(15, 66.67); // 15 FPS
      tester.recordFrame(20, 50.0);  // 20 FPS
      tester.recordFrame(25, 40.0);  // 25 FPS
      
      const results = tester.endTest();
      
      expect(results.passed).toBe(false);
      expect(results.issues.length).toBeGreaterThan(0);
      expect(results.averageFrameRate).toBeLessThan(30);
    });

    it('should provide optimization recommendations based on performance', () => {
      const manager = new AdaptiveQualityManager();
      
      // Simulate poor performance by updating with low frame rate
      const mockPerformance = {
        now: vi.fn()
          .mockReturnValueOnce(0)
          .mockReturnValueOnce(100), // 10 FPS
      };
      
      Object.defineProperty(window, 'performance', {
        value: mockPerformance,
        writable: true,
      });
      
      const settings = manager.updateQuality(100);
      expect(settings.qualityLevel).toBeLessThan(1.0);
      
      manager.dispose();
    });
  });

  describe('Final Validation Checklist', () => {
    it('should pass all critical system requirements', () => {
      // ✅ Performance optimization system
      const manager = new AdaptiveQualityManager();
      expect(manager).toBeDefined();
      
      // ✅ Cross-browser compatibility
      const compatibility = CompatibilityTester.runCompatibilityTests();
      expect(compatibility).toBeDefined();
      
      // ✅ Device capability detection
      const detector = new DeviceCapabilityDetector();
      const capabilities = detector.detectCapabilities();
      expect(capabilities).toBeDefined();
      
      // ✅ Browser-specific optimizations
      const browserOpts = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(browserOpts).toBeDefined();
      
      // ✅ Shader parameter optimization
      const settings = manager.getSettings();
      const uniforms = ShaderParameterOptimizer.getOptimizedUniforms(settings, capabilities);
      expect(uniforms).toBeDefined();
      
      // ✅ Performance testing
      const tester = new PerformanceTester();
      tester.startTest();
      tester.recordFrame(60, 16.67);
      const results = tester.endTest();
      expect(results).toBeDefined();
      
      // Cleanup
      manager.dispose();
    });

    it('should demonstrate complete system functionality', async () => {
      // This test demonstrates the complete workflow from detection to optimization
      
      // 1. Detect device capabilities
      const detector = new DeviceCapabilityDetector();
      const capabilities = detector.detectCapabilities();
      
      // 2. Initialize adaptive quality manager
      const manager = new AdaptiveQualityManager();
      
      // 3. Get optimized settings
      const settings = manager.getSettings();
      
      // 4. Generate optimized shader uniforms
      const uniforms = ShaderParameterOptimizer.getOptimizedUniforms(settings, capabilities);
      
      // 5. Run compatibility tests
      const compatibility = CompatibilityTester.runCompatibilityTests();
      
      // 6. Run performance tests
      const testRunner = new AutomatedTestRunner();
      const testResults = await testRunner.runAllTests();
      
      // Validate complete pipeline
      expect(capabilities).toBeDefined();
      expect(settings).toBeDefined();
      expect(uniforms).toBeDefined();
      expect(compatibility).toBeDefined();
      expect(testResults).toBeDefined();
      
      // Validate optimization effectiveness
      expect(uniforms.particleCount).toBeGreaterThan(0);
      expect(uniforms.qualityLevel).toBeGreaterThanOrEqual(0);
      expect(uniforms.qualityLevel).toBeLessThanOrEqual(1);
      
      // Validate compatibility
      expect(typeof compatibility.webglSupport).toBe('boolean');
      expect(typeof compatibility.passed).toBe('boolean');
      
      // Validate performance testing
      expect(testResults.summary.overallPassed).toBeDefined();
      expect(testResults.summary.compatibilityScore).toBeGreaterThanOrEqual(0);
      expect(testResults.summary.performanceScore).toBeGreaterThanOrEqual(0);
      
      // Cleanup
      manager.dispose();
      
      console.log('✅ Complete enhanced shader system validation passed!');
      console.log(`📊 Compatibility Score: ${testResults.summary.compatibilityScore}/100`);
      console.log(`⚡ Performance Score: ${testResults.summary.performanceScore}/100`);
      console.log(`🎯 Recommendation: ${testResults.summary.recommendation}`);
    });
  });
});