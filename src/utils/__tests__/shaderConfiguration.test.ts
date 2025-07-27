/**
 * Comprehensive tests for shader configuration system
 * 
 * Tests parameter validation, preset management, and configuration merging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateCoreConfig,
  validateParticleConfig,
  validateInteractionConfig,
  validateCompleteConfig,
  mergeWithDefaults,
  applyPreset,
  createConfigFromSimpleParams,
  createShaderConfig,
  ShaderConfigurationManager,
  ShaderConfigUtils,
  DEFAULT_SHADER_CONFIG,
  SHADER_PRESETS,
  CONFIG_CONSTRAINTS,
  type ShaderConfiguration,
  type ParticleSystemConfiguration,
  type MouseInteractionConfiguration,
  type CompleteShaderConfiguration,
} from '../shaderConfiguration';

describe('Shader Configuration System', () => {
  describe('Core Configuration Validation', () => {
    it('should validate valid core configuration', () => {
      const validConfig: Partial<ShaderConfiguration> = {
        intensity: 0.7,
        animationSpeed: 1.2,
        interactionEnabled: true,
        interactionRadius: 0.4,
        particleCount: 150,
        renderScale: 0.9,
        themeTransition: 0.5,
        respectMotionPreference: true,
        disableAnimations: false,
        ariaLabel: 'Test shader background',
      };

      const result = validateCoreConfig(validConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should reject invalid intensity values', () => {
      const invalidConfig: Partial<ShaderConfiguration> = {
        intensity: 1.5, // Above maximum
      };

      const result = validateCoreConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('intensity (1.5) is above maximum (1)');
      expect(result.correctedConfig?.intensity).toBe(1.0);
    });

    it('should reject invalid animation speed values', () => {
      const invalidConfig: Partial<ShaderConfiguration> = {
        animationSpeed: 0.05, // Below minimum
      };

      const result = validateCoreConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('animationSpeed (0.05) is below minimum (0.1)');
      expect(result.correctedConfig?.animationSpeed).toBe(0.1);
    });

    it('should reject invalid particle count values', () => {
      const invalidConfig: Partial<ShaderConfiguration> = {
        particleCount: 500, // Above maximum
      };

      const result = validateCoreConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('particleCount (500) is above maximum (300)');
      expect(result.correctedConfig?.particleCount).toBe(300);
    });

    it('should warn about high particle counts', () => {
      const config: Partial<ShaderConfiguration> = {
        particleCount: 200, // High but valid
      };

      const result = validateCoreConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('High particle count may impact performance on mobile devices');
    });

    it('should reject invalid boolean values', () => {
      const invalidConfig = {
        interactionEnabled: 'true' as any, // String instead of boolean
        respectMotionPreference: 1 as any, // Number instead of boolean
      };

      const result = validateCoreConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('interactionEnabled must be a boolean value');
      expect(result.errors).toContain('respectMotionPreference must be a boolean value');
    });

    it('should reject invalid ARIA label', () => {
      const invalidConfig: Partial<ShaderConfiguration> = {
        ariaLabel: '', // Empty string
      };

      const result = validateCoreConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ariaLabel must be a non-empty string');
      expect(result.correctedConfig?.ariaLabel).toBe(DEFAULT_SHADER_CONFIG.core.ariaLabel);
    });

    it('should handle NaN values', () => {
      const invalidConfig: Partial<ShaderConfiguration> = {
        intensity: NaN,
        animationSpeed: NaN,
      };

      const result = validateCoreConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('intensity must be a valid number');
      expect(result.errors).toContain('animationSpeed must be a valid number');
    });
  });

  describe('Particle Configuration Validation', () => {
    it('should validate valid particle configuration', () => {
      const validConfig: Partial<ParticleSystemConfiguration> = {
        baseParticleCount: 120,
        sizeRange: { min: 0.002, max: 0.008 },
        opacityRange: { min: 0.1, max: 0.9 },
        lifecycleDuration: 10.0,
        brownianIntensity: 1.5,
        enableDepthSimulation: true,
        edgeFadeDistance: 0.15,
        enableGlowEffects: true,
      };

      const result = validateParticleConfig(validConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid size ranges', () => {
      const invalidConfig: Partial<ParticleSystemConfiguration> = {
        sizeRange: { min: 0.01, max: 0.005 }, // min > max
      };

      const result = validateParticleConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('sizeRange.min must be less than sizeRange.max');
      expect(result.correctedConfig?.sizeRange?.min).toBeLessThan(result.correctedConfig?.sizeRange?.max || 0);
    });

    it('should reject invalid opacity ranges', () => {
      const invalidConfig: Partial<ParticleSystemConfiguration> = {
        opacityRange: { min: 0.8, max: 0.6 }, // min > max
      };

      const result = validateParticleConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('opacityRange.min must be less than opacityRange.max');
    });

    it('should validate range bounds', () => {
      const invalidConfig: Partial<ParticleSystemConfiguration> = {
        sizeRange: { min: -0.001, max: 0.025 }, // min below minimum, max above maximum
        opacityRange: { min: -0.1, max: 1.5 }, // min below minimum, max above maximum
      };

      const result = validateParticleConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.correctedConfig?.sizeRange?.min).toBeGreaterThanOrEqual(CONFIG_CONSTRAINTS.particles.sizeRange.min.min);
      expect(result.correctedConfig?.sizeRange?.max).toBeLessThanOrEqual(CONFIG_CONSTRAINTS.particles.sizeRange.max.max);
    });

    it('should validate lifecycle duration bounds', () => {
      const invalidConfig: Partial<ParticleSystemConfiguration> = {
        lifecycleDuration: 50.0, // Above maximum
      };

      const result = validateParticleConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('lifecycleDuration (50) is above maximum (30)');
    });

    it('should validate Brownian intensity bounds', () => {
      const invalidConfig: Partial<ParticleSystemConfiguration> = {
        brownianIntensity: -0.5, // Below minimum
      };

      const result = validateParticleConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('brownianIntensity (-0.5) is below minimum (0)');
    });
  });

  describe('Interaction Configuration Validation', () => {
    it('should validate valid interaction configuration', () => {
      const validConfig: Partial<MouseInteractionConfiguration> = {
        baseRadius: 0.4,
        dynamicRadiusEnabled: true,
        maxRadiusBoost: 0.15,
        smoothingFactor: 0.08,
        zones: {
          repulsion: { threshold: 0.2, strength: 0.9 },
          orbital: { threshold: 0.6, strength: 0.4 },
          attraction: { threshold: 0.9, strength: 0.25 },
        },
        enableTrailEffects: true,
        trailIntensity: 1.2,
      };

      const result = validateInteractionConfig(validConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid zone threshold ordering', () => {
      const invalidConfig: Partial<MouseInteractionConfiguration> = {
        zones: {
          repulsion: { threshold: 0.8, strength: 0.9 }, // threshold too high
          orbital: { threshold: 0.6, strength: 0.4 },   // threshold lower than repulsion
          attraction: { threshold: 0.9, strength: 0.25 },
        },
      };

      const result = validateInteractionConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Interaction zone thresholds must be in ascending order: repulsion < orbital < attraction');
    });

    it('should validate zone strength bounds', () => {
      const invalidConfig: Partial<MouseInteractionConfiguration> = {
        zones: {
          repulsion: { threshold: 0.2, strength: 3.0 }, // strength above maximum
          orbital: { threshold: 0.6, strength: -0.1 },  // strength below minimum
          attraction: { threshold: 0.9, strength: 0.25 },
        },
      };

      const result = validateInteractionConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate smoothing factor bounds', () => {
      const invalidConfig: Partial<MouseInteractionConfiguration> = {
        smoothingFactor: 1.5, // Above maximum
      };

      const result = validateInteractionConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('smoothingFactor (1.5) is above maximum (1)');
    });
  });

  describe('Complete Configuration Validation', () => {
    it('should validate complete valid configuration', () => {
      const validConfig: Partial<CompleteShaderConfiguration> = {
        core: {
          intensity: 0.7,
          animationSpeed: 1.0,
          interactionEnabled: true,
          interactionRadius: 0.3,
          particleCount: 100,
          renderScale: 1.0,
          themeTransition: 0.0,
          respectMotionPreference: true,
          disableAnimations: false,
          ariaLabel: 'Test background',
        },
        colors: {
          primaryColor: { r: 0.8, g: 0.2, b: 0.3 },
          accentColor: { r: 0.2, g: 0.8, b: 0.5 },
          backgroundColor: { r: 1.0, g: 1.0, b: 1.0 },
          particleColor: { r: 0.5, g: 0.5, b: 0.5 },
          darkModeIntensityBoost: 1.2,
          darkModeContrastBoost: 1.1,
          darkModeGlowMultiplier: 1.3,
          colorTemperature: 0.1,
          saturationBoost: 1.1,
          contrastEnhancement: 1.05,
        },
      };

      const result = validateCompleteConfig(validConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate color RGB values', () => {
      const invalidConfig: Partial<CompleteShaderConfiguration> = {
        colors: {
          primaryColor: { r: 1.5, g: -0.2, b: 0.5 }, // r above max, g below min
          accentColor: { r: 0.5, g: 0.5, b: 1.2 },   // b above max
          backgroundColor: { r: 1.0, g: 1.0, b: 1.0 },
          particleColor: { r: 0.5, g: 0.5, b: 0.5 },
          darkModeIntensityBoost: 1.2,
          darkModeContrastBoost: 1.1,
          darkModeGlowMultiplier: 1.3,
          colorTemperature: 0.0,
          saturationBoost: 1.0,
          contrastEnhancement: 1.0,
        },
      };

      const result = validateCompleteConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.correctedConfig?.colors?.primaryColor?.r).toBe(1.0);
      expect(result.correctedConfig?.colors?.primaryColor?.g).toBe(0.0);
      expect(result.correctedConfig?.colors?.accentColor?.b).toBe(1.0);
    });

    it('should accumulate errors from multiple sections', () => {
      const invalidConfig: Partial<CompleteShaderConfiguration> = {
        core: {
          intensity: 1.5, // Invalid
          particleCount: 500, // Invalid
        },
        particles: {
          baseParticleCount: 600, // Invalid
          sizeRange: { min: 0.01, max: 0.005 }, // Invalid range
        },
        colors: {
          primaryColor: { r: 1.5, g: 0.5, b: 0.5 }, // Invalid color
        },
      };

      const result = validateCompleteConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3); // Multiple errors from different sections
    });
  });

  describe('Configuration Merging', () => {
    it('should merge partial configuration with defaults', () => {
      const partialConfig: Partial<CompleteShaderConfiguration> = {
        core: {
          intensity: 0.8,
          animationSpeed: 1.5,
        },
        particles: {
          baseParticleCount: 150,
        },
      };

      const merged = mergeWithDefaults(partialConfig);
      
      // Should have custom values
      expect(merged.core.intensity).toBe(0.8);
      expect(merged.core.animationSpeed).toBe(1.5);
      expect(merged.particles.baseParticleCount).toBe(150);
      
      // Should have default values for unspecified properties
      expect(merged.core.interactionEnabled).toBe(DEFAULT_SHADER_CONFIG.core.interactionEnabled);
      expect(merged.particles.enableDepthSimulation).toBe(DEFAULT_SHADER_CONFIG.particles.enableDepthSimulation);
      expect(merged.colors).toEqual(DEFAULT_SHADER_CONFIG.colors);
    });

    it('should handle empty partial configuration', () => {
      const merged = mergeWithDefaults({});
      expect(merged).toEqual(DEFAULT_SHADER_CONFIG);
    });
  });

  describe('Preset Application', () => {
    it('should apply high performance preset', () => {
      const config = applyPreset('highPerformance');
      
      expect(config.core.intensity).toBe(0.8);
      expect(config.core.particleCount).toBe(200);
      expect(config.core.interactionEnabled).toBe(true);
      expect(config.particles.baseParticleCount).toBe(200);
      expect(config.particles.enableGlowEffects).toBe(true);
      expect(config.geometry.enableFlowingLines).toBe(true);
    });

    it('should apply performance preset', () => {
      const config = applyPreset('performance');
      
      expect(config.core.intensity).toBe(0.4);
      expect(config.core.particleCount).toBe(50);
      expect(config.core.interactionEnabled).toBe(false);
      expect(config.particles.enableGlowEffects).toBe(false);
      expect(config.geometry.enableVoronoiPatterns).toBe(false);
    });

    it('should apply minimal preset', () => {
      const config = applyPreset('minimal');
      
      expect(config.core.intensity).toBe(0.2);
      expect(config.core.animationSpeed).toBe(0.3);
      expect(config.core.particleCount).toBe(20);
      expect(config.particles.enableDepthSimulation).toBe(false);
      expect(config.geometry.enableSpiralPatterns).toBe(false);
    });

    it('should apply preset with custom overrides', () => {
      const config = applyPreset('balanced', {
        core: { intensity: 0.9 },
        particles: { enableGlowEffects: false },
      });
      
      // Should have custom override
      expect(config.core.intensity).toBe(0.9);
      expect(config.particles.enableGlowEffects).toBe(false);
      
      // Should have preset values for other properties
      expect(config.core.particleCount).toBe(100); // From balanced preset
    });
  });

  describe('Simple Parameter Configuration', () => {
    it('should create configuration from simple parameters', () => {
      const config = createConfigFromSimpleParams({
        quality: 'highPerformance',
        intensity: 0.9,
        interactionEnabled: false,
        particleCount: 80,
        animationSpeed: 0.8,
        respectMotionPreference: false,
      });

      expect(config.core.intensity).toBe(0.9);
      expect(config.core.interactionEnabled).toBe(false);
      expect(config.core.particleCount).toBe(80);
      expect(config.core.animationSpeed).toBe(0.8);
      expect(config.core.respectMotionPreference).toBe(false);
      expect(config.interaction.baseRadius).toBe(0.0); // Should be 0 when interaction disabled
    });

    it('should use balanced preset as default', () => {
      const config = createConfigFromSimpleParams({});
      const balancedPreset = applyPreset('balanced');
      
      expect(config.core.intensity).toBe(balancedPreset.core.intensity);
      expect(config.core.particleCount).toBe(balancedPreset.core.particleCount);
    });
  });

  describe('Configuration Builder', () => {
    it('should create configuration using fluent interface', () => {
      const { config } = createShaderConfig()
        .preset('balanced')
        .intensity(0.8)
        .core({ particleCount: 120 })
        .particles({ enableGlowEffects: true })
        .build();

      expect(config.core.intensity).toBe(0.8);
      expect(config.core.particleCount).toBe(120);
      expect(config.particles.enableGlowEffects).toBe(true);
    });

    it('should apply mobile optimizations', () => {
      const { config } = createShaderConfig()
        .mobile()
        .build();

      expect(config.core.particleCount).toBe(50);
      expect(config.core.renderScale).toBe(0.8);
      expect(config.core.interactionEnabled).toBe(false);
      expect(config.particles.enableGlowEffects).toBe(false);
      expect(config.performance.enableAutoQuality).toBe(true);
    });

    it('should apply high-end optimizations', () => {
      const { config } = createShaderConfig()
        .highEnd()
        .build();

      expect(config.core.particleCount).toBe(200);
      expect(config.core.renderScale).toBe(1.0);
      expect(config.core.interactionEnabled).toBe(true);
      expect(config.particles.enableGlowEffects).toBe(true);
      expect(config.particles.enableDepthSimulation).toBe(true);
    });

    it('should apply accessibility optimizations', () => {
      const { config } = createShaderConfig()
        .accessible()
        .build();

      expect(config.core.animationSpeed).toBe(0.3);
      expect(config.core.intensity).toBe(0.2);
      expect(config.core.particleCount).toBe(20);
      expect(config.core.respectMotionPreference).toBe(true);
      expect(config.particles.brownianIntensity).toBe(0.3);
    });

    it('should auto-scale parameters with intensity', () => {
      const { config } = createShaderConfig()
        .intensity(1.0)
        .build();

      expect(config.core.intensity).toBe(1.0);
      // Should scale related parameters
      expect(config.particles.brownianIntensity).toBeGreaterThan(1.0);
      expect(config.colors.saturationBoost).toBeGreaterThan(1.2);
    });

    it('should validate configuration during build', () => {
      const { validation } = createShaderConfig()
        .core({ intensity: 1.5 }) // Invalid
        .build();

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should build unsafe configuration without validation', () => {
      const config = createShaderConfig()
        .core({ intensity: 1.5 }) // Invalid
        .buildUnsafe();

      expect(config.core.intensity).toBe(1.5); // Should accept invalid value
    });
  });

  describe('Configuration Utils', () => {
    it('should create configuration for current device', () => {
      const config = ShaderConfigUtils.createForCurrentDevice();
      
      expect(config).toBeDefined();
      expect(config.core.intensity).toBeGreaterThan(0);
      expect(config.core.particleCount).toBeGreaterThan(0);
    });

    it('should create configuration from URL parameters', () => {
      const params = new URLSearchParams('preset=highPerformance&intensity=0.8&particles=150');
      const config = ShaderConfigUtils.createFromURLParams(params);
      
      expect(config.core.intensity).toBe(0.8);
      expect(config.core.particleCount).toBe(150);
    });

    it('should convert configuration to URL parameters', () => {
      const config = applyPreset('highPerformance');
      const params = ShaderConfigUtils.configToURLParams(config);
      
      expect(params.get('preset')).toBe('highPerformance');
    });

    it('should calculate performance score', () => {
      const highPerfConfig = applyPreset('highPerformance');
      const lowPerfConfig = applyPreset('performance');
      
      const highScore = ShaderConfigUtils.calculatePerformanceScore(highPerfConfig);
      const lowScore = ShaderConfigUtils.calculatePerformanceScore(lowPerfConfig);
      
      expect(lowScore).toBeGreaterThan(highScore); // Lower performance config should have higher score
      expect(highScore).toBeGreaterThanOrEqual(0);
      expect(lowScore).toBeLessThanOrEqual(100);
    });

    it('should suggest optimizations', () => {
      const heavyConfig = createShaderConfig()
        .core({ particleCount: 250, renderScale: 1.2 })
        .particles({ enableGlowEffects: true })
        .geometry({ enableVoronoiPatterns: true })
        .buildUnsafe();
      
      const suggestions = ShaderConfigUtils.suggestOptimizations(heavyConfig);
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('particle count'))).toBe(true);
    });

    it('should optimize configuration for performance', () => {
      const heavyConfig = createShaderConfig()
        .core({ particleCount: 250, renderScale: 1.2 })
        .particles({ enableGlowEffects: true })
        .buildUnsafe();
      
      const optimized = ShaderConfigUtils.optimizeForPerformance(heavyConfig);
      
      expect(optimized.core.particleCount).toBeLessThan(heavyConfig.core.particleCount);
      expect(optimized.core.renderScale).toBeLessThanOrEqual(heavyConfig.core.renderScale);
      expect(optimized.particles.enableGlowEffects).toBe(false);
    });
  });

  describe('Configuration Manager', () => {
    let manager: ShaderConfigurationManager;

    beforeEach(() => {
      manager = new ShaderConfigurationManager();
    });

    it('should initialize with default configuration', () => {
      const config = manager.getConfig();
      expect(config).toEqual(DEFAULT_SHADER_CONFIG);
    });

    it('should initialize with custom configuration', () => {
      const customConfig: Partial<CompleteShaderConfiguration> = {
        core: { intensity: 0.8 },
      };
      
      const customManager = new ShaderConfigurationManager(customConfig);
      const config = customManager.getConfig();
      
      expect(config.core.intensity).toBe(0.8);
      expect(config.particles).toEqual(DEFAULT_SHADER_CONFIG.particles); // Should have defaults
    });

    it('should update configuration with validation', () => {
      const updates: Partial<CompleteShaderConfiguration> = {
        core: { intensity: 0.7, animationSpeed: 1.2 },
        particles: { baseParticleCount: 120 },
      };

      const result = manager.updateConfig(updates);
      expect(result.isValid).toBe(true);

      const config = manager.getConfig();
      expect(config.core.intensity).toBe(0.7);
      expect(config.core.animationSpeed).toBe(1.2);
      expect(config.particles.baseParticleCount).toBe(120);
    });

    it('should reject invalid configuration updates', () => {
      const invalidUpdates: Partial<CompleteShaderConfiguration> = {
        core: { intensity: 1.5 }, // Invalid
      };

      const result = manager.updateConfig(invalidUpdates);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Configuration should remain unchanged
      const config = manager.getConfig();
      expect(config.core.intensity).toBe(DEFAULT_SHADER_CONFIG.core.intensity);
    });

    it('should apply presets', () => {
      const result = manager.applyPreset('highPerformance');
      expect(result.isValid).toBe(true);

      const config = manager.getConfig();
      expect(config.core.intensity).toBe(0.8);
      expect(config.core.particleCount).toBe(200);
    });

    it('should reset to defaults', () => {
      // First modify the configuration
      manager.updateConfig({ core: { intensity: 0.9 } });
      expect(manager.getConfig().core.intensity).toBe(0.9);

      // Then reset
      manager.resetToDefaults();
      expect(manager.getConfig()).toEqual(DEFAULT_SHADER_CONFIG);
    });

    it('should notify listeners of configuration changes', () => {
      let notificationCount = 0;
      let lastConfig: CompleteShaderConfiguration | null = null;

      const unsubscribe = manager.addListener((config) => {
        notificationCount++;
        lastConfig = config;
      });

      manager.updateConfig({ core: { intensity: 0.8 } });
      expect(notificationCount).toBe(1);
      expect(lastConfig?.core.intensity).toBe(0.8);

      manager.resetToDefaults();
      expect(notificationCount).toBe(2);
      expect(lastConfig).toEqual(DEFAULT_SHADER_CONFIG);

      // Unsubscribe and verify no more notifications
      unsubscribe();
      manager.updateConfig({ core: { intensity: 0.5 } });
      expect(notificationCount).toBe(2); // Should not increase
    });

    it('should generate shader uniforms', () => {
      manager.updateConfig({
        core: { intensity: 0.8, animationSpeed: 1.2 },
        colors: { primaryColor: { r: 1.0, g: 0.5, b: 0.2 } },
      });

      const uniforms = manager.getShaderUniforms();
      
      expect(uniforms.intensity).toBe(0.8);
      expect(uniforms.animationSpeed).toBe(1.2);
      expect(uniforms.primaryColor).toEqual([1.0, 0.5, 0.2]);
      expect(uniforms.particleCount).toBeLessThanOrEqual(100); // Should be clamped
    });

    it('should export and import configuration', () => {
      // Set up a custom configuration
      manager.updateConfig({
        core: { intensity: 0.7, animationSpeed: 1.1 },
        particles: { baseParticleCount: 80 },
      });

      // Export configuration
      const exported = manager.exportConfig();
      expect(typeof exported).toBe('string');

      // Create new manager and import
      const newManager = new ShaderConfigurationManager();
      const importResult = newManager.importConfig(exported);
      
      expect(importResult.isValid).toBe(true);
      expect(newManager.getConfig().core.intensity).toBe(0.7);
      expect(newManager.getConfig().core.animationSpeed).toBe(1.1);
      expect(newManager.getConfig().particles.baseParticleCount).toBe(80);
    });

    it('should handle invalid JSON import', () => {
      const result = manager.importConfig('invalid json');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Invalid JSON configuration');
    });

    it('should disable validation when requested', () => {
      manager.setValidationEnabled(false);
      
      const invalidUpdates: Partial<CompleteShaderConfiguration> = {
        core: { intensity: 1.5 }, // Would normally be invalid
      };

      const result = manager.updateConfig(invalidUpdates);
      expect(result.isValid).toBe(true); // Should pass without validation

      const config = manager.getConfig();
      expect(config.core.intensity).toBe(1.5); // Should accept invalid value
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined and null values gracefully', () => {
      const configWithUndefined: any = {
        core: {
          intensity: undefined,
          animationSpeed: null,
          interactionEnabled: undefined,
        },
      };

      const result = validateCompleteConfig(configWithUndefined);
      // Should not crash and should provide meaningful errors
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle empty objects', () => {
      const result = validateCompleteConfig({});
      expect(result.isValid).toBe(true); // Empty config should be valid
      expect(result.errors).toHaveLength(0);
    });

    it('should handle deeply nested invalid values', () => {
      const invalidConfig: any = {
        interaction: {
          zones: {
            repulsion: {
              threshold: 'invalid',
              strength: null,
            },
          },
        },
      };

      const result = validateCompleteConfig(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});