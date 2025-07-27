/**
 * Enhanced Shader Configuration System
 * 
 * This module provides a comprehensive configuration interface for the enhanced
 * portfolio shader system. It includes parameter validation, preset management,
 * and developer-friendly configuration options.
 * 
 * @author Portfolio Shader System
 * @version 1.0.0
 */

import { ColorRGB, BlendMode } from './shaderUtils';

/**
 * Core shader configuration interface with all customizable parameters
 */
export interface ShaderConfiguration {
  /** Overall effect intensity (0.0 to 1.0) */
  intensity: number;
  
  /** Animation speed multiplier (0.1 to 3.0) */
  animationSpeed: number;
  
  /** Enable/disable mouse interactions */
  interactionEnabled: boolean;
  
  /** Mouse interaction radius (0.0 to 1.0) */
  interactionRadius: number;
  
  /** Number of particles to render (10 to 300) */
  particleCount: number;
  
  /** Render quality scale (0.4 to 1.2) */
  renderScale: number;
  
  /** Theme transition progress (0.0 = light, 1.0 = dark) */
  themeTransition: number;
  
  /** Respect user's motion preferences */
  respectMotionPreference: boolean;
  
  /** Completely disable animations for accessibility */
  disableAnimations: boolean;
  
  /** Custom ARIA label for screen readers */
  ariaLabel: string;
}

/**
 * Particle system specific configuration
 */
export interface ParticleSystemConfiguration {
  /** Base particle count before device adjustments */
  baseParticleCount: number;
  
  /** Particle size variation range */
  sizeRange: {
    min: number;
    max: number;
  };
  
  /** Particle opacity range */
  opacityRange: {
    min: number;
    max: number;
  };
  
  /** Particle lifecycle duration in seconds */
  lifecycleDuration: number;
  
  /** Brownian motion intensity (0.0 to 2.0) */
  brownianIntensity: number;
  
  /** Enable particle depth simulation */
  enableDepthSimulation: boolean;
  
  /** Particle spawning edge fade distance */
  edgeFadeDistance: number;
  
  /** Enable particle glow effects */
  enableGlowEffects: boolean;
}

/**
 * Mouse interaction system configuration
 */
export interface MouseInteractionConfiguration {
  /** Base interaction radius */
  baseRadius: number;
  
  /** Dynamic radius adjustment based on velocity */
  dynamicRadiusEnabled: boolean;
  
  /** Maximum radius boost from velocity */
  maxRadiusBoost: number;
  
  /** Mouse position smoothing factor (0.01 to 1.0) */
  smoothingFactor: number;
  
  /** Interaction zones configuration */
  zones: {
    /** Inner repulsion zone (0.0 to 1.0 of radius) */
    repulsion: {
      threshold: number;
      strength: number;
    };
    /** Middle orbital zone */
    orbital: {
      threshold: number;
      strength: number;
    };
    /** Outer attraction zone */
    attraction: {
      threshold: number;
      strength: number;
    };
  };
  
  /** Enable mouse trail effects */
  enableTrailEffects: boolean;
  
  /** Trail effect intensity */
  trailIntensity: number;
}

/**
 * Geometric patterns configuration
 */
export interface GeometricPatternsConfiguration {
  /** Enable flowing curved lines */
  enableFlowingLines: boolean;
  
  /** Number of flowing lines (4 to 20) */
  flowingLinesCount: number;
  
  /** Line curvature intensity */
  lineCurvature: number;
  
  /** Enable Voronoi patterns */
  enableVoronoiPatterns: boolean;
  
  /** Voronoi grid density (2.0 to 10.0) */
  voronoiGridSize: number;
  
  /** Enable fluid mesh patterns */
  enableFluidMesh: boolean;
  
  /** Fluid mesh scale factor */
  fluidMeshScale: number;
  
  /** Enable spiral patterns */
  enableSpiralPatterns: boolean;
  
  /** Number of spiral arms (1 to 5) */
  spiralCount: number;
  
  /** Enable hexagonal grid */
  enableHexagonalGrid: boolean;
  
  /** Hexagonal grid scale */
  hexagonalGridScale: number;
  
  /** Enable organic noise patterns */
  enableOrganicPatterns: boolean;
  
  /** Organic pattern complexity (1 to 5 octaves) */
  organicComplexity: number;
}

/**
 * Color and theme configuration
 */
export interface ColorThemeConfiguration {
  /** Primary color in RGB (0.0 to 1.0) */
  primaryColor: ColorRGB;
  
  /** Accent color in RGB (0.0 to 1.0) */
  accentColor: ColorRGB;
  
  /** Background color in RGB (0.0 to 1.0) */
  backgroundColor: ColorRGB;
  
  /** Particle color in RGB (0.0 to 1.0) */
  particleColor: ColorRGB;
  
  /** Theme-responsive intensity boost for dark mode */
  darkModeIntensityBoost: number;
  
  /** Theme-responsive contrast boost for dark mode */
  darkModeContrastBoost: number;
  
  /** Theme-responsive glow multiplier for dark mode */
  darkModeGlowMultiplier: number;
  
  /** Color temperature adjustment (-1.0 to 1.0) */
  colorTemperature: number;
  
  /** Saturation boost (0.5 to 2.0) */
  saturationBoost: number;
  
  /** Contrast enhancement (0.5 to 2.0) */
  contrastEnhancement: number;
}

/**
 * Layer composition and blending configuration
 */
export interface LayerCompositionConfiguration {
  /** Particle layer depth (0.0 to 1.0) */
  particleLayerDepth: number;
  
  /** Geometry layer depth (0.0 to 1.0) */
  geometryLayerDepth: number;
  
  /** Background layer depth (0.0 to 1.0) */
  backgroundLayerDepth: number;
  
  /** Particle layer blend mode */
  particleBlendMode: BlendMode;
  
  /** Geometry layer blend mode */
  geometryBlendMode: BlendMode;
  
  /** Background layer blend mode */
  backgroundBlendMode: BlendMode;
  
  /** Enable atmospheric perspective */
  enableAtmosphericPerspective: boolean;
  
  /** Atmospheric perspective intensity */
  atmosphericIntensity: number;
  
  /** Enable depth-based vignette effect */
  enableVignetteEffect: boolean;
  
  /** Vignette effect strength */
  vignetteStrength: number;
}

/**
 * Performance and optimization configuration
 */
export interface PerformanceConfiguration {
  /** Enable automatic quality adjustment */
  enableAutoQuality: boolean;
  
  /** Target frame rate for quality adjustment */
  targetFrameRate: number;
  
  /** Quality adjustment sensitivity */
  qualityAdjustmentSensitivity: number;
  
  /** Enable device capability detection */
  enableDeviceDetection: boolean;
  
  /** Force specific device tier (overrides detection) */
  forceDeviceTier?: 'low' | 'medium' | 'high';
  
  /** Enable WebGL context loss recovery */
  enableContextRecovery: boolean;
  
  /** Maximum shader compilation retries */
  maxCompilationRetries: number;
  
  /** Enable performance monitoring */
  enablePerformanceMonitoring: boolean;
  
  /** Performance monitoring interval in milliseconds */
  monitoringInterval: number;
}

/**
 * Complete shader configuration combining all subsystems
 */
export interface CompleteShaderConfiguration {
  core: ShaderConfiguration;
  particles: ParticleSystemConfiguration;
  interaction: MouseInteractionConfiguration;
  geometry: GeometricPatternsConfiguration;
  colors: ColorThemeConfiguration;
  layers: LayerCompositionConfiguration;
  performance: PerformanceConfiguration;
}

/**
 * Configuration validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedConfig?: Partial<CompleteShaderConfiguration>;
}

/**
 * Default shader configuration values
 */
export const DEFAULT_SHADER_CONFIG: CompleteShaderConfiguration = {
  core: {
    intensity: 0.6,
    animationSpeed: 1.0,
    interactionEnabled: true,
    interactionRadius: 0.3,
    particleCount: 100,
    renderScale: 1.0,
    themeTransition: 0.0,
    respectMotionPreference: true,
    disableAnimations: false,
    ariaLabel: "Animated background with floating particles and geometric patterns",
  },
  particles: {
    baseParticleCount: 100,
    sizeRange: { min: 0.001, max: 0.006 },
    opacityRange: { min: 0.2, max: 0.9 },
    lifecycleDuration: 8.0,
    brownianIntensity: 1.0,
    enableDepthSimulation: true,
    edgeFadeDistance: 0.2,
    enableGlowEffects: true,
  },
  interaction: {
    baseRadius: 0.3,
    dynamicRadiusEnabled: true,
    maxRadiusBoost: 0.2,
    smoothingFactor: 0.1,
    zones: {
      repulsion: { threshold: 0.3, strength: 0.8 },
      orbital: { threshold: 0.7, strength: 0.3 },
      attraction: { threshold: 1.0, strength: 0.2 },
    },
    enableTrailEffects: true,
    trailIntensity: 1.0,
  },
  geometry: {
    enableFlowingLines: true,
    flowingLinesCount: 12,
    lineCurvature: 0.4,
    enableVoronoiPatterns: true,
    voronoiGridSize: 6.0,
    enableFluidMesh: true,
    fluidMeshScale: 3.0,
    enableSpiralPatterns: true,
    spiralCount: 3,
    enableHexagonalGrid: true,
    hexagonalGridScale: 4.0,
    enableOrganicPatterns: true,
    organicComplexity: 3,
  },
  colors: {
    primaryColor: { r: 0.96, g: 0.40, b: 0.26 }, // vermilion-500
    accentColor: { r: 0.91, g: 0.24, b: 0.49 },  // sakura-500
    backgroundColor: { r: 1.0, g: 1.0, b: 1.0 }, // white
    particleColor: { r: 0.43, g: 0.43, b: 0.43 }, // sumi-700
    darkModeIntensityBoost: 1.3,
    darkModeContrastBoost: 1.2,
    darkModeGlowMultiplier: 1.4,
    colorTemperature: 0.0,
    saturationBoost: 1.2,
    contrastEnhancement: 1.1,
  },
  layers: {
    particleLayerDepth: 0.8,
    geometryLayerDepth: 0.5,
    backgroundLayerDepth: 0.2,
    particleBlendMode: 'screen',
    geometryBlendMode: 'overlay',
    backgroundBlendMode: 'normal',
    enableAtmosphericPerspective: true,
    atmosphericIntensity: 0.1,
    enableVignetteEffect: true,
    vignetteStrength: 0.2,
  },
  performance: {
    enableAutoQuality: true,
    targetFrameRate: 60,
    qualityAdjustmentSensitivity: 0.1,
    enableDeviceDetection: true,
    enableContextRecovery: true,
    maxCompilationRetries: 3,
    enablePerformanceMonitoring: true,
    monitoringInterval: 1000,
  },
};

/**
 * Predefined configuration presets for different use cases
 */
export const SHADER_PRESETS = {
  /** High-performance preset for powerful devices */
  highPerformance: {
    core: {
      intensity: 0.8,
      animationSpeed: 1.2,
      interactionEnabled: true,
      interactionRadius: 0.35,
      particleCount: 200,
      renderScale: 1.0,
      themeTransition: 0.0,
      respectMotionPreference: true,
      disableAnimations: false,
      ariaLabel: "High-performance animated background with particles and geometric patterns",
    },
    particles: {
      baseParticleCount: 200,
      sizeRange: { min: 0.001, max: 0.008 },
      opacityRange: { min: 0.2, max: 0.9 },
      lifecycleDuration: 10.0,
      brownianIntensity: 1.2,
      enableDepthSimulation: true,
      edgeFadeDistance: 0.2,
      enableGlowEffects: true,
    },
    geometry: {
      enableFlowingLines: true,
      flowingLinesCount: 12,
      lineCurvature: 0.4,
      enableVoronoiPatterns: true,
      voronoiGridSize: 6.0,
      enableFluidMesh: true,
      fluidMeshScale: 3.0,
      enableSpiralPatterns: true,
      spiralCount: 3,
      enableHexagonalGrid: true,
      hexagonalGridScale: 4.0,
      enableOrganicPatterns: true,
      organicComplexity: 3,
    },
  } as Partial<CompleteShaderConfiguration>,

  /** Balanced preset for most devices */
  balanced: {
    core: {
      intensity: 0.6,
      animationSpeed: 1.0,
      interactionEnabled: true,
      interactionRadius: 0.3,
      particleCount: 100,
      renderScale: 0.9,
      themeTransition: 0.0,
      respectMotionPreference: true,
      disableAnimations: false,
      ariaLabel: "Balanced animated background with particles and geometric patterns",
    },
    particles: {
      baseParticleCount: 100,
      sizeRange: { min: 0.001, max: 0.006 },
      opacityRange: { min: 0.2, max: 0.8 },
      lifecycleDuration: 8.0,
      brownianIntensity: 1.0,
      enableDepthSimulation: true,
      edgeFadeDistance: 0.2,
      enableGlowEffects: true,
    },
    geometry: {
      enableFlowingLines: true,
      flowingLinesCount: 10,
      lineCurvature: 0.3,
      enableVoronoiPatterns: true,
      voronoiGridSize: 5.0,
      enableFluidMesh: true,
      fluidMeshScale: 3.0,
      enableSpiralPatterns: true,
      spiralCount: 3,
      enableHexagonalGrid: false,
      hexagonalGridScale: 4.0,
      enableOrganicPatterns: true,
      organicComplexity: 2,
    },
  } as Partial<CompleteShaderConfiguration>,

  /** Performance preset for mobile and low-end devices */
  performance: {
    core: {
      intensity: 0.4,
      animationSpeed: 0.8,
      interactionEnabled: false,
      interactionRadius: 0.0,
      particleCount: 50,
      renderScale: 0.7,
      themeTransition: 0.0,
      respectMotionPreference: true,
      disableAnimations: false,
      ariaLabel: "Performance-optimized animated background",
    },
    particles: {
      baseParticleCount: 50,
      sizeRange: { min: 0.002, max: 0.005 },
      opacityRange: { min: 0.3, max: 0.7 },
      lifecycleDuration: 6.0,
      brownianIntensity: 0.8,
      enableDepthSimulation: false,
      edgeFadeDistance: 0.15,
      enableGlowEffects: false,
    },
    geometry: {
      enableFlowingLines: true,
      flowingLinesCount: 6,
      lineCurvature: 0.2,
      enableVoronoiPatterns: false,
      voronoiGridSize: 4.0,
      enableFluidMesh: false,
      fluidMeshScale: 2.0,
      enableSpiralPatterns: false,
      spiralCount: 1,
      enableHexagonalGrid: false,
      hexagonalGridScale: 3.0,
      enableOrganicPatterns: false,
      organicComplexity: 1,
    },
  } as Partial<CompleteShaderConfiguration>,

  /** Minimal preset for accessibility and reduced motion */
  minimal: {
    core: {
      intensity: 0.2,
      animationSpeed: 0.3,
      interactionEnabled: false,
      interactionRadius: 0.0,
      particleCount: 20,
      renderScale: 0.6,
      themeTransition: 0.0,
      respectMotionPreference: true,
      disableAnimations: false,
      ariaLabel: "Minimal animated background with reduced motion",
    },
    particles: {
      baseParticleCount: 20,
      sizeRange: { min: 0.003, max: 0.004 },
      opacityRange: { min: 0.4, max: 0.6 },
      lifecycleDuration: 12.0,
      brownianIntensity: 0.3,
      enableDepthSimulation: false,
      edgeFadeDistance: 0.1,
      enableGlowEffects: false,
    },
    geometry: {
      enableFlowingLines: true,
      flowingLinesCount: 3,
      lineCurvature: 0.1,
      enableVoronoiPatterns: false,
      voronoiGridSize: 3.0,
      enableFluidMesh: false,
      fluidMeshScale: 2.0,
      enableSpiralPatterns: false,
      spiralCount: 1,
      enableHexagonalGrid: false,
      hexagonalGridScale: 3.0,
      enableOrganicPatterns: false,
      organicComplexity: 1,
    },
  } as Partial<CompleteShaderConfiguration>,
} as const;

/**
 * Basic validation for numeric values
 */
const validateNumericValue = (
  value: number,
  constraints: { min: number; max: number },
  fieldName: string
): { isValid: boolean; correctedValue?: number; error?: string } => {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      isValid: false,
      correctedValue: (constraints.min + constraints.max) / 2,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (value < constraints.min) {
    return {
      isValid: false,
      correctedValue: constraints.min,
      error: `${fieldName} (${value}) is below minimum (${constraints.min})`,
    };
  }

  if (value > constraints.max) {
    return {
      isValid: false,
      correctedValue: constraints.max,
      error: `${fieldName} (${value}) is above maximum (${constraints.max})`,
    };
  }

  return { isValid: true };
};

/**
 * Validates core shader configuration
 */
export const validateCoreConfig = (config: Partial<ShaderConfiguration>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const correctedConfig: Partial<ShaderConfiguration> = {};

  // Validate intensity
  if (config.intensity !== undefined) {
    const validation = validateNumericValue(config.intensity, { min: 0.0, max: 1.0 }, 'intensity');
    if (!validation.isValid) {
      errors.push(validation.error!);
      correctedConfig.intensity = validation.correctedValue;
    }
  }

  // Validate animation speed
  if (config.animationSpeed !== undefined) {
    const validation = validateNumericValue(config.animationSpeed, { min: 0.1, max: 3.0 }, 'animationSpeed');
    if (!validation.isValid) {
      errors.push(validation.error!);
      correctedConfig.animationSpeed = validation.correctedValue;
    }
  }

  // Validate particle count
  if (config.particleCount !== undefined) {
    const validation = validateNumericValue(config.particleCount, { min: 10, max: 300 }, 'particleCount');
    if (!validation.isValid) {
      errors.push(validation.error!);
      correctedConfig.particleCount = validation.correctedValue;
    }
    
    // Warning for high particle counts
    if (config.particleCount > 150) {
      warnings.push('High particle count may impact performance on mobile devices');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    correctedConfig: Object.keys(correctedConfig).length > 0 ? correctedConfig : undefined,
  };
};

/**
 * Validates complete shader configuration
 */
export const validateCompleteConfig = (config: Partial<CompleteShaderConfiguration>): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const correctedConfig: Partial<CompleteShaderConfiguration> = {};

  // Validate core section
  if (config.core !== undefined) {
    const coreValidation = validateCoreConfig(config.core);
    allErrors.push(...coreValidation.errors);
    allWarnings.push(...coreValidation.warnings);
    if (coreValidation.correctedConfig) {
      correctedConfig.core = coreValidation.correctedConfig;
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    correctedConfig: Object.keys(correctedConfig).length > 0 ? correctedConfig : undefined,
  };
};

/**
 * Merges partial configuration with defaults
 */
export const mergeWithDefaults = (partialConfig: Partial<CompleteShaderConfiguration>): CompleteShaderConfiguration => {
  return {
    core: { ...DEFAULT_SHADER_CONFIG.core, ...partialConfig.core },
    particles: { ...DEFAULT_SHADER_CONFIG.particles, ...partialConfig.particles },
    interaction: { ...DEFAULT_SHADER_CONFIG.interaction, ...partialConfig.interaction },
    geometry: { ...DEFAULT_SHADER_CONFIG.geometry, ...partialConfig.geometry },
    colors: { ...DEFAULT_SHADER_CONFIG.colors, ...partialConfig.colors },
    layers: { ...DEFAULT_SHADER_CONFIG.layers, ...partialConfig.layers },
    performance: { ...DEFAULT_SHADER_CONFIG.performance, ...partialConfig.performance },
  };
};

/**
 * Applies a preset configuration with optional overrides
 */
export const applyPreset = (
  presetName: keyof typeof SHADER_PRESETS,
  overrides?: Partial<CompleteShaderConfiguration>
): CompleteShaderConfiguration => {
  const preset = SHADER_PRESETS[presetName];
  const baseConfig = mergeWithDefaults(preset);
  
  if (overrides) {
    return mergeWithDefaults({ ...baseConfig, ...overrides });
  }
  
  return baseConfig;
};

/**
 * Configuration manager class for runtime shader configuration
 */
export class ShaderConfigurationManager {
  private config: CompleteShaderConfiguration;
  private listeners: Array<(config: CompleteShaderConfiguration) => void> = [];
  private validationEnabled: boolean = true;

  constructor(initialConfig?: Partial<CompleteShaderConfiguration>) {
    this.config = initialConfig ? mergeWithDefaults(initialConfig) : { ...DEFAULT_SHADER_CONFIG };
  }

  /**
   * Gets the current configuration
   */
  getConfig(): CompleteShaderConfiguration {
    return { ...this.config };
  }

  /**
   * Updates the configuration with validation
   */
  updateConfig(updates: Partial<CompleteShaderConfiguration>): ValidationResult {
    if (this.validationEnabled) {
      const validation = validateCompleteConfig(updates);
      
      if (!validation.isValid) {
        return validation;
      }
      
      // Apply corrected values if any
      const finalUpdates = validation.correctedConfig || updates;
      this.config = mergeWithDefaults({ ...this.config, ...finalUpdates });
    } else {
      this.config = mergeWithDefaults({ ...this.config, ...updates });
    }
    
    this.notifyListeners();
    
    return { isValid: true, errors: [], warnings: [] };
  }

  /**
   * Applies a preset configuration
   */
  applyPreset(presetName: keyof typeof SHADER_PRESETS, overrides?: Partial<CompleteShaderConfiguration>): ValidationResult {
    try {
      this.config = applyPreset(presetName, overrides);
      this.notifyListeners();
      return { isValid: true, errors: [], warnings: [] };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to apply preset "${presetName}": ${error}`],
        warnings: [],
      };
    }
  }

  /**
   * Resets configuration to defaults
   */
  resetToDefaults(): void {
    this.config = { ...DEFAULT_SHADER_CONFIG };
    this.notifyListeners();
  }

  /**
   * Adds a configuration change listener
   */
  addListener(listener: (config: CompleteShaderConfiguration) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Enables or disables validation
   */
  setValidationEnabled(enabled: boolean): void {
    this.validationEnabled = enabled;
  }

  /**
   * Exports configuration as JSON string
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Imports configuration from JSON string
   */
  importConfig(jsonConfig: string): ValidationResult {
    try {
      const parsedConfig = JSON.parse(jsonConfig) as Partial<CompleteShaderConfiguration>;
      return this.updateConfig(parsedConfig);
    } catch (error) {
      return {
        isValid: false,
        errors: [`Invalid JSON configuration: ${error}`],
        warnings: [],
      };
    }
  }

  /**
   * Generates shader uniforms from current configuration
   */
  getShaderUniforms(): Record<string, any> {
    const config = this.config;
    
    return {
      // Time and animation
      time: performance.now() * 0.001,
      animationSpeed: config.core.animationSpeed,
      
      // Screen and interaction (will be set by renderer)
      resolution: [1920, 1080], // Default, should be updated by renderer
      mouse: [0.5, 0.5], // Default, should be updated by interaction handler
      aspectRatio: 1920 / 1080, // Default, should be updated by renderer
      
      // Core parameters
      intensity: config.core.intensity,
      particleCount: Math.min(config.core.particleCount, 200), // Clamp for performance
      renderScale: config.core.renderScale,
      
      // Colors
      primaryColor: [config.colors.primaryColor.r, config.colors.primaryColor.g, config.colors.primaryColor.b],
      accentColor: [config.colors.accentColor.r, config.colors.accentColor.g, config.colors.accentColor.b],
      backgroundColor: [config.colors.backgroundColor.r, config.colors.backgroundColor.g, config.colors.backgroundColor.b],
      particleColor: [config.colors.particleColor.r, config.colors.particleColor.g, config.colors.particleColor.b],
      
      // Theme
      themeTransition: config.core.themeTransition,
      
      // Interaction
      interactionRadius: config.core.interactionEnabled ? config.interaction.baseRadius : 0.0,
      interactionEnabled: config.core.interactionEnabled,
      
      // Particle system
      brownianIntensity: config.particles.brownianIntensity,
      particleLifecycle: config.particles.lifecycleDuration,
      enableDepthSimulation: config.particles.enableDepthSimulation,
      enableGlowEffects: config.particles.enableGlowEffects,
      
      // Geometry
      enableFlowingLines: config.geometry.enableFlowingLines,
      flowingLinesCount: config.geometry.flowingLinesCount,
      enableVoronoiPatterns: config.geometry.enableVoronoiPatterns,
      voronoiGridSize: config.geometry.voronoiGridSize,
      enableSpiralPatterns: config.geometry.enableSpiralPatterns,
      spiralCount: config.geometry.spiralCount,
      
      // Performance
      currentFrameRate: 60, // Default
      targetFrameRate: config.performance.targetFrameRate,
      qualityLevel: 1.0, // Default
    };
  }

  /**
   * Notifies all listeners of configuration changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.config);
      } catch (error) {
        console.error('Error in configuration listener:', error);
      }
    });
  }
}