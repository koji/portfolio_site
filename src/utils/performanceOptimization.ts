/**
 * Performance Optimization Utilities for Enhanced Shader Background
 * 
 * This module provides comprehensive performance monitoring, optimization,
 * and cross-browser compatibility utilities for the enhanced shader system.
 */

export interface PerformanceMetrics {
  frameRate: number;
  frameTime: number;
  memoryUsage: number;
  gpuMemoryUsage?: number;
  renderTime: number;
  lastFrameTimestamp: number;
}

export interface DeviceCapabilities {
  webglVersion: number;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  extensions: string[];
  vendor: string;
  renderer: string;
  isHighPerformance: boolean;
  isMobile: boolean;
  supportsFloatTextures: boolean;
  supportsHalfFloatTextures: boolean;
}

export interface OptimizationSettings {
  particleCount: number;
  renderScale: number;
  animationSpeed: number;
  interactionEnabled: boolean;
  qualityLevel: number; // 0.0 to 1.0
  enableAdvancedEffects: boolean;
  targetFrameRate: number;
}

/**
 * Performance Monitor Class
 * 
 * Continuously monitors shader performance and provides optimization recommendations
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private frameTimeHistory: number[] = [];
  private readonly maxHistoryLength = 60; // 1 second at 60fps
  private performanceObserver?: PerformanceObserver;
  private memoryCheckInterval?: number;
  
  public metrics: PerformanceMetrics = {
    frameRate: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    renderTime: 0,
    lastFrameTimestamp: 0,
  };

  constructor() {
    this.initializePerformanceObserver();
    this.startMemoryMonitoring();
  }

  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.entryType === 'measure' && entry.name.includes('shader-render')) {
              this.metrics.renderTime = entry.duration;
            }
          }
        });
        
        this.performanceObserver.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  private startMemoryMonitoring(): void {
    // Check memory usage every 5 seconds
    this.memoryCheckInterval = window.setInterval(() => {
      this.updateMemoryMetrics();
    }, 5000);
  }

  private updateMemoryMetrics(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
    }
  }

  /**
   * Update frame metrics - call this every frame
   */
  public updateFrame(timestamp: number): void {
    if (this.lastTime === 0) {
      this.lastTime = timestamp;
      return;
    }

    const deltaTime = timestamp - this.lastTime;
    this.frameTimeHistory.push(deltaTime);
    
    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
    }

    // Calculate average frame time over the last second
    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    
    this.metrics.frameTime = avgFrameTime;
    this.metrics.frameRate = 1000 / avgFrameTime;
    this.metrics.lastFrameTimestamp = timestamp;
    
    this.lastTime = timestamp;
    this.frameCount++;
  }

  /**
   * Get performance recommendations based on current metrics
   */
  public getOptimizationRecommendations(): Partial<OptimizationSettings> {
    const recommendations: Partial<OptimizationSettings> = {};
    
    // Frame rate based optimizations
    if (this.metrics.frameRate < 30) {
      recommendations.particleCount = Math.max(20, Math.floor(this.metrics.frameRate * 2));
      recommendations.renderScale = 0.6;
      recommendations.qualityLevel = 0.3;
      recommendations.enableAdvancedEffects = false;
      recommendations.interactionEnabled = false;
    } else if (this.metrics.frameRate < 45) {
      recommendations.particleCount = Math.max(50, Math.floor(this.metrics.frameRate * 2));
      recommendations.renderScale = 0.8;
      recommendations.qualityLevel = 0.6;
      recommendations.enableAdvancedEffects = false;
    } else if (this.metrics.frameRate < 55) {
      recommendations.renderScale = 0.9;
      recommendations.qualityLevel = 0.8;
    }

    // Memory based optimizations
    if (this.metrics.memoryUsage > 200) { // 200MB threshold
      recommendations.particleCount = Math.min(recommendations.particleCount || 100, 75);
      recommendations.enableAdvancedEffects = false;
    }

    return recommendations;
  }

  /**
   * Check if performance is acceptable
   */
  public isPerformanceAcceptable(): boolean {
    return this.metrics.frameRate >= 30 && this.metrics.memoryUsage < 300;
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
  }
}

/**
 * Device Capability Detection
 * 
 * Detects device capabilities and provides optimization recommendations
 */
export class DeviceCapabilityDetector {
  private capabilities: DeviceCapabilities | null = null;

  /**
   * Detect device capabilities using WebGL context
   */
  public detectCapabilities(): DeviceCapabilities {
    if (this.capabilities) {
      return this.capabilities;
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      // Fallback for devices without WebGL
      this.capabilities = {
        webglVersion: 0,
        maxTextureSize: 0,
        maxVertexUniforms: 0,
        maxFragmentUniforms: 0,
        extensions: [],
        vendor: 'unknown',
        renderer: 'unknown',
        isHighPerformance: false,
        isMobile: this.isMobileDevice(),
        supportsFloatTextures: false,
        supportsHalfFloatTextures: false,
      };
      return this.capabilities;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const extensions = (typeof gl.getSupportedExtensions === 'function' ? gl.getSupportedExtensions() : []) || [];
    
    // Safe WebGL2 detection for test environments
    let webglVersion = 1;
    try {
      if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
        webglVersion = 2;
      }
    } catch (error) {
      // WebGL2RenderingContext might not be available in test environment
      webglVersion = 1;
    }
    
    this.capabilities = {
      webglVersion,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 1024,
      maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) || 128,
      maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) || 128,
      extensions,
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
      isHighPerformance: this.isHighPerformanceDevice(),
      isMobile: this.isMobileDevice(),
      supportsFloatTextures: extensions.includes('OES_texture_float'),
      supportsHalfFloatTextures: extensions.includes('OES_texture_half_float'),
    };

    // Clean up
    canvas.remove();
    
    return this.capabilities;
  }

  private isHighPerformanceDevice(): boolean {
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    return hardwareConcurrency >= 8 && deviceMemory >= 8 && devicePixelRatio >= 2;
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Get recommended settings based on device capabilities
   */
  public getRecommendedSettings(): OptimizationSettings {
    const caps = this.detectCapabilities();
    
    if (caps.isMobile) {
      return {
        particleCount: 30,
        renderScale: 0.7,
        animationSpeed: 0.8,
        interactionEnabled: false,
        qualityLevel: 0.4,
        enableAdvancedEffects: false,
        targetFrameRate: 30,
      };
    }
    
    if (caps.isHighPerformance) {
      return {
        particleCount: 200,
        renderScale: 1.0,
        animationSpeed: 1.2,
        interactionEnabled: true,
        qualityLevel: 1.0,
        enableAdvancedEffects: true,
        targetFrameRate: 60,
      };
    }
    
    // Default desktop settings
    return {
      particleCount: 100,
      renderScale: 0.9,
      animationSpeed: 1.0,
      interactionEnabled: true,
      qualityLevel: 0.8,
      enableAdvancedEffects: true,
      targetFrameRate: 60,
    };
  }
}

/**
 * Cross-Browser Compatibility Utilities
 */
export class CrossBrowserCompatibility {
  /**
   * Check if WebGL is supported
   */
  public static isWebGLSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      canvas.remove();
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if WebGL2 is supported
   */
  public static isWebGL2Supported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      canvas.remove();
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get browser-specific optimizations
   */
  public static getBrowserOptimizations(): Partial<OptimizationSettings> {
    const userAgent = navigator.userAgent.toLowerCase();
    const optimizations: Partial<OptimizationSettings> = {};

    // Safari optimizations
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      optimizations.renderScale = 0.8;
      optimizations.particleCount = 80;
      optimizations.enableAdvancedEffects = false;
    }
    
    // Firefox optimizations
    else if (userAgent.includes('firefox')) {
      optimizations.renderScale = 0.9;
      optimizations.qualityLevel = 0.9;
    }
    
    // Chrome/Edge optimizations
    else if (userAgent.includes('chrome') || userAgent.includes('edg')) {
      optimizations.qualityLevel = 1.0;
      optimizations.enableAdvancedEffects = true;
    }

    // Mobile browser optimizations
    if (userAgent.includes('mobile')) {
      optimizations.particleCount = 40;
      optimizations.renderScale = 0.6;
      optimizations.interactionEnabled = false;
      optimizations.targetFrameRate = 30;
    }

    return optimizations;
  }

  /**
   * Check for specific browser bugs and workarounds
   */
  public static getBrowserWorkarounds(): { [key: string]: boolean } {
    const userAgent = navigator.userAgent.toLowerCase();
    
    return {
      // Safari has issues with certain WebGL extensions
      disableFloatTextures: userAgent.includes('safari') && !userAgent.includes('chrome'),
      
      // Firefox sometimes has context loss issues
      enableContextLossWorkaround: userAgent.includes('firefox'),
      
      // Mobile browsers need reduced precision
      useReducedPrecision: userAgent.includes('mobile'),
      
      // Some Android browsers have shader compilation issues
      useSimplifiedShaders: userAgent.includes('android') && userAgent.includes('chrome/'),
    };
  }
}

/**
 * Adaptive Quality Manager
 * 
 * Automatically adjusts quality settings based on performance
 */
export class AdaptiveQualityManager {
  private performanceMonitor: PerformanceMonitor;
  private deviceDetector: DeviceCapabilityDetector;
  private currentSettings: OptimizationSettings;
  private adjustmentCooldown = 0;
  private readonly cooldownDuration = 2000; // 2 seconds

  constructor() {
    this.performanceMonitor = new PerformanceMonitor();
    this.deviceDetector = new DeviceCapabilityDetector();
    this.currentSettings = this.deviceDetector.getRecommendedSettings();
    
    // Apply browser-specific optimizations
    const browserOptimizations = CrossBrowserCompatibility.getBrowserOptimizations();
    this.currentSettings = { ...this.currentSettings, ...browserOptimizations };
  }

  /**
   * Update quality settings based on current performance
   */
  public updateQuality(timestamp: number): OptimizationSettings {
    this.performanceMonitor.updateFrame(timestamp);
    
    // Only adjust settings if cooldown has passed
    if (timestamp - this.adjustmentCooldown < this.cooldownDuration) {
      return this.currentSettings;
    }

    const recommendations = this.performanceMonitor.getOptimizationRecommendations();
    
    if (Object.keys(recommendations).length > 0) {
      // Apply recommendations gradually to avoid jarring changes
      this.currentSettings = this.blendSettings(this.currentSettings, recommendations, 0.3);
      this.adjustmentCooldown = timestamp;
    }

    return this.currentSettings;
  }

  private blendSettings(
    current: OptimizationSettings, 
    target: Partial<OptimizationSettings>, 
    factor: number
  ): OptimizationSettings {
    const blended = { ...current };
    
    Object.entries(target).forEach(([key, value]) => {
      if (typeof value === 'number' && typeof current[key as keyof OptimizationSettings] === 'number') {
        const currentValue = current[key as keyof OptimizationSettings] as number;
        blended[key as keyof OptimizationSettings] = currentValue + (value - currentValue) * factor as any;
      } else if (typeof value === 'boolean') {
        blended[key as keyof OptimizationSettings] = value as any;
      }
    });
    
    return blended;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return this.performanceMonitor.metrics;
  }

  /**
   * Get current optimization settings
   */
  public getSettings(): OptimizationSettings {
    return this.currentSettings;
  }

  /**
   * Force quality adjustment
   */
  public forceQualityAdjustment(settings: Partial<OptimizationSettings>): void {
    this.currentSettings = { ...this.currentSettings, ...settings };
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    this.performanceMonitor.dispose();
  }
}

/**
 * Shader Parameter Optimizer
 * 
 * Fine-tunes shader parameters for optimal visual impact and performance
 */
export class ShaderParameterOptimizer {
  /**
   * Get optimized shader uniforms based on device capabilities and performance
   */
  public static getOptimizedUniforms(
    settings: OptimizationSettings,
    capabilities: DeviceCapabilities
  ): { [key: string]: any } {
    const uniforms: { [key: string]: any } = {};

    // Particle system optimizations
    uniforms.particleCount = Math.min(settings.particleCount, capabilities.maxFragmentUniforms / 4);
    uniforms.brownianIntensity = settings.qualityLevel * 2.0;
    uniforms.enableDepthSimulation = settings.enableAdvancedEffects;
    uniforms.enableGlowEffects = settings.enableAdvancedEffects && settings.qualityLevel > 0.7;

    // Interaction system optimizations
    uniforms.interactionEnabled = settings.interactionEnabled;
    uniforms.interactionRadius = settings.interactionEnabled ? 0.3 : 0.0;
    uniforms.repulsionStrength = settings.qualityLevel * 1.5;
    uniforms.orbitalStrength = settings.qualityLevel * 0.8;
    uniforms.attractionStrength = settings.qualityLevel * 1.2;

    // Geometric pattern optimizations
    uniforms.enableFlowingLines = settings.qualityLevel > 0.3;
    uniforms.flowingLinesCount = Math.floor(settings.qualityLevel * 15 + 5);
    uniforms.enableVoronoiPatterns = settings.qualityLevel > 0.5;
    uniforms.voronoiGridSize = settings.qualityLevel * 8 + 4;
    uniforms.enableSpiralPatterns = settings.enableAdvancedEffects && settings.qualityLevel > 0.8;
    uniforms.spiralCount = Math.floor(settings.qualityLevel * 3 + 2);

    // Performance and quality uniforms
    uniforms.renderScale = settings.renderScale;
    uniforms.qualityLevel = settings.qualityLevel;
    uniforms.flowSpeed = settings.animationSpeed;
    uniforms.intensity = Math.min(1.0, settings.qualityLevel * 1.2);

    return uniforms;
  }

  /**
   * Get browser-specific shader modifications
   */
  public static getShaderModifications(): { [key: string]: string } {
    const workarounds = CrossBrowserCompatibility.getBrowserWorkarounds();
    const modifications: { [key: string]: string } = {};

    if (workarounds.useReducedPrecision) {
      modifications.precision = 'precision mediump float;';
    } else {
      modifications.precision = 'precision highp float;';
    }

    if (workarounds.disableFloatTextures) {
      modifications.textureType = 'vec4';
    }

    return modifications;
  }
}