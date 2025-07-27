/**
 * Performance Optimization Tests
 * 
 * Tests for the performance optimization utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  PerformanceMonitor, 
  DeviceCapabilityDetector, 
  AdaptiveQualityManager,
  CrossBrowserCompatibility 
} from '../performanceOptimization';

describe('Performance Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DeviceCapabilityDetector', () => {
    it('should detect device capabilities', () => {
      const detector = new DeviceCapabilityDetector();
      const capabilities = detector.detectCapabilities();
      
      expect(capabilities).toBeDefined();
      expect(capabilities.webglVersion).toBeGreaterThanOrEqual(0);
      expect(capabilities.maxTextureSize).toBeGreaterThanOrEqual(0);
      expect(typeof capabilities.isMobile).toBe('boolean');
      expect(typeof capabilities.isHighPerformance).toBe('boolean');
    });

    it('should provide recommended settings', () => {
      const detector = new DeviceCapabilityDetector();
      const settings = detector.getRecommendedSettings();
      
      expect(settings).toBeDefined();
      expect(settings.particleCount).toBeGreaterThan(0);
      expect(settings.renderScale).toBeGreaterThan(0);
      expect(settings.qualityLevel).toBeGreaterThanOrEqual(0);
      expect(settings.qualityLevel).toBeLessThanOrEqual(1);
    });
  });

  describe('PerformanceMonitor', () => {
    it('should initialize with default metrics', () => {
      const monitor = new PerformanceMonitor();
      const metrics = monitor.metrics;
      
      expect(metrics.frameRate).toBe(60);
      expect(metrics.frameTime).toBe(16.67);
      expect(metrics.memoryUsage).toBe(0);
      
      monitor.dispose();
    });

    it('should update frame metrics', () => {
      const monitor = new PerformanceMonitor();
      
      monitor.updateFrame(0);
      monitor.updateFrame(16.67);
      monitor.updateFrame(33.33);
      
      const metrics = monitor.metrics;
      expect(metrics.frameRate).toBeGreaterThan(0);
      expect(metrics.frameTime).toBeGreaterThan(0);
      
      monitor.dispose();
    });

    it('should provide optimization recommendations', () => {
      const monitor = new PerformanceMonitor();
      
      // Simulate poor performance
      monitor.updateFrame(0);
      monitor.updateFrame(100); // 10 FPS
      
      const recommendations = monitor.getOptimizationRecommendations();
      expect(recommendations).toBeDefined();
      
      monitor.dispose();
    });
  });

  describe('AdaptiveQualityManager', () => {
    it('should initialize with device-appropriate settings', () => {
      const manager = new AdaptiveQualityManager();
      const settings = manager.getSettings();
      
      expect(settings).toBeDefined();
      expect(settings.particleCount).toBeGreaterThan(0);
      expect(settings.qualityLevel).toBeGreaterThanOrEqual(0);
      expect(settings.qualityLevel).toBeLessThanOrEqual(1);
      
      manager.dispose();
    });

    it('should update quality based on performance', () => {
      const manager = new AdaptiveQualityManager();
      
      const initialSettings = manager.getSettings();
      const updatedSettings = manager.updateQuality(16.67);
      
      expect(updatedSettings).toBeDefined();
      expect(updatedSettings.particleCount).toBeGreaterThan(0);
      
      manager.dispose();
    });
  });

  describe('CrossBrowserCompatibility', () => {
    it('should detect WebGL support', () => {
      const isSupported = CrossBrowserCompatibility.isWebGLSupported();
      expect(typeof isSupported).toBe('boolean');
    });

    it('should detect WebGL2 support', () => {
      const isSupported = CrossBrowserCompatibility.isWebGL2Supported();
      expect(typeof isSupported).toBe('boolean');
    });

    it('should provide browser optimizations', () => {
      const optimizations = CrossBrowserCompatibility.getBrowserOptimizations();
      expect(optimizations).toBeDefined();
      expect(typeof optimizations).toBe('object');
    });

    it('should provide browser workarounds', () => {
      const workarounds = CrossBrowserCompatibility.getBrowserWorkarounds();
      expect(workarounds).toBeDefined();
      expect(typeof workarounds).toBe('object');
    });
  });
});