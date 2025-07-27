import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  AdaptiveQualityManager, 
  ShaderParameterOptimizer,
  CrossBrowserCompatibility 
} from '../utils/performanceOptimization';

// Enhanced shader configuration interfaces
interface EnhancedShaderBackgroundProps {
  className?: string;
  intensity?: number; // 0.0 to 1.0, controls overall effect strength
  interactionEnabled?: boolean; // Enable/disable mouse interactions
  particleCount?: number; // Number of particles (performance vs quality)
  animationSpeed?: number; // Speed multiplier for animations
  respectMotionPreference?: boolean; // Respect prefers-reduced-motion setting
  disableAnimations?: boolean; // Completely disable animations for accessibility
  ariaLabel?: string; // Custom ARIA label for screen readers
}

interface ThemeColors {
  primary: [number, number, number];
  accent: [number, number, number];
  background: [number, number, number];
  particle: [number, number, number];
}

interface PerformanceConfig {
  particleCount: number;
  animationSpeed: number;
  interactionEnabled: boolean;
  renderScale: number;
}

// Theme color mappings based on portfolio palette
const THEME_COLORS: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    primary: [0.96, 0.4, 0.26], // vermilion-500 normalized
    accent: [0.91, 0.24, 0.49], // sakura-500 normalized
    background: [1.0, 1.0, 1.0], // white
    particle: [0.43, 0.43, 0.43], // sumi-700 normalized
  },
  dark: {
    primary: [1.0, 0.45, 0.3], // vermilion-400 normalized
    accent: [0.95, 0.46, 0.57], // sakura-400 normalized
    background: [0.05, 0.05, 0.05], // near black
    particle: [0.69, 0.69, 0.69], // sumi-300 normalized
  },
};

// Performance configurations for different device types
const PERFORMANCE_CONFIGS: { [key: string]: PerformanceConfig } = {
  mobile: {
    particleCount: 50,
    animationSpeed: 0.7,
    interactionEnabled: false,
    renderScale: 0.8,
  },
  desktop: {
    particleCount: 150,
    animationSpeed: 1.0,
    interactionEnabled: true,
    renderScale: 1.0,
  },
  highEnd: {
    particleCount: 300,
    animationSpeed: 1.2,
    interactionEnabled: true,
    renderScale: 1.0,
  },
};

/**
 * Enhanced fragment shader with multi-layer system
 * 
 * This shader creates a sophisticated visual effect with multiple layers:
 * 1. Background gradient layer with subtle noise
 * 2. Geometric patterns (flowing lines, Voronoi cells)
 * 3. Particle system with physics simulation
 * 
 * All parameters are easily adjustable through uniforms for real-time customization.
 */
const fragmentShader = `
  // === CORE UNIFORMS ===
  // These control the fundamental behavior of the shader
  
  uniform float time;              // Current time in seconds (auto-updated)
  uniform vec2 resolution;         // Screen resolution in pixels (auto-updated)
  uniform vec2 mouse;              // Mouse position normalized 0-1 (auto-updated)
  uniform float intensity;         // Overall effect intensity (0.0-1.0)
  uniform float aspectRatio;       // Screen aspect ratio (auto-updated)
  
  // === COLOR UNIFORMS ===
  // Theme-responsive colors that adapt to light/dark mode
  
  uniform vec3 primaryColor;       // Primary theme color (RGB 0-1)
  uniform vec3 accentColor;        // Accent theme color (RGB 0-1)
  uniform vec3 backgroundColor;    // Background theme color (RGB 0-1)
  
  // === ANIMATION UNIFORMS ===
  // Control animation speed and behavior
  
  uniform float flowSpeed;         // Animation speed multiplier (0.1-3.0)
  uniform float themeTransition;   // Theme transition progress (0.0=light, 1.0=dark)
  
  // === PARTICLE SYSTEM UNIFORMS ===
  // Configure the particle layer behavior
  
  uniform float particleCount;     // Number of particles to render (10-300)
  uniform float brownianIntensity; // Particle movement randomness (0.0-3.0)
  uniform float particleLifecycle; // Particle lifecycle duration in seconds
  uniform bool enableDepthSimulation; // Enable depth-based particle effects
  uniform bool enableGlowEffects; // Enable particle glow rendering
  
  // === INTERACTION UNIFORMS ===
  // Mouse interaction system parameters
  
  uniform float interactionRadius; // Mouse interaction radius (0.0-1.0)
  uniform bool interactionEnabled; // Enable/disable mouse interactions
  uniform float repulsionStrength; // Particle repulsion strength (0.0-2.0)
  uniform float orbitalStrength;   // Orbital motion strength (0.0-1.0)
  uniform float attractionStrength; // Attraction force strength (0.0-1.0)
  
  // === GEOMETRY UNIFORMS ===
  // Geometric pattern layer configuration
  
  uniform bool enableFlowingLines;    // Enable flowing line patterns
  uniform float flowingLinesCount;    // Number of flowing lines (3-20)
  uniform bool enableVoronoiPatterns; // Enable Voronoi cell patterns
  uniform float voronoiGridSize;      // Voronoi grid density (2.0-12.0)
  uniform bool enableSpiralPatterns;  // Enable spiral patterns
  uniform float spiralCount;          // Number of spiral arms (1-5)
  
  // === PERFORMANCE UNIFORMS ===
  // Quality and performance control
  
  uniform float renderScale;       // Render quality scale (0.4-1.2)
  uniform float qualityLevel;      // Current quality level (0.0-1.0)
  uniform float currentFrameRate;  // Current frame rate for auto-adjustment

  // === UTILITY FUNCTIONS ===
  // These functions provide mathematical operations used throughout the shader
  
  /**
   * Pseudo-random hash function for generating consistent random values
   * @param p Input coordinate
   * @return Random 2D vector in range [-1, 1]
   */
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  /**
   * Simplex noise function for organic, natural-looking randomness
   * Used for particle movement, background textures, and pattern variation
   * @param p Input coordinate
   * @return Noise value in range [-1, 1]
   */
  float noise(in vec2 p) {
    // Simplex noise constants for optimal distribution
    const float K1 = 0.366025404; // (3-sqrt(3))/6
    const float K2 = 0.211324865; // (sqrt(3)-1)/2
    
    // Skew input space to determine which simplex cell we're in
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    
    // Determine which simplex we are in
    vec2 o = step(a.yx, a.xy);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    
    // Calculate the contribution from the three corners
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    
    return dot(n, vec3(70.0));
  }

  /**
   * Smooth minimum function for blending shapes
   * Creates organic transitions between different elements
   * @param a First value
   * @param b Second value  
   * @param k Smoothing factor
   * @return Smoothly blended minimum
   */
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  /**
   * Rotation matrix for 2D transformations
   * Used for rotating patterns and particle movements
   * @param angle Rotation angle in radians
   * @return 2x2 rotation matrix
   */
  mat2 rotate(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
  }

  /**
   * PARTICLE SYSTEM LAYER
   * 
   * Creates a dynamic particle field with physics simulation and mouse interaction.
   * Each particle follows a base trajectory modified by Brownian motion and user interaction.
   * 
   * Key features:
   * - Configurable particle count via uniform
   * - Realistic physics with Brownian motion
   * - Multi-zone mouse interaction (repulsion, orbital, attraction)
   * - Depth-based size and opacity variation
   * - Smooth particle rendering with distance fields
   * 
   * Performance: O(n) where n = particleCount
   * Adjustable via: particleCount, brownianIntensity, interactionRadius uniforms
   */
  float particleLayer(vec2 uv) {
    float particles = 0.0;
    float animTime = time * flowSpeed;
    
    // Iterate through each particle (loop count controlled by particleCount uniform)
    for (float i = 0.0; i < particleCount; i += 1.0) {
      // Generate unique seed for each particle to ensure consistent behavior
      vec2 seed = vec2(i * 0.137, i * 0.269); // Golden ratio-based distribution
      
      // === BASE PARTICLE TRAJECTORY ===
      // Create smooth, predictable movement patterns using sine/cosine waves
      // Different frequencies create natural-looking orbital motions
      vec2 basePos = vec2(
        sin(animTime * 0.2 + i * 0.618) * 0.7,  // Horizontal oscillation
        cos(animTime * 0.15 + i * 0.866) * 0.5  // Vertical oscillation (different frequency)
      );
      
      // === BROWNIAN MOTION ===
      // Add organic randomness to particle movement using noise
      // Intensity controlled by brownianIntensity uniform
      vec2 brownianMotion = vec2(
        noise(seed + animTime * 0.08) * 0.15 * brownianIntensity,
        noise(seed.yx + animTime * 0.1) * 0.12 * brownianIntensity
      );
      
      // Combine base trajectory with Brownian motion
      vec2 pos = basePos + brownianMotion;
      
      // === MOUSE INTERACTION SYSTEM ===
      // Multi-zone interaction: repulsion (inner), orbital (middle), attraction (outer)
      vec2 mousePos = mouse * 2.0 - 1.0; // Convert mouse from [0,1] to [-1,1]
      float mouseDistance = length(pos - mousePos);
      vec2 mouseForce = vec2(0.0);
      
      // Only apply interaction if within radius and interaction is enabled
      if (mouseDistance < interactionRadius && interactionRadius > 0.0 && interactionEnabled) {
        vec2 direction = normalize(pos - mousePos);
        float normalizedDistance = mouseDistance / interactionRadius;
        
        // REPULSION ZONE (0-30% of radius)
        // Particles are strongly pushed away from mouse cursor
        if (normalizedDistance < 0.3) {
          float strength = pow(1.0 - normalizedDistance / 0.3, 3.0); // Cubic falloff
          mouseForce = direction * strength * repulsionStrength;
        } 
        // ORBITAL ZONE (30-70% of radius)  
        // Particles orbit around the mouse cursor
        else if (normalizedDistance < 0.7) {
          vec2 tangent = vec2(-direction.y, direction.x); // Perpendicular to radial direction
          float strength = sin((1.0 - normalizedDistance) * 3.14159) * orbitalStrength;
          float orbitalDirection = sin(i * 0.5) > 0.0 ? 1.0 : -1.0; // Alternate orbit direction
          mouseForce = tangent * strength * orbitalDirection;
          mouseForce += direction * -0.1 * (1.0 - normalizedDistance); // Slight inward pull
        } 
        // ATTRACTION ZONE (70-100% of radius)
        // Particles are gently pulled toward mouse cursor
        else {
          float strength = smoothstep(1.0, 0.7, normalizedDistance) * attractionStrength;
          mouseForce = -direction * strength;
        }
      }
      
      // Apply interaction force to particle position
      pos += mouseForce;
      
      // === PARTICLE VISUAL PROPERTIES ===
      // Create depth variation for visual interest
      float depth = sin(i * 0.314 + animTime * 0.3) * 0.5 + 0.5; // Oscillating depth [0,1]
      
      // Size and opacity based on depth (closer = larger & more opaque)
      float baseSize = enableDepthSimulation ? mix(0.001, 0.006, depth) : 0.003;
      float baseOpacity = enableDepthSimulation ? mix(0.2, 0.9, depth) : 0.6;
      
      // Apply quality scaling to particle size
      float size = baseSize * (0.5 + 0.5 * qualityLevel);
      float opacity = baseOpacity * intensity;
      
      // === PARTICLE RENDERING ===
      // Use distance field for smooth, anti-aliased particle rendering
      float dist = length(uv - pos);
      
      // Create soft particle with smooth falloff
      float particleCore = smoothstep(size * 3.0, size * 0.5, dist);
      
      // Add glow effect if enabled
      float particleGlow = enableGlowEffects ? 
        smoothstep(size * 6.0, size * 2.0, dist) * 0.3 : 0.0;
      
      float particleContribution = opacity * (particleCore + particleGlow);
      particles += particleContribution;
    }
    
    return particles;
  }

  /**
   * GEOMETRIC PATTERNS LAYER
   * 
   * Creates flowing geometric patterns that add structure and visual interest.
   * Combines multiple pattern types that can be individually enabled/disabled.
   * 
   * Pattern types:
   * - Flowing curved lines with dynamic curvature
   * - Voronoi cell boundaries with animated points
   * - Spiral patterns (when enabled)
   * - Hexagonal grids (when enabled)
   * 
   * Performance: Moderate - can be optimized by disabling unused patterns
   * Adjustable via: enableFlowingLines, enableVoronoiPatterns, flowingLinesCount uniforms
   */
  float geometricLayer(vec2 uv) {
    float geometry = 0.0;
    float animTime = time * flowSpeed;
    
    // === FLOWING LINES PATTERN ===
    // Creates smooth, curved lines that flow across the screen
    // Lines have dynamic curvature and move in different directions
    if (enableFlowingLines) {
      float lineCount = min(flowingLinesCount, 20.0); // Clamp for performance
      
      for (float i = 0.0; i < lineCount; i += 1.0) {
        // Calculate line angle (evenly distributed around circle)
        float angle = (i / lineCount) * 6.28318 + animTime * 0.08;
        vec2 direction = vec2(cos(angle), sin(angle));
        
        // Add dynamic curvature to make lines more organic
        float curvature = sin(animTime * 0.3 + i * 0.5) * 0.4;
        vec2 curvedDir = vec2(
          direction.x + curvature * direction.y,
          direction.y - curvature * direction.x
        );
        
        // Calculate line position with wave distortion
        float linePos = dot(uv, curvedDir) + sin(animTime * 0.4 + i * 0.7) * 0.5;
        
        // Create line with sinusoidal thickness variation
        float line = abs(sin(linePos * 2.0 + animTime * 1.2)) * 0.08;
        line = smoothstep(0.015, 0.005, line); // Smooth anti-aliased edges
        
        geometry += line * 0.25 * intensity;
      }
    }
    
    // === VORONOI PATTERNS ===
    // Creates cellular patterns with animated boundary points
    // Useful for organic, natural-looking backgrounds
    if (enableVoronoiPatterns) {
      vec2 grid = floor(uv * voronoiGridSize);
      vec2 gridUv = fract(uv * voronoiGridSize);
      
      float minDist = 1.0;
      
      // Check neighboring cells for closest Voronoi point
      for (float x = -1.0; x <= 1.0; x += 1.0) {
        for (float y = -1.0; y <= 1.0; y += 1.0) {
          vec2 neighbor = vec2(x, y);
          vec2 point = hash(grid + neighbor);
          
          // Animate Voronoi points for dynamic patterns
          point = 0.5 + 0.3 * sin(animTime * 0.2 + 6.2831 * point);
          
          float dist = length(neighbor + point - gridUv);
          minDist = min(minDist, dist);
        }
      }
      
      // Create edges at Voronoi cell boundaries
      float voronoiEdge = smoothstep(0.08, 0.02, minDist - 0.03) * 0.3;
      geometry += voronoiEdge * intensity;
    }
    
    // === SPIRAL PATTERNS ===
    // Creates rotating spiral arms emanating from center
    if (enableSpiralPatterns) {
      vec2 center = vec2(0.0, 0.0);
      vec2 toCenter = uv - center;
      float radius = length(toCenter);
      float angle = atan(toCenter.y, toCenter.x);
      
      for (float i = 0.0; i < spiralCount; i += 1.0) {
        // Calculate spiral equation: r = a * theta
        float spiralAngle = angle + animTime * 0.5 + i * (6.28318 / spiralCount);
        float spiralRadius = mod(spiralAngle * 0.1 + animTime * 0.3, 1.0);
        
        // Create spiral arm
        float spiralDist = abs(radius - spiralRadius);
        float spiral = smoothstep(0.1, 0.05, spiralDist) * 0.2;
        
        geometry += spiral * intensity;
      }
    }
    
    // === HEXAGONAL GRID ===
    // Creates a honeycomb-like hexagonal pattern
    // Disabled by default for performance but can be enabled
    if (enableHexagonalGrid) {
      // Hexagonal grid coordinates
      vec2 hexUv = uv * hexagonalGridScale;
      vec2 hexGrid = vec2(hexUv.x * 0.866, hexUv.y + hexUv.x * 0.5);
      vec2 hexId = floor(hexGrid);
      vec2 hexLocal = fract(hexGrid);
      
      // Distance to hexagon center
      float hexDist = max(abs(hexLocal.x - 0.5), abs(hexLocal.y - 0.5));
      float hexEdge = smoothstep(0.45, 0.4, hexDist) * 0.15;
      
      geometry += hexEdge * intensity;
    }
    
    return geometry;
  }

  /**
   * BACKGROUND GRADIENT LAYER
   * 
   * Creates a subtle, multi-point gradient background with noise overlay.
   * Provides visual depth and context for foreground elements.
   * 
   * Features:
   * - Multi-point radial gradients
   * - Subtle noise texture overlay
   * - Theme-responsive colors
   * - Smooth color transitions
   * 
   * Performance: Low impact
   * Adjustable via: backgroundColor, primaryColor, accentColor uniforms
   */
  vec3 backgroundLayer(vec2 uv) {
    // Create multiple gradient focal points for visual interest
    float gradient1 = length(uv - vec2(-0.5, 0.3)) * 0.8;  // Upper left focal point
    float gradient2 = length(uv - vec2(0.5, -0.3)) * 0.6;  // Lower right focal point
    
    // Add subtle noise texture for organic feel
    // Low frequency noise prevents banding and adds texture
    float noiseOverlay = noise(uv * 2.0 + time * 0.1) * 0.1 + 0.9;
    
    // Build gradient using theme colors
    vec3 bg = mix(backgroundColor, primaryColor * 0.1, 1.0 - gradient1);
    bg = mix(bg, accentColor * 0.05, 1.0 - gradient2);
    
    // Apply noise overlay for texture
    return bg * noiseOverlay;
  }

  /**
   * MAIN SHADER FUNCTION
   * 
   * Orchestrates all shader layers and combines them into the final output.
   * This is where all the magic happens - layer composition, color mixing,
   * and final rendering decisions.
   * 
   * Rendering pipeline:
   * 1. Setup UV coordinates and aspect ratio correction
   * 2. Generate all visual layers (background, geometry, particles)
   * 3. Mix colors with animated phase shifts
   * 4. Compose layers with proper blending
   * 5. Calculate final alpha for transparency
   * 6. Output final color
   */
  void main() {
    // === COORDINATE SETUP ===
    // Convert from screen coordinates to normalized UV coordinates
    vec2 uv = gl_FragCoord.xy / resolution.xy;  // [0,1] range
    uv = uv * 2.0 - 1.0;                        // Convert to [-1,1] range
    uv.x *= aspectRatio;                        // Correct for screen aspect ratio
    
    // === LAYER GENERATION ===
    // Generate all visual layers independently
    vec3 background = backgroundLayer(uv);      // Subtle gradient background
    float particles = particleLayer(uv);        // Dynamic particle system
    float geometry = geometricLayer(uv);        // Flowing geometric patterns
    
    // === COLOR ANIMATION ===
    // Create smooth color transitions using sine waves
    float colorPhase = sin(time * 0.3) * 0.5 + 0.5; // [0,1] oscillation
    
    // Mix theme colors based on animation phase
    vec3 particleColor = mix(primaryColor, accentColor, colorPhase);
    vec3 geometryColor = mix(accentColor * 0.8, primaryColor * 0.9, 1.0 - colorPhase);
    
    // === LAYER COMPOSITION ===
    // Start with background as base layer
    vec3 finalColor = background;
    
    // Blend geometry layer using additive mixing
    // Intensity controls overall effect strength
    finalColor = mix(
      finalColor, 
      finalColor + geometryColor * geometry, 
      geometry * intensity * 0.7
    );
    
    // Blend particle layer on top with higher intensity
    finalColor = mix(
      finalColor, 
      finalColor + particleColor * particles, 
      particles * intensity * 0.8
    );
    
    // === ALPHA CALCULATION ===
    // Calculate transparency based on layer contributions
    // Higher intensity = more opaque
    float totalAlpha = (particles + geometry * 0.7) * intensity * 0.9;
    
    // Ensure alpha doesn't exceed 1.0
    totalAlpha = min(totalAlpha, 1.0);
    
    // === FINAL OUTPUT ===
    // Output final color with calculated alpha
    gl_FragColor = vec4(finalColor, totalAlpha);
  }
`;

// Vertex shader
const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// Device detection utility
const detectDeviceType = (): keyof typeof PERFORMANCE_CONFIGS => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isHighEnd = navigator.hardwareConcurrency >= 8 && window.devicePixelRatio >= 2;

  if (isMobile) return 'mobile';
  if (isHighEnd) return 'highEnd';
  return 'desktop';
};

// CSS fallback for when WebGL is not available
const createCSSFallback = (container: HTMLElement, colors: any, intensity: number) => {
  const fallbackDiv = document.createElement('div');
  fallbackDiv.className = 'shader-fallback';
  fallbackDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    background: linear-gradient(135deg, 
      ${colors.background} 0%, 
      ${colors.primary}10 50%, 
      ${colors.accent}08 100%);
    opacity: ${intensity * 0.3};
  `;
  
  container.appendChild(fallbackDiv);
  return fallbackDiv;
};

const EnhancedShaderBackground = ({
  className = '',
  intensity = 0.6,
  interactionEnabled,
  particleCount,
  animationSpeed = 1.0,
  respectMotionPreference = true,
  disableAnimations = false,
  ariaLabel = "Animated background with floating particles and geometric patterns",
}: EnhancedShaderBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.Camera>();
  const renderer = useRef<THREE.WebGLRenderer>();
  const uniforms = useRef<{ [key: string]: THREE.IUniform }>();
  const mousePosition = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const fallbackElement = useRef<HTMLElement | null>(null);
  const isUsingFallback = useRef<boolean>(false);
  const qualityManager = useRef<AdaptiveQualityManager>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for motion preferences
    const prefersReducedMotion = respectMotionPreference && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const shouldDisableAnimations = disableAnimations || prefersReducedMotion;
    
    // If animations should be disabled, render a static fallback
    if (shouldDisableAnimations) {
      const isDark = document.documentElement.classList.contains('dark');
      const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
      
      fallbackElement.current = createCSSFallback(
        containerRef.current,
        {
          primary: `rgb(${themeColors.primary.map(c => Math.round(c * 255)).join(', ')})`,
          accent: `rgb(${themeColors.accent.map(c => Math.round(c * 255)).join(', ')})`,
          background: `rgb(${themeColors.background.map(c => Math.round(c * 255)).join(', ')})`,
        },
        intensity * 0.3
      );
      
      isUsingFallback.current = true;
      return;
    }

    // Initialize adaptive quality manager
    qualityManager.current = new AdaptiveQualityManager();
    
    // Apply browser-specific optimizations
    const browserOptimizations = CrossBrowserCompatibility.getBrowserOptimizations();
    qualityManager.current.forceQualityAdjustment(browserOptimizations);
    
    // Get initial optimized settings
    const optimizedSettings = qualityManager.current.getSettings();
    
    // Use prop values or fall back to optimized settings
    const finalParticleCount = particleCount ?? optimizedSettings.particleCount;
    const finalInteractionEnabled = interactionEnabled ?? optimizedSettings.interactionEnabled;

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      // WebGL not supported - use CSS fallback
      const isDark = document.documentElement.classList.contains('dark');
      const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
      
      fallbackElement.current = createCSSFallback(
        containerRef.current,
        {
          primary: `rgb(${themeColors.primary.map(c => Math.round(c * 255)).join(', ')})`,
          accent: `rgb(${themeColors.accent.map(c => Math.round(c * 255)).join(', ')})`,
          background: `rgb(${themeColors.background.map(c => Math.round(c * 255)).join(', ')})`,
        },
        intensity
      );
      
      isUsingFallback.current = true;
      return;
    }

    // Setup Three.js scene
    scene.current = new THREE.Scene();
    camera.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create renderer
    try {
      renderer.current = new THREE.WebGLRenderer({
        alpha: true,
        antialias: deviceType !== 'mobile',
        powerPreference: deviceType === 'mobile' ? 'low-power' : 'high-performance',
      });
    } catch (error) {
      // Fall back to CSS implementation
      const isDark = document.documentElement.classList.contains('dark');
      const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
      
      fallbackElement.current = createCSSFallback(
        containerRef.current,
        {
          primary: `rgb(${themeColors.primary.map(c => Math.round(c * 255)).join(', ')})`,
          accent: `rgb(${themeColors.accent.map(c => Math.round(c * 255)).join(', ')})`,
          background: `rgb(${themeColors.background.map(c => Math.round(c * 255)).join(', ')})`,
        },
        intensity
      );
      
      isUsingFallback.current = true;
      return;
    }

    const renderWidth = window.innerWidth * optimizedSettings.renderScale;
    const renderHeight = window.innerHeight * optimizedSettings.renderScale;

    renderer.current.setSize(renderWidth, renderHeight);
    renderer.current.setClearColor(0x000000, 0);

    // Scale canvas to full size if render scale is different
    if (optimizedSettings.renderScale !== 1.0) {
      renderer.current.domElement.style.width = `${window.innerWidth}px`;
      renderer.current.domElement.style.height = `${window.innerHeight}px`;
    }

    containerRef.current.appendChild(renderer.current.domElement);

    // Get current theme colors
    const isDark = document.documentElement.classList.contains('dark');
    const themeColors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    // Get optimized shader uniforms
    const capabilities = qualityManager.current.deviceDetector.detectCapabilities();
    const optimizedUniforms = ShaderParameterOptimizer.getOptimizedUniforms(optimizedSettings, capabilities);
    
    // Create shader uniforms with optimized values
    uniforms.current = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2(renderWidth, renderHeight) },
      mouse: { value: mousePosition.current },
      intensity: { value: intensity * optimizedUniforms.intensity },
      primaryColor: { value: new THREE.Vector3(...themeColors.primary) },
      accentColor: { value: new THREE.Vector3(...themeColors.accent) },
      backgroundColor: { value: new THREE.Vector3(...themeColors.background) },
      particleCount: { value: optimizedUniforms.particleCount },
      flowSpeed: { value: animationSpeed * optimizedUniforms.flowSpeed },
      interactionRadius: { value: optimizedUniforms.interactionRadius },
      themeTransition: { value: isDark ? 1.0 : 0.0 },
      aspectRatio: { value: renderWidth / renderHeight },
      
      // Enhanced uniforms from optimization
      brownianIntensity: { value: optimizedUniforms.brownianIntensity },
      enableDepthSimulation: { value: optimizedUniforms.enableDepthSimulation },
      enableGlowEffects: { value: optimizedUniforms.enableGlowEffects },
      repulsionStrength: { value: optimizedUniforms.repulsionStrength },
      orbitalStrength: { value: optimizedUniforms.orbitalStrength },
      attractionStrength: { value: optimizedUniforms.attractionStrength },
      enableFlowingLines: { value: optimizedUniforms.enableFlowingLines },
      flowingLinesCount: { value: optimizedUniforms.flowingLinesCount },
      enableVoronoiPatterns: { value: optimizedUniforms.enableVoronoiPatterns },
      voronoiGridSize: { value: optimizedUniforms.voronoiGridSize },
      enableSpiralPatterns: { value: optimizedUniforms.enableSpiralPatterns },
      spiralCount: { value: optimizedUniforms.spiralCount },
      renderScale: { value: optimizedUniforms.renderScale },
      qualityLevel: { value: optimizedUniforms.qualityLevel },
      currentFrameRate: { value: 60.0 },
    };

    // Create shader material
    let material: THREE.ShaderMaterial;
    try {
      material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: uniforms.current,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
    } catch (error) {
      console.warn('Shader compilation failed, using CSS fallback');
      const fallbackColors = {
        primary: `rgb(${themeColors.primary.map(c => Math.round(c * 255)).join(', ')})`,
        accent: `rgb(${themeColors.accent.map(c => Math.round(c * 255)).join(', ')})`,
        background: `rgb(${themeColors.background.map(c => Math.round(c * 255)).join(', ')})`,
      };
      
      fallbackElement.current = createCSSFallback(containerRef.current, fallbackColors, intensity);
      isUsingFallback.current = true;
      return;
    }

    // Create geometry and mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.current.add(mesh);

    // Mouse interaction handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!finalInteractionEnabled || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height;
      
      mousePosition.current.set(
        Math.max(0, Math.min(1, x)),
        Math.max(0, Math.min(1, y))
      );
    };

    // Window resize handler
    const handleResize = () => {
      if (!renderer.current || !uniforms.current || !qualityManager.current) return;
      
      const currentSettings = qualityManager.current.getSettings();
      const newRenderWidth = window.innerWidth * currentSettings.renderScale;
      const newRenderHeight = window.innerHeight * currentSettings.renderScale;
      
      renderer.current.setSize(newRenderWidth, newRenderHeight);
      
      if (currentSettings.renderScale !== 1.0) {
        renderer.current.domElement.style.width = `${window.innerWidth}px`;
        renderer.current.domElement.style.height = `${window.innerHeight}px`;
      }
      
      uniforms.current.resolution.value.set(newRenderWidth, newRenderHeight);
      uniforms.current.aspectRatio.value = newRenderWidth / newRenderHeight;
    };

    // Theme change handler
    const handleThemeChange = () => {
      if (!uniforms.current) return;
      
      const isDarkNow = document.documentElement.classList.contains('dark');
      const newThemeColors = isDarkNow ? THEME_COLORS.dark : THEME_COLORS.light;
      
      uniforms.current.primaryColor.value.set(...newThemeColors.primary);
      uniforms.current.accentColor.value.set(...newThemeColors.accent);
      uniforms.current.backgroundColor.value.set(...newThemeColors.background);
      uniforms.current.themeTransition.value = isDarkNow ? 1.0 : 0.0;
    };

    // Animation loop with performance monitoring
    const animate = (timestamp: number) => {
      if (!renderer.current || !scene.current || !camera.current || !uniforms.current || !qualityManager.current) return;
      
      // Update quality settings based on performance
      const currentSettings = qualityManager.current.updateQuality(timestamp);
      const metrics = qualityManager.current.getMetrics();
      
      // Update shader uniforms with current performance data
      uniforms.current.time.value = timestamp * 0.001;
      uniforms.current.currentFrameRate.value = metrics.frameRate;
      uniforms.current.qualityLevel.value = currentSettings.qualityLevel;
      
      // Apply dynamic quality adjustments
      if (uniforms.current.particleCount.value !== currentSettings.particleCount) {
        uniforms.current.particleCount.value = Math.min(currentSettings.particleCount, 300);
      }
      
      if (uniforms.current.renderScale.value !== currentSettings.renderScale) {
        uniforms.current.renderScale.value = currentSettings.renderScale;
      }
      
      // Mark render start for performance measurement
      performance.mark('shader-render-start');
      
      renderer.current.render(scene.current, camera.current);
      
      // Mark render end and measure
      performance.mark('shader-render-end');
      try {
        performance.measure('shader-render', 'shader-render-start', 'shader-render-end');
      } catch (error) {
        // Ignore measurement errors in browsers that don't support it
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Add event listeners
    if (finalInteractionEnabled) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);
    
    // Watch for theme changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Start animation
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (containerRef.current && finalInteractionEnabled) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      
      if (qualityManager.current) {
        qualityManager.current.dispose();
      }
      
      if (renderer.current && containerRef.current) {
        containerRef.current.removeChild(renderer.current.domElement);
        renderer.current.dispose();
      }
      
      if (fallbackElement.current && containerRef.current) {
        containerRef.current.removeChild(fallbackElement.current);
      }
    };
  }, [intensity, interactionEnabled, particleCount, animationSpeed, respectMotionPreference, disableAnimations]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      aria-hidden="true"
      aria-label={ariaLabel}
      data-testid="enhanced-shader-background"
      data-intensity={intensity}
      data-interaction-enabled={interactionEnabled ?? detectDeviceType() !== 'mobile'}
      data-using-fallback={isUsingFallback.current}
    />
  );
};

// Export with both names for backward compatibility
export default EnhancedShaderBackground;
export { EnhancedShaderBackground as BonsaiShaderBackground };