/**
 * Utility functions for enhanced shader configuration and validation
 */

export interface ParticleSystemConfig {
  particleCount: number;
  animationSpeed: number;
  interactionEnabled: boolean;
  intensity: number;
}

/**
 * Validates and clamps particle system configuration values
 */
export const validateParticleConfig = (config: Partial<ParticleSystemConfig>): ParticleSystemConfig => {
  return {
    particleCount: Math.max(10, Math.min(config.particleCount || 100, 300)),
    animationSpeed: Math.max(0.1, Math.min(config.animationSpeed || 1.0, 3.0)),
    interactionEnabled: config.interactionEnabled ?? true,
    intensity: Math.max(0.0, Math.min(config.intensity || 0.6, 1.0)),
  };
};

/**
 * Calculates optimal particle count based on device capabilities
 */
export const calculateOptimalParticleCount = (
  baseCount: number,
  deviceType: 'mobile' | 'desktop' | 'highEnd'
): number => {
  const multipliers = {
    mobile: 0.5,
    desktop: 1.0,
    highEnd: 2.0,
  };

  return Math.floor(baseCount * multipliers[deviceType]);
};

/**
 * Generates particle physics parameters for realistic movement
 */
export const generateParticlePhysics = (particleIndex: number, time: number) => {
  // Use golden ratio and prime numbers for better distribution
  const goldenRatio = 1.618033988749;
  const prime1 = 0.137; // 1/7.3
  const prime2 = 0.269; // Approximation of 1/π - 1/4

  return {
    seed: {
      x: particleIndex * prime1,
      y: particleIndex * prime2,
    },
    baseFrequency: {
      x: 0.2 + (particleIndex % 7) * 0.05,
      y: 0.15 + (particleIndex % 5) * 0.03,
    },
    phaseOffset: {
      x: particleIndex * goldenRatio,
      y: particleIndex * (goldenRatio * 0.866), // 60 degree offset
    },
    amplitude: {
      primary: 0.7,
      secondary: 0.3,
    },
  };
};

/**
 * Calculates Brownian motion parameters for natural particle movement
 */
export const calculateBrownianMotion = (
  seed: { x: number; y: number },
  time: number,
  intensity: number = 1.0
) => {
  // Multiple octaves for more realistic noise
  const octave1Scale = 0.08;
  const octave2Scale = 0.12;
  const octave1Amplitude = 0.15 * intensity;
  const octave2Amplitude = 0.08 * intensity;

  return {
    octave1: {
      scale: octave1Scale,
      amplitude: octave1Amplitude,
      timeOffset: time * octave1Scale,
    },
    octave2: {
      scale: octave2Scale,
      amplitude: octave2Amplitude,
      timeOffset: time * octave2Scale,
    },
  };
};

/**
 * Validates mouse interaction parameters with enhanced multi-zone system
 */
export const validateMouseInteraction = (
  mousePos: { x: number; y: number },
  interactionRadius: number,
  particlePos: { x: number; y: number }
) => {
  const distance = Math.sqrt(
    Math.pow(mousePos.x - particlePos.x, 2) + Math.pow(mousePos.y - particlePos.y, 2)
  );

  const isInRange = distance < interactionRadius;
  const normalizedDistance = isInRange ? distance / interactionRadius : 1.0;
  
  let forceMagnitude = 0.0;
  let interactionType: 'repulsion' | 'orbital' | 'attraction' | 'none' = 'none';
  
  if (isInRange) {
    if (normalizedDistance < 0.3) {
      // Inner zone: Strong repulsion
      forceMagnitude = Math.pow(1.0 - normalizedDistance / 0.3, 3.0) * 0.8;
      interactionType = 'repulsion';
    } else if (normalizedDistance < 0.7) {
      // Middle zone: Orbital motion
      forceMagnitude = Math.sin((1.0 - normalizedDistance) * Math.PI) * 0.3;
      interactionType = 'orbital';
    } else {
      // Outer zone: Gentle attraction
      forceMagnitude = (1.0 - normalizedDistance) / 0.3 * 0.2;
      interactionType = 'attraction';
    }
  }

  const direction = {
    x: isInRange && distance > 0 ? (particlePos.x - mousePos.x) / distance : 0,
    y: isInRange && distance > 0 ? (particlePos.y - mousePos.y) / distance : 0,
  };

  // Calculate tangent for orbital motion
  const tangent = {
    x: -direction.y,
    y: direction.x,
  };

  return {
    distance,
    normalizedDistance,
    isInRange,
    forceMagnitude,
    interactionType,
    direction,
    tangent,
  };
};

/**
 * Calculates smooth mouse position interpolation
 */
export const interpolateMousePosition = (
  currentPos: { x: number; y: number },
  targetPos: { x: number; y: number },
  lerpFactor: number = 0.1
) => {
  return {
    x: currentPos.x + (targetPos.x - currentPos.x) * lerpFactor,
    y: currentPos.y + (targetPos.y - currentPos.y) * lerpFactor,
  };
};

/**
 * Calculates mouse velocity and applies smoothing
 */
export const calculateMouseVelocity = (
  previousPos: { x: number; y: number },
  currentPos: { x: number; y: number },
  deltaTime: number = 16.67 // ~60fps
) => {
  const velocity = {
    x: (currentPos.x - previousPos.x) / deltaTime * 1000, // Convert to units per second
    y: (currentPos.y - previousPos.y) / deltaTime * 1000,
  };

  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  
  return {
    velocity,
    magnitude,
    normalized: magnitude > 0 ? {
      x: velocity.x / magnitude,
      y: velocity.y / magnitude,
    } : { x: 0, y: 0 },
  };
};

/**
 * Calculates dynamic interaction radius based on mouse velocity
 */
export const calculateDynamicInteractionRadius = (
  baseRadius: number,
  mouseVelocity: number,
  maxBoost: number = 0.2
) => {
  const velocityBoost = Math.min(mouseVelocity * 0.1, maxBoost);
  return baseRadius + velocityBoost;
};

/**
 * Creates mouse trail effect parameters
 */
export const generateMouseTrail = (
  mousePos: { x: number; y: number },
  time: number,
  trailIntensity: number = 1.0
) => {
  return {
    x: Math.sin(time * 3.0 + mousePos.x * 10.0) * 0.02 * trailIntensity,
    y: Math.cos(time * 2.5 + mousePos.y * 8.0) * 0.015 * trailIntensity,
  };
};

/**
 * Geometric pattern utilities for enhanced visual effects
 */

/**
 * Calculates Bezier curve parameters for flowing lines
 */
export const calculateBezierFlow = (
  t: number,
  controlPoints: { x: number; y: number }[],
  curvature: number = 0.5
) => {
  if (controlPoints.length < 2) return { x: 0, y: 0 };
  
  // Simple quadratic Bezier for two points
  if (controlPoints.length === 2) {
    const [p0, p1] = controlPoints;
    return {
      x: (1 - t) * p0.x + t * p1.x,
      y: (1 - t) * p0.y + t * p1.y,
    };
  }
  
  // Cubic Bezier for three or more points
  const [p0, p1, p2] = controlPoints;
  const oneMinusT = 1 - t;
  
  return {
    x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
    y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
  };
};

/**
 * Generates Voronoi cell parameters
 */
export const generateVoronoiCell = (
  position: { x: number; y: number },
  gridSize: number = 4.0,
  time: number = 0
) => {
  const gridX = Math.floor(position.x * gridSize);
  const gridY = Math.floor(position.y * gridSize);
  const localX = (position.x * gridSize) % 1;
  const localY = (position.y * gridSize) % 1;
  
  let minDistance = Infinity;
  let closestPoint = { x: 0, y: 0 };
  
  // Check neighboring cells
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      // Generate pseudo-random point in cell
      const cellX = gridX + dx;
      const cellY = gridY + dy;
      const hash = Math.sin(cellX * 127.1 + cellY * 311.7) * 43758.5453;
      const pointX = 0.5 + 0.3 * Math.sin(time * 0.2 + hash * 6.2831);
      const pointY = 0.5 + 0.3 * Math.cos(time * 0.2 + hash * 6.2831);
      
      const distance = Math.sqrt(
        Math.pow(localX - (dx + pointX), 2) + Math.pow(localY - (dy + pointY), 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = { x: dx + pointX, y: dy + pointY };
      }
    }
  }
  
  return {
    distance: minDistance,
    closestPoint,
    cellBoundary: minDistance < 0.1 ? 1.0 - minDistance / 0.1 : 0.0,
  };
};

/**
 * Calculates hexagonal grid coordinates
 */
export const calculateHexagonalGrid = (position: { x: number; y: number }, scale: number = 4.0) => {
  const hexX = position.x * scale * 0.866025; // sqrt(3)/2
  const hexY = position.y * scale - position.x * scale * 0.5;
  
  const gridX = Math.floor(hexX + 0.5);
  const gridY = Math.floor(hexY + 0.5);
  
  const localX = hexX - gridX;
  const localY = hexY - gridY;
  
  // Distance to hexagon center
  const hexDistance = Math.max(
    Math.abs(localX),
    Math.max(Math.abs(localY), Math.abs(localX + localY))
  );
  
  return {
    gridPosition: { x: gridX, y: gridY },
    localPosition: { x: localX, y: localY },
    distanceToCenter: hexDistance,
    isInsideHex: hexDistance < 0.4,
  };
};

/**
 * Generates spiral pattern parameters
 */
export const generateSpiralPattern = (
  position: { x: number; y: number },
  time: number = 0,
  spiralCount: number = 3
) => {
  const radius = Math.sqrt(position.x * position.x + position.y * position.y);
  const angle = Math.atan2(position.y, position.x);
  const goldenAngle = 2.39996; // Golden angle in radians
  
  const spirals = [];
  
  for (let i = 0; i < spiralCount; i++) {
    const spiralPhase = angle + i * goldenAngle + time * 0.3;
    const spiralPattern = Math.sin(radius * 8.0 - spiralPhase * 3.0 + time);
    const spiralMask = Math.max(0, 1.0 - radius / 0.8); // Fade towards edges
    
    spirals.push({
      phase: spiralPhase,
      pattern: spiralPattern,
      mask: spiralMask,
      intensity: Math.max(0, 1.0 - Math.abs(spiralPattern) / 0.1) * spiralMask,
    });
  }
  
  return {
    radius,
    angle,
    spirals,
    combinedIntensity: spirals.reduce((sum, spiral) => sum + spiral.intensity, 0) / spiralCount,
  };
};

/**
 * Calculates fluid dynamics mesh deformation
 */
export const calculateFluidMesh = (
  position: { x: number; y: number },
  time: number = 0,
  scale: number = 3.0
) => {
  const fluidX = position.x * scale;
  const fluidY = position.y * scale;
  const fluidTime = time * 0.15;
  
  // Create flowing mesh pattern with multiple frequencies
  const meshX = Math.sin(fluidX + fluidTime) + Math.sin(fluidX * 2.0 + fluidTime * 1.3) * 0.5;
  const meshY = Math.cos(fluidY + fluidTime * 0.8) + Math.cos(fluidY * 2.0 + fluidTime * 1.1) * 0.5;
  
  // Calculate intersection intensity
  const intersectionX = Math.max(0, 1.0 - Math.abs(meshX) / 0.1);
  const intersectionY = Math.max(0, 1.0 - Math.abs(meshY) / 0.1);
  const intersection = intersectionX * intersectionY;
  
  return {
    meshX,
    meshY,
    intersection,
    flowDirection: {
      x: Math.cos(fluidTime + fluidX * 0.1),
      y: Math.sin(fluidTime * 0.8 + fluidY * 0.1),
    },
  };
};

/**
 * Multi-octave noise generation for organic patterns
 */
export const generateOrganicNoise = (
  position: { x: number; y: number },
  time: number = 0,
  octaves: number = 3,
  scale: number = 8.0
) => {
  let noise = 0;
  let amplitude = 1;
  let frequency = scale;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    // Simple pseudo-noise function (in real implementation, use proper Perlin noise)
    const x = position.x * frequency + time * 0.1;
    const y = position.y * frequency + time * 0.1;
    const noiseValue = Math.sin(x * 127.1 + y * 311.7) * Math.cos(x * 269.5 + y * 183.3);
    
    noise += noiseValue * amplitude;
    maxValue += amplitude;
    
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  
  return {
    value: noise / maxValue,
    threshold: 0.3 + 0.2 * Math.sin(time * 0.25),
    pattern: noise / maxValue > 0.3 + 0.2 * Math.sin(time * 0.25) ? 1.0 : 0.0,
  };
};

/**
 * Advanced blending mode utilities for layer composition
 */

export type BlendMode = 
  | 'normal' 
  | 'screen' 
  | 'overlay' 
  | 'softLight' 
  | 'colorDodge' 
  | 'multiply' 
  | 'add' 
  | 'subtract';

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Clamps color values to valid range [0, 1]
 */
export const clampColor = (color: ColorRGB): ColorRGB => ({
  r: Math.max(0, Math.min(1, color.r)),
  g: Math.max(0, Math.min(1, color.g)),
  b: Math.max(0, Math.min(1, color.b)),
});

/**
 * Screen blending mode - brightens the image
 */
export const screenBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => ({
  r: 1 - (1 - base.r) * (1 - overlay.r),
  g: 1 - (1 - base.g) * (1 - overlay.g),
  b: 1 - (1 - base.b) * (1 - overlay.b),
});

/**
 * Overlay blending mode - combines multiply and screen
 */
export const overlayBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => ({
  r: base.r < 0.5 ? 2 * base.r * overlay.r : 1 - 2 * (1 - base.r) * (1 - overlay.r),
  g: base.g < 0.5 ? 2 * base.g * overlay.g : 1 - 2 * (1 - base.g) * (1 - overlay.g),
  b: base.b < 0.5 ? 2 * base.b * overlay.b : 1 - 2 * (1 - base.b) * (1 - overlay.b),
});

/**
 * Soft light blending mode - subtle lighting effect
 */
export const softLightBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => {
  const softLightChannel = (baseChannel: number, overlayChannel: number): number => {
    if (overlayChannel < 0.5) {
      return baseChannel - (1 - 2 * overlayChannel) * baseChannel * (1 - baseChannel);
    } else {
      const d = baseChannel < 0.25 ? 
        ((16 * baseChannel - 12) * baseChannel + 4) * baseChannel : 
        Math.sqrt(baseChannel);
      return baseChannel + (2 * overlayChannel - 1) * (d - baseChannel);
    }
  };

  return {
    r: softLightChannel(base.r, overlay.r),
    g: softLightChannel(base.g, overlay.g),
    b: softLightChannel(base.b, overlay.b),
  };
};

/**
 * Color dodge blending mode - creates bright highlights
 */
export const colorDodgeBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => {
  const dodgeChannel = (baseChannel: number, overlayChannel: number): number => {
    if (overlayChannel >= 0.99) return 1;
    return Math.min(1, baseChannel / (1 - overlayChannel));
  };

  return {
    r: dodgeChannel(base.r, overlay.r),
    g: dodgeChannel(base.g, overlay.g),
    b: dodgeChannel(base.b, overlay.b),
  };
};

/**
 * Multiply blending mode - darkens the image
 */
export const multiplyBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => ({
  r: base.r * overlay.r,
  g: base.g * overlay.g,
  b: base.b * overlay.b,
});

/**
 * Additive blending mode - adds colors together
 */
export const additiveBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => 
  clampColor({
    r: base.r + overlay.r,
    g: base.g + overlay.g,
    b: base.b + overlay.b,
  });

/**
 * Subtractive blending mode - subtracts overlay from base
 */
export const subtractiveBlend = (base: ColorRGB, overlay: ColorRGB): ColorRGB => 
  clampColor({
    r: base.r - overlay.r,
    g: base.g - overlay.g,
    b: base.b - overlay.b,
  });

/**
 * Generic blend function that applies the specified blend mode
 */
export const blendColors = (
  base: ColorRGB, 
  overlay: ColorRGB, 
  mode: BlendMode, 
  opacity: number = 1.0
): ColorRGB => {
  let blended: ColorRGB;

  switch (mode) {
    case 'screen':
      blended = screenBlend(base, overlay);
      break;
    case 'overlay':
      blended = overlayBlend(base, overlay);
      break;
    case 'softLight':
      blended = softLightBlend(base, overlay);
      break;
    case 'colorDodge':
      blended = colorDodgeBlend(base, overlay);
      break;
    case 'multiply':
      blended = multiplyBlend(base, overlay);
      break;
    case 'add':
      blended = additiveBlend(base, overlay);
      break;
    case 'subtract':
      blended = subtractiveBlend(base, overlay);
      break;
    case 'normal':
    default:
      blended = overlay;
      break;
  }

  // Apply opacity
  return {
    r: base.r + (blended.r - base.r) * opacity,
    g: base.g + (blended.g - base.g) * opacity,
    b: base.b + (blended.b - base.b) * opacity,
  };
};

/**
 * Layer composition utilities
 */

export interface Layer {
  color: ColorRGB;
  alpha: number;
  depth: number;
  blendMode: BlendMode;
}

/**
 * Composes multiple layers with proper depth sorting and alpha blending
 */
export const composeLayers = (layers: Layer[]): { color: ColorRGB; alpha: number } => {
  // Sort layers by depth (back to front)
  const sortedLayers = [...layers].sort((a, b) => a.depth - b.depth);
  
  let result: ColorRGB = { r: 0, g: 0, b: 0 };
  let totalAlpha = 0;
  
  for (const layer of sortedLayers) {
    if (layer.alpha <= 0) continue;
    
    // Blend the layer color with the current result
    const blendedColor = blendColors(result, layer.color, layer.blendMode, layer.alpha);
    
    // Alpha compositing
    const layerContribution = layer.alpha * (1 - totalAlpha);
    result = {
      r: result.r * (1 - layerContribution) + blendedColor.r * layerContribution,
      g: result.g * (1 - layerContribution) + blendedColor.g * layerContribution,
      b: result.b * (1 - layerContribution) + blendedColor.b * layerContribution,
    };
    
    totalAlpha = Math.min(1, totalAlpha + layerContribution);
    
    // Early exit if fully opaque
    if (totalAlpha >= 0.99) break;
  }
  
  return { color: clampColor(result), alpha: totalAlpha };
};

/**
 * Calculates depth-based atmospheric perspective
 */
export const calculateAtmosphericPerspective = (
  color: ColorRGB,
  distance: number,
  atmosphereColor: ColorRGB = { r: 0.7, g: 0.8, b: 1.0 },
  intensity: number = 0.1
): ColorRGB => {
  const atmosphericFactor = Math.min(1, distance * intensity);
  
  return {
    r: color.r * (1 - atmosphericFactor) + atmosphereColor.r * atmosphericFactor,
    g: color.g * (1 - atmosphericFactor) + atmosphereColor.g * atmosphericFactor,
    b: color.b * (1 - atmosphericFactor) + atmosphereColor.b * atmosphericFactor,
  };
};

/**
 * Color grading utilities
 */

/**
 * Adjusts color temperature (warm/cool)
 */
export const adjustColorTemperature = (
  color: ColorRGB, 
  temperature: number = 0 // -1 (cool) to 1 (warm)
): ColorRGB => {
  const warmth = temperature * 0.1 + 1;
  const coolness = 2 - warmth;
  
  return clampColor({
    r: color.r * warmth,
    g: color.g,
    b: color.b * coolness,
  });
};

/**
 * Adjusts contrast
 */
export const adjustContrast = (color: ColorRGB, contrast: number = 1.0): ColorRGB => 
  clampColor({
    r: (color.r - 0.5) * contrast + 0.5,
    g: (color.g - 0.5) * contrast + 0.5,
    b: (color.b - 0.5) * contrast + 0.5,
  });

/**
 * Adjusts saturation
 */
export const adjustSaturation = (color: ColorRGB, saturation: number = 1.0): ColorRGB => {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  
  return clampColor({
    r: luminance + (color.r - luminance) * saturation,
    g: luminance + (color.g - luminance) * saturation,
    b: luminance + (color.b - luminance) * saturation,
  });
};

/**
 * Theme-responsive color utilities
 */

export interface ThemeTransition {
  progress: number; // 0.0 to 1.0, where 0 = light theme, 1 = dark theme
  duration: number; // Transition duration in milliseconds
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * Easing functions for smooth theme transitions
 */
export const easingFunctions = {
  linear: (t: number): number => t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 2),
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};

/**
 * Interpolates between light and dark theme colors
 */
export const interpolateThemeColors = (
  lightColor: ColorRGB,
  darkColor: ColorRGB,
  progress: number,
  easing: keyof typeof easingFunctions = 'easeOut'
): ColorRGB => {
  const easedProgress = easingFunctions[easing](Math.max(0, Math.min(1, progress)));
  
  return {
    r: lightColor.r + (darkColor.r - lightColor.r) * easedProgress,
    g: lightColor.g + (darkColor.g - lightColor.g) * easedProgress,
    b: lightColor.b + (darkColor.b - lightColor.b) * easedProgress,
  };
};

/**
 * Calculates theme-responsive intensity adjustments
 */
export const calculateThemeIntensity = (
  baseIntensity: number,
  themeProgress: number,
  lightMultiplier: number = 1.0,
  darkMultiplier: number = 1.3
): number => {
  const multiplier = lightMultiplier + (darkMultiplier - lightMultiplier) * themeProgress;
  return baseIntensity * multiplier;
};

/**
 * Calculates theme-responsive contrast adjustments
 */
export const calculateThemeContrast = (
  baseContrast: number,
  themeProgress: number,
  lightBoost: number = 1.0,
  darkBoost: number = 1.2
): number => {
  const boost = lightBoost + (darkBoost - lightBoost) * themeProgress;
  return baseContrast * boost;
};

/**
 * Calculates theme-responsive glow effects
 */
export const calculateThemeGlow = (
  baseGlow: number,
  themeProgress: number,
  lightGlow: number = 0.8,
  darkGlow: number = 1.4
): number => {
  return baseGlow * (lightGlow + (darkGlow - lightGlow) * themeProgress);
};

/**
 * Creates smooth theme transition manager
 */
export class ThemeTransitionManager {
  private currentProgress = 0;
  private targetProgress = 0;
  private transitionSpeed = 0.05;
  private easing: keyof typeof easingFunctions = 'easeOut';
  
  constructor(
    initialTheme: 'light' | 'dark' = 'light',
    transitionSpeed: number = 0.05,
    easing: keyof typeof easingFunctions = 'easeOut'
  ) {
    this.currentProgress = initialTheme === 'dark' ? 1.0 : 0.0;
    this.targetProgress = this.currentProgress;
    this.transitionSpeed = transitionSpeed;
    this.easing = easing;
  }
  
  /**
   * Sets the target theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.targetProgress = theme === 'dark' ? 1.0 : 0.0;
  }
  
  /**
   * Updates the transition progress (call this every frame)
   */
  update(): number {
    if (Math.abs(this.currentProgress - this.targetProgress) < 0.001) {
      this.currentProgress = this.targetProgress;
      return this.currentProgress;
    }
    
    this.currentProgress += (this.targetProgress - this.currentProgress) * this.transitionSpeed;
    return this.currentProgress;
  }
  
  /**
   * Gets the current transition progress with easing applied
   */
  getProgress(): number {
    return easingFunctions[this.easing](this.currentProgress);
  }
  
  /**
   * Checks if transition is complete
   */
  isTransitionComplete(): boolean {
    return Math.abs(this.currentProgress - this.targetProgress) < 0.001;
  }
  
  /**
   * Gets the current theme based on progress
   */
  getCurrentTheme(): 'light' | 'dark' {
    return this.currentProgress > 0.5 ? 'dark' : 'light';
  }
  
  /**
   * Sets transition speed
   */
  setTransitionSpeed(speed: number): void {
    this.transitionSpeed = Math.max(0.001, Math.min(1.0, speed));
  }
  
  /**
   * Sets easing function
   */
  setEasing(easing: keyof typeof easingFunctions): void {
    this.easing = easing;
  }
}

/**
 * Predefined theme color palettes
 */
export const THEME_PALETTES = {
  portfolio: {
    light: {
      primary: { r: 0.96, g: 0.40, b: 0.26 }, // vermilion-500
      accent: { r: 0.91, g: 0.24, b: 0.49 },  // sakura-500
      background: { r: 1.0, g: 1.0, b: 1.0 }, // white
      particle: { r: 0.43, g: 0.43, b: 0.43 }, // sumi-700
    },
    dark: {
      primary: { r: 1.0, g: 0.45, b: 0.30 },   // vermilion-400
      accent: { r: 0.95, g: 0.46, b: 0.57 },   // sakura-400
      background: { r: 0.05, g: 0.05, b: 0.05 }, // near black
      particle: { r: 0.69, g: 0.69, b: 0.69 }, // sumi-300
    },
  },
  ocean: {
    light: {
      primary: { r: 0.2, g: 0.6, b: 0.9 },
      accent: { r: 0.1, g: 0.8, b: 0.7 },
      background: { r: 0.95, g: 0.98, b: 1.0 },
      particle: { r: 0.3, g: 0.5, b: 0.8 },
    },
    dark: {
      primary: { r: 0.3, g: 0.7, b: 1.0 },
      accent: { r: 0.2, g: 0.9, b: 0.8 },
      background: { r: 0.05, g: 0.1, b: 0.15 },
      particle: { r: 0.4, g: 0.6, b: 0.9 },
    },
  },
  forest: {
    light: {
      primary: { r: 0.2, g: 0.7, b: 0.3 },
      accent: { r: 0.6, g: 0.8, b: 0.2 },
      background: { r: 0.98, g: 1.0, b: 0.95 },
      particle: { r: 0.3, g: 0.6, b: 0.2 },
    },
    dark: {
      primary: { r: 0.3, g: 0.8, b: 0.4 },
      accent: { r: 0.7, g: 0.9, b: 0.3 },
      background: { r: 0.05, g: 0.1, b: 0.05 },
      particle: { r: 0.4, g: 0.7, b: 0.3 },
    },
  },
};

/**
 * Gets theme colors from a palette
 */
export const getThemeColorsFromPalette = (
  palette: keyof typeof THEME_PALETTES,
  theme: 'light' | 'dark'
) => {
  return THEME_PALETTES[palette][theme];
};

/**
 * Responsive scaling utilities for different screen sizes and orientations
 */

export interface ResponsiveScalingConfig {
  baseWidth: number;
  baseHeight: number;
  minScale: number;
  maxScale: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    ultrawide: number;
  };
  aspectRatioThresholds: {
    portrait: number;
    square: number;
    landscape: number;
    ultrawide: number;
  };
}

export interface ViewportDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isUltrawide: boolean;
}

export interface ResponsiveShaderSettings {
  renderScale: number;
  particleCount: number;
  interactionRadius: number;
  animationSpeed: number;
  qualityLevel: number;
  enableComplexEffects: boolean;
  debounceDelay: number;
  transitionDuration: number;
}

/**
 * Default responsive scaling configuration
 */
export const DEFAULT_RESPONSIVE_CONFIG: ResponsiveScalingConfig = {
  baseWidth: 1920,
  baseHeight: 1080,
  minScale: 0.4,
  maxScale: 1.2,
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    ultrawide: 2560,
  },
  aspectRatioThresholds: {
    portrait: 0.75,
    square: 1.0,
    landscape: 1.33,
    ultrawide: 2.0,
  },
};

/**
 * Calculates viewport dimensions and characteristics
 */
export const calculateViewportDimensions = (): ViewportDimensions => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / height;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Determine orientation
  const orientation: 'portrait' | 'landscape' = aspectRatio < 1 ? 'portrait' : 'landscape';
  
  // Determine device type based on width and user agent
  let deviceType: 'mobile' | 'tablet' | 'desktop';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  
  if (width <= DEFAULT_RESPONSIVE_CONFIG.breakpoints.mobile || (isMobileUA && !isTabletUA)) {
    deviceType = 'mobile';
  } else if (width <= DEFAULT_RESPONSIVE_CONFIG.breakpoints.tablet || isTabletUA) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }
  
  // Check for ultrawide displays
  const isUltrawide = aspectRatio >= DEFAULT_RESPONSIVE_CONFIG.aspectRatioThresholds.ultrawide;
  
  return {
    width,
    height,
    aspectRatio,
    pixelRatio,
    orientation,
    deviceType,
    isUltrawide,
  };
};

/**
 * Calculates optimal render scale based on viewport and device capabilities
 */
export const calculateResponsiveRenderScale = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities,
  config: ResponsiveScalingConfig = DEFAULT_RESPONSIVE_CONFIG
): number => {
  let baseScale = 1.0;
  
  // Adjust based on device type
  switch (viewport.deviceType) {
    case 'mobile':
      baseScale = 0.6;
      break;
    case 'tablet':
      baseScale = 0.8;
      break;
    case 'desktop':
      baseScale = 1.0;
      break;
  }
  
  // Adjust based on device capabilities
  switch (deviceCapabilities.tier) {
    case 'low':
      baseScale *= 0.7;
      break;
    case 'medium':
      baseScale *= 0.9;
      break;
    case 'high':
      baseScale *= 1.1;
      break;
  }
  
  // Adjust for pixel ratio (high-DPI displays)
  if (viewport.pixelRatio > 2) {
    baseScale *= 0.8; // Reduce for very high DPI
  } else if (viewport.pixelRatio > 1.5) {
    baseScale *= 0.9; // Slight reduction for high DPI
  }
  
  // Adjust for screen size relative to base dimensions
  const widthRatio = viewport.width / config.baseWidth;
  const heightRatio = viewport.height / config.baseHeight;
  const sizeRatio = Math.sqrt(widthRatio * heightRatio); // Geometric mean
  
  baseScale *= Math.pow(sizeRatio, 0.3); // Gentle scaling with screen size
  
  // Clamp to configured limits
  return Math.max(config.minScale, Math.min(config.maxScale, baseScale));
};

/**
 * Calculates responsive shader settings based on viewport and capabilities
 */
export const calculateResponsiveShaderSettings = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities,
  baseSettings: Partial<ResponsiveShaderSettings> = {}
): ResponsiveShaderSettings => {
  const renderScale = calculateResponsiveRenderScale(viewport, deviceCapabilities);
  
  // Base particle count calculation
  let particleCount = 100;
  const screenComplexity = viewport.width * viewport.height / (1920 * 1080);
  
  // Adjust particle count based on screen size and device capabilities
  particleCount = Math.floor(particleCount * Math.sqrt(screenComplexity));
  
  switch (deviceCapabilities.tier) {
    case 'low':
      particleCount = Math.min(particleCount * 0.4, 40);
      break;
    case 'medium':
      particleCount = Math.min(particleCount * 0.7, 80);
      break;
    case 'high':
      particleCount = Math.min(particleCount * 1.2, 200);
      break;
  }
  
  // Mobile-specific adjustments
  if (viewport.deviceType === 'mobile') {
    particleCount = Math.min(particleCount, 60);
  }
  
  // Interaction radius based on screen size and device type
  let interactionRadius = 0.3;
  if (viewport.deviceType === 'mobile') {
    interactionRadius = 0.25; // Smaller radius for touch interfaces
  } else if (viewport.isUltrawide) {
    interactionRadius = 0.35; // Larger radius for ultrawide displays
  }
  
  // Animation speed adjustments
  let animationSpeed = 1.0;
  if (deviceCapabilities.tier === 'low') {
    animationSpeed = 0.7; // Slower animations for low-end devices
  } else if (viewport.deviceType === 'mobile') {
    animationSpeed = 0.8; // Slightly slower for mobile to save battery
  }
  
  // Quality level calculation
  let qualityLevel = deviceCapabilities.score;
  if (viewport.deviceType === 'mobile') {
    qualityLevel *= 0.8; // Reduce quality on mobile
  }
  
  // Complex effects enablement
  const enableComplexEffects = deviceCapabilities.tier !== 'low' && 
                              viewport.deviceType !== 'mobile';
  
  // Debounce and transition settings based on device performance
  const debounceDelay = deviceCapabilities.tier === 'low' ? 200 : 150;
  const transitionDuration = deviceCapabilities.tier === 'low' ? 400 : 300;
  
  return {
    renderScale,
    particleCount,
    interactionRadius,
    animationSpeed,
    qualityLevel,
    enableComplexEffects,
    debounceDelay,
    transitionDuration,
    ...baseSettings, // Allow overrides
  };
};

/**
 * Handles smooth transitions during window resize
 */
export class ResponsiveTransitionManager {
  private isTransitioning = false;
  private transitionStartTime = 0;
  private originalSettings: ResponsiveShaderSettings | null = null;
  private targetSettings: ResponsiveShaderSettings | null = null;
  private transitionDuration = 300;
  
  constructor(transitionDuration: number = 300) {
    this.transitionDuration = transitionDuration;
  }
  
  /**
   * Starts a transition from current settings to new settings
   */
  startTransition(
    currentSettings: ResponsiveShaderSettings,
    newSettings: ResponsiveShaderSettings
  ): void {
    this.originalSettings = { ...currentSettings };
    this.targetSettings = { ...newSettings };
    this.isTransitioning = true;
    this.transitionStartTime = performance.now();
  }
  
  /**
   * Updates the transition and returns current interpolated settings
   */
  updateTransition(): ResponsiveShaderSettings | null {
    if (!this.isTransitioning || !this.originalSettings || !this.targetSettings) {
      return null;
    }
    
    const elapsed = performance.now() - this.transitionStartTime;
    const progress = Math.min(elapsed / this.transitionDuration, 1.0);
    
    // Smooth easing function
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);
    
    // Interpolate settings
    const interpolatedSettings: ResponsiveShaderSettings = {
      renderScale: this.lerp(this.originalSettings.renderScale, this.targetSettings.renderScale, easedProgress),
      particleCount: Math.round(this.lerp(this.originalSettings.particleCount, this.targetSettings.particleCount, easedProgress)),
      interactionRadius: this.lerp(this.originalSettings.interactionRadius, this.targetSettings.interactionRadius, easedProgress),
      animationSpeed: this.lerp(this.originalSettings.animationSpeed, this.targetSettings.animationSpeed, easedProgress),
      qualityLevel: this.lerp(this.originalSettings.qualityLevel, this.targetSettings.qualityLevel, easedProgress),
      enableComplexEffects: progress > 0.5 ? this.targetSettings.enableComplexEffects : this.originalSettings.enableComplexEffects,
      debounceDelay: Math.round(this.lerp(this.originalSettings.debounceDelay, this.targetSettings.debounceDelay, easedProgress)),
      transitionDuration: this.targetSettings.transitionDuration,
    };
    
    // Check if transition is complete
    if (progress >= 1.0) {
      this.isTransitioning = false;
      this.originalSettings = null;
      this.targetSettings = null;
      return this.targetSettings;
    }
    
    return interpolatedSettings;
  }
  
  /**
   * Checks if currently transitioning
   */
  isActive(): boolean {
    return this.isTransitioning;
  }
  
  /**
   * Stops the current transition
   */
  stopTransition(): void {
    this.isTransitioning = false;
    this.originalSettings = null;
    this.targetSettings = null;
  }
  
  /**
   * Linear interpolation helper
   */
  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }
}

/**
 * Debounced resize handler for smooth performance
 */
export class ResponsiveResizeHandler {
  private timeoutId: number | null = null;
  private callback: (viewport: ViewportDimensions) => void;
  private debounceDelay: number;
  private lastDimensions: ViewportDimensions | null = null;
  
  constructor(
    callback: (viewport: ViewportDimensions) => void,
    debounceDelay: number = 150
  ) {
    this.callback = callback;
    this.debounceDelay = debounceDelay;
    
    // Bind event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }
  
  /**
   * Handles window resize events with debouncing
   */
  private handleResize(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = window.setTimeout(() => {
      const newDimensions = calculateViewportDimensions();
      
      // Only trigger callback if dimensions actually changed
      if (!this.lastDimensions || 
          this.lastDimensions.width !== newDimensions.width ||
          this.lastDimensions.height !== newDimensions.height) {
        
        this.lastDimensions = newDimensions;
        this.callback(newDimensions);
      }
    }, this.debounceDelay);
  }
  
  /**
   * Handles orientation change events (mobile)
   */
  private handleOrientationChange(): void {
    // Delay handling to allow orientation change to complete
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }
  
  /**
   * Updates the debounce delay
   */
  setDebounceDelay(delay: number): void {
    this.debounceDelay = delay;
  }
  
  /**
   * Manually triggers a resize check
   */
  triggerResize(): void {
    this.handleResize();
  }
  
  /**
   * Cleans up event listeners
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }
}

/**
 * Mobile-specific touch optimization utilities
 */
export interface TouchOptimizationSettings {
  reducedParticleCount: number;
  simplifiedInteractions: boolean;
  batteryOptimized: boolean;
  reducedAnimationSpeed: number;
  touchSensitivity: number;
}

/**
 * Calculates mobile-specific optimizations
 */
export const calculateMobileOptimizations = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities
): TouchOptimizationSettings => {
  const baseParticleCount = 50;
  
  // Reduce particle count based on device performance
  let reducedParticleCount = baseParticleCount;
  switch (deviceCapabilities.tier) {
    case 'low':
      reducedParticleCount = Math.floor(baseParticleCount * 0.5);
      break;
    case 'medium':
      reducedParticleCount = Math.floor(baseParticleCount * 0.7);
      break;
    case 'high':
      reducedParticleCount = Math.floor(baseParticleCount * 0.9);
      break;
  }
  
  // Further reduce for very small screens
  if (viewport.width < 400) {
    reducedParticleCount = Math.floor(reducedParticleCount * 0.8);
  }
  
  // Simplified interactions for low-end devices
  const simplifiedInteractions = deviceCapabilities.tier === 'low';
  
  // Battery optimization for mobile
  const batteryOptimized = true;
  
  // Reduced animation speed for battery saving
  const reducedAnimationSpeed = deviceCapabilities.tier === 'low' ? 0.6 : 0.8;
  
  // Touch sensitivity based on screen size
  const touchSensitivity = viewport.width < 400 ? 1.2 : 1.0;
  
  return {
    reducedParticleCount,
    simplifiedInteractions,
    batteryOptimized,
    reducedAnimationSpeed,
    touchSensitivity,
  };
};

/**
 * Advanced performance monitoring and optimization utilities
 */

export interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high';
  score: number;
  features: {
    webgl2: boolean;
    floatTextures: boolean;
    halfFloatTextures: boolean;
    depthTextures: boolean;
    instancedArrays: boolean;
    vertexArrayObjects: boolean;
    maxTextureSize: number;
    maxVertexAttribs: number;
    maxFragmentUniforms: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    cores: number;
    deviceMemory: number;
    pixelRatio: number;
    refreshRate: number;
    renderer: string;
    vendor: string;
  };
}

export interface PerformanceMetrics {
  fps: number;
  averageFps: number;
  frameTime: number;
  averageFrameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  stabilityScore: number;
  qualityLevel: number;
  thermalState: 'normal' | 'fair' | 'serious' | 'critical';
}

/**
 * Detects device capabilities for performance optimization
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  const defaultCapabilities: DeviceCapabilities = {
    tier: 'low',
    score: 0.1,
    features: {
      webgl2: false,
      floatTextures: false,
      halfFloatTextures: false,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 2048,
      maxVertexAttribs: 8,
      maxFragmentUniforms: 16,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      cores: 2,
      deviceMemory: 2,
      pixelRatio: 1,
      refreshRate: 60,
      renderer: 'unknown',
      vendor: 'unknown',
    },
  };
  
  if (!gl) return defaultCapabilities;
  
  // WebGL capabilities
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
  const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 8;
  const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) || 16;
  
  // GPU detection
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown' : 'unknown';
  const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown' : 'unknown';
  
  // Device metrics
  const deviceMemory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const pixelRatio = window.devicePixelRatio || 1;
  const refreshRate = (window.screen as any).refreshRate || 60;
  
  // Platform detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  // Feature detection
  const features = {
    webgl2: gl instanceof WebGL2RenderingContext,
    floatTextures: !!gl.getExtension('OES_texture_float'),
    halfFloatTextures: !!gl.getExtension('OES_texture_half_float'),
    depthTextures: !!gl.getExtension('WEBGL_depth_texture'),
    instancedArrays: !!gl.getExtension('ANGLE_instanced_arrays'),
    vertexArrayObjects: !!gl.getExtension('OES_vertex_array_object'),
    maxTextureSize,
    maxVertexAttribs,
    maxFragmentUniforms,
    isMobile,
    isTablet,
    isDesktop,
    cores,
    deviceMemory,
    pixelRatio,
    refreshRate,
    renderer,
    vendor,
  };
  
  // Calculate performance score
  let score = 0.3; // Base score
  
  // GPU scoring
  const rendererLower = renderer.toLowerCase();
  if (rendererLower.includes('nvidia')) {
    if (rendererLower.includes('rtx') || rendererLower.includes('gtx 1')) score += 0.4;
    else if (rendererLower.includes('gtx')) score += 0.3;
    else score += 0.2;
  } else if (rendererLower.includes('amd') || rendererLower.includes('radeon')) {
    if (rendererLower.includes('rx') || rendererLower.includes('vega')) score += 0.3;
    else score += 0.2;
  } else if (rendererLower.includes('intel')) {
    if (rendererLower.includes('iris') || rendererLower.includes('xe')) score += 0.15;
    else score += 0.05;
  } else if (rendererLower.includes('apple') || rendererLower.includes('m1') || rendererLower.includes('m2')) {
    score += 0.25;
  }
  
  // Memory and CPU scoring
  score += Math.min(deviceMemory / 32, 0.15);
  score += Math.min(cores / 20, 0.15);
  
  // WebGL capability scoring
  score += Math.min(maxTextureSize / 16384, 0.1);
  score += Math.min(maxFragmentUniforms / 1024, 0.05);
  
  // Platform adjustments
  if (isMobile) score *= 0.6;
  else if (isTablet) score *= 0.8;
  
  // Determine tier
  let tier: 'low' | 'medium' | 'high';
  if (score < 0.35) tier = 'low';
  else if (score < 0.65) tier = 'medium';
  else tier = 'high';
  
  return {
    tier,
    score: Math.max(0.1, Math.min(1.0, score)),
    features,
  };
};

/**
 * Calculates optimal settings based on device capabilities
 */
export const calculateOptimalSettings = (capabilities: DeviceCapabilities) => {
  const { tier, score, features } = capabilities;
  
  let settings = {
    particleCount: 100,
    animationSpeed: 1.0,
    interactionRadius: 0.3,
    renderScale: 1.0,
    effectIntensity: 0.6,
    qualityLevel: 1.0,
  };
  
  // Adjust based on tier
  switch (tier) {
    case 'low':
      settings = {
        particleCount: 30,
        animationSpeed: 0.7,
        interactionRadius: 0.2,
        renderScale: 0.6,
        effectIntensity: 0.4,
        qualityLevel: 0.4,
      };
      break;
    case 'medium':
      settings = {
        particleCount: 70,
        animationSpeed: 0.9,
        interactionRadius: 0.25,
        renderScale: 0.8,
        effectIntensity: 0.5,
        qualityLevel: 0.7,
      };
      break;
    case 'high':
      settings = {
        particleCount: 150,
        animationSpeed: 1.1,
        interactionRadius: 0.35,
        renderScale: 1.0,
        effectIntensity: 0.8,
        qualityLevel: 1.0,
      };
      break;
  }
  
  // Fine-tune based on specific features
  if (features.isMobile) {
    settings.particleCount = Math.floor(settings.particleCount * 0.6);
    settings.renderScale *= 0.8;
  }
  
  if (features.pixelRatio > 2) {
    settings.renderScale *= 0.8;
    settings.particleCount = Math.floor(settings.particleCount * 0.9);
  }
  
  if (features.cores < 4) {
    settings.animationSpeed *= 0.9;
    settings.particleCount = Math.floor(settings.particleCount * 0.8);
  }
  
  if (features.deviceMemory < 4) {
    settings.particleCount = Math.floor(settings.particleCount * 0.7);
    settings.effectIntensity *= 0.8;
  }
  
  return settings;
};

/**
 * Performance monitoring utility class
 */
export class AdvancedPerformanceMonitor {
  private metrics: PerformanceMetrics;
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private lastTime = performance.now();
  private frameCount = 0;
  private onPerformanceChange?: (metrics: PerformanceMetrics) => void;
  
  constructor(onPerformanceChange?: (metrics: PerformanceMetrics) => void) {
    this.onPerformanceChange = onPerformanceChange;
    this.metrics = {
      fps: 60,
      averageFps: 60,
      frameTime: 16.67,
      averageFrameTime: 16.67,
      memoryUsage: 0,
      cpuUsage: 0,
      stabilityScore: 1.0,
      qualityLevel: 1.0,
      thermalState: 'normal',
    };
  }
  
  update(): PerformanceMetrics {
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastTime;
    
    this.frameCount++;
    this.frameTimeHistory.push(frameTime);
    
    // Keep only last 60 frames for frame time history
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }
    
    // Calculate metrics every second
    if (frameTime >= 1000) {
      this.metrics.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Update FPS history
      this.fpsHistory.push(this.metrics.fps);
      if (this.fpsHistory.length > 30) {
        this.fpsHistory.shift();
      }
      
      // Calculate averages
      this.metrics.averageFps = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
      this.metrics.averageFrameTime = this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
      
      // Calculate stability score
      if (this.fpsHistory.length >= 5) {
        const variance = this.fpsHistory.slice(-5).reduce((sum, fps) => {
          const diff = fps - this.metrics.averageFps;
          return sum + diff * diff;
        }, 0) / 5;
        this.metrics.stabilityScore = Math.max(0, 1 - variance / 400);
      }
      
      // Detect thermal throttling
      this.detectThermalThrottling();
      
      // Update memory usage if available
      if ((performance as any).memory) {
        this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize;
      }
      
      // Notify listeners
      if (this.onPerformanceChange) {
        this.onPerformanceChange(this.metrics);
      }
    }
    
    return this.metrics;
  }
  
  private detectThermalThrottling(): void {
    if (this.fpsHistory.length >= 20) {
      const recentFps = this.fpsHistory.slice(-10);
      const oldFps = this.fpsHistory.slice(-20, -10);
      
      if (recentFps.length === 10 && oldFps.length === 10) {
        const recentAvg = recentFps.reduce((a, b) => a + b) / 10;
        const oldAvg = oldFps.reduce((a, b) => a + b) / 10;
        
        if (recentAvg < oldAvg * 0.7 && recentAvg < 40) {
          this.metrics.thermalState = 'serious';
        } else if (recentAvg < oldAvg * 0.85 && recentAvg < 50) {
          this.metrics.thermalState = 'fair';
        } else {
          this.metrics.thermalState = 'normal';
        }
      }
    }
  }
  
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  shouldReduceQuality(): boolean {
    return this.metrics.averageFps < 45 || this.metrics.thermalState === 'serious';
  }
  
  shouldIncreaseQuality(): boolean {
    return this.metrics.averageFps > 55 && this.metrics.stabilityScore > 0.8 && this.metrics.thermalState === 'normal';
  }
  
  getQualityRecommendation(): number {
    if (this.metrics.thermalState === 'serious') return 0.3;
    if (this.metrics.thermalState === 'fair') return 0.5;
    if (this.metrics.averageFps < 30) return 0.4;
    if (this.metrics.averageFps < 45) return 0.6;
    if (this.metrics.averageFps < 55) return 0.8;
    return 1.0;
  }
}

/**
 * Battery and power state utilities
 */
export const getBatteryInfo = async () => {
  try {
    const battery = await (navigator as any).getBattery?.();
    if (battery) {
      return {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    }
  } catch (error) {
    // Battery API not supported
  }
  
  return {
    level: 1.0,
    charging: true,
    chargingTime: Infinity,
    dischargingTime: Infinity,
  };
};

/**
 * Network speed detection
 */
export const getNetworkInfo = () => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };
  }
  
  return {
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
  };
};

/**
 * Calculates particle lifecycle and edge fading
 */
export const calculateParticleLifecycle = (
  position: { x: number; y: number },
  time: number,
  particleIndex: number
) => {
  // Lifecycle phase (0 to 1)
  const lifecycle = (time * 0.1 + particleIndex * 0.1) % 1.0;
  
  // Edge distance for natural spawning/despawning
  const edgeDistance = Math.min(
    Math.min(1.0 + position.x, 1.0 - position.x),
    Math.min(1.0 + position.y, 1.0 - position.y)
  );

  // Smooth edge fading
  const edgeFade = Math.max(0, Math.min(1, edgeDistance / 0.2));
  
  // Lifecycle opacity (sine wave for smooth fade in/out)
  const lifecycleOpacity = Math.sin(lifecycle * Math.PI);

  return {
    lifecycle,
    edgeDistance,
    edgeFade,
    lifecycleOpacity,
    totalOpacity: lifecycleOpacity * edgeFade,
  };
};

/**
 * Advanced performance monitoring and optimization utilities
 */

export interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high';
  score: number;
  gpu: string;
  memory: number;
  cores: number;
  screenComplexity: number;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
}

export interface PerformanceMetrics {
  fps: number;
  averageFps: number;
  frameTime: number;
  averageFrameTime: number;
  qualityLevel: number;
  memoryUsage?: number;
  gpuMemoryUsage?: number;
  drawCalls: number;
  triangles: number;
}

/**
 * Comprehensive device capability detection
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const gl2 = canvas.getContext('webgl2');
  
  if (!gl) {
    return {
      tier: 'low',
      score: 0.1,
      gpu: 'unknown',
      memory: 2,
      cores: 2,
      screenComplexity: 1.0,
      supportsWebGL2: false,
      maxTextureSize: 512,
      maxVertexUniforms: 128,
      maxFragmentUniforms: 128,
    };
  }
  
  // GPU detection
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
  
  // Device capabilities
  const deviceMemory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const screenArea = window.screen.width * window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  const screenComplexity = (screenArea * pixelRatio) / (1920 * 1080);
  
  // WebGL capabilities
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
  
  // Performance score calculation
  let score = 0.3; // Base score
  
  // GPU scoring
  const gpuLower = renderer.toLowerCase();
  if (gpuLower.includes('nvidia') && (gpuLower.includes('rtx') || gpuLower.includes('gtx'))) {
    score += 0.4; // High-end NVIDIA
  } else if (gpuLower.includes('amd') && gpuLower.includes('radeon')) {
    score += 0.35; // AMD Radeon
  } else if (gpuLower.includes('nvidia')) {
    score += 0.25; // Other NVIDIA
  } else if (gpuLower.includes('intel') && gpuLower.includes('iris')) {
    score += 0.15; // Intel Iris
  } else if (gpuLower.includes('intel')) {
    score += 0.05; // Basic Intel
  }
  
  // Memory scoring
  score += Math.min(deviceMemory / 32, 0.2); // Up to 0.2 for 32GB+
  
  // CPU scoring
  score += Math.min(cores / 16, 0.15); // Up to 0.15 for 16+ cores
  
  // WebGL capabilities scoring
  score += Math.min(maxTextureSize / 8192, 0.1); // Up to 0.1 for 8K textures
  score += Math.min(maxFragmentUniforms / 1024, 0.05); // Up to 0.05 for many uniforms
  
  // Screen complexity penalty
  score -= Math.max(0, (screenComplexity - 1.5) * 0.1);
  
  // WebGL2 bonus
  if (gl2) score += 0.05;
  
  // Determine tier
  let tier: 'low' | 'medium' | 'high';
  if (score < 0.4) tier = 'low';
  else if (score < 0.75) tier = 'medium';
  else tier = 'high';
  
  return {
    tier,
    score: Math.max(0.1, Math.min(1.0, score)),
    gpu: renderer,
    memory: deviceMemory,
    cores,
    screenComplexity,
    supportsWebGL2: !!gl2,
    maxTextureSize,
    maxVertexUniforms,
    maxFragmentUniforms,
  };
};

/**
 * Advanced performance monitor with adaptive quality
 */
export class AdvancedPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private qualityLevel = 1.0;
  private targetFps = 45;
  private lastQualityAdjustment = 0;
  private onPerformanceChange?: (metrics: PerformanceMetrics) => void;
  private deviceCapabilities: DeviceCapabilities;
  
  constructor(
    onPerformanceChange?: (metrics: PerformanceMetrics) => void,
    targetFps: number = 45
  ) {
    this.onPerformanceChange = onPerformanceChange;
    this.targetFps = targetFps;
    this.deviceCapabilities = detectDeviceCapabilities();
    
    // Set initial quality based on device capabilities
    this.qualityLevel = this.deviceCapabilities.score;
  }
  
  update(): PerformanceMetrics {
    const currentTime = performance.now();
    this.frameCount++;
    
    const frameTime = currentTime - this.lastTime;
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }
    
    // Calculate FPS every second
    if (frameTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      this.fpsHistory.push(this.fps);
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift();
      }
      
      // Adaptive quality adjustment
      this.adjustQuality();
    }
    
    const metrics: PerformanceMetrics = {
      fps: this.fps,
      averageFps: this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length || 60,
      frameTime: frameTime,
      averageFrameTime: this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length || 16.67,
      qualityLevel: this.qualityLevel,
      memoryUsage: this.getMemoryUsage(),
      drawCalls: 0, // Would need WebGL context to measure
      triangles: 0, // Would need WebGL context to measure
    };
    
    if (this.onPerformanceChange) {
      this.onPerformanceChange(metrics);
    }
    
    return metrics;
  }
  
  private adjustQuality(): void {
    const currentTime = performance.now();
    
    // Don't adjust too frequently
    if (currentTime - this.lastQualityAdjustment < 2000) return;
    
    const averageFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    if (averageFps < this.targetFps && this.qualityLevel > 0.2) {
      this.qualityLevel *= 0.9;
      this.lastQualityAdjustment = currentTime;
    } else if (averageFps > this.targetFps + 10 && this.qualityLevel < 1.0) {
      this.qualityLevel = Math.min(1.0, this.qualityLevel * 1.05);
      this.lastQualityAdjustment = currentTime;
    }
  }
  
  private getMemoryUsage(): number | undefined {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    return undefined;
  }
  
  getQualityLevel(): number {
    return this.qualityLevel;
  }
  
  setTargetFps(fps: number): void {
    this.targetFps = Math.max(15, Math.min(120, fps));
  }
  
  getDeviceCapabilities(): DeviceCapabilities {
    return this.deviceCapabilities;
  }
  
  shouldReduceQuality(): boolean {
    return this.fps < this.targetFps * 0.8;
  }
  
  shouldIncreaseQuality(): boolean {
    return this.fps > this.targetFps * 1.2 && this.qualityLevel < 1.0;
  }
  
  isMemoryPressureHigh(): boolean {
    const memoryUsage = this.getMemoryUsage();
    return memoryUsage ? memoryUsage > 100 : false; // 100MB threshold
  }
}

/**
 * Quality preset configurations based on device capabilities
 */
export const QUALITY_PRESETS = {
  low: {
    particleCount: 30,
    animationSpeed: 0.6,
    interactionEnabled: false,
    renderScale: 0.7,
    antialias: false,
    complexGeometry: false,
  },
  medium: {
    particleCount: 100,
    animationSpeed: 0.8,
    interactionEnabled: true,
    renderScale: 0.9,
    antialias: true,
    complexGeometry: true,
  },
  high: {
    particleCount: 200,
    animationSpeed: 1.0,
    interactionEnabled: true,
    renderScale: 1.0,
    antialias: true,
    complexGeometry: true,
  },
  ultra: {
    particleCount: 300,
    animationSpeed: 1.2,
    interactionEnabled: true,
    renderScale: 1.0,
    antialias: true,
    complexGeometry: true,
  },
};

/**
 * Gets optimal quality preset for device
 */
export const getOptimalQualityPreset = (capabilities: DeviceCapabilities) => {
  if (capabilities.tier === 'low') return QUALITY_PRESETS.low;
  if (capabilities.tier === 'medium') return QUALITY_PRESETS.medium;
  if (capabilities.score > 0.9) return QUALITY_PRESETS.ultra;
  return QUALITY_PRESETS.high;
};

/**
 * Battery status monitoring (if available)
 */
export const getBatteryStatus = async (): Promise<{
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
} | null> => {
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Thermal throttling detection
 */
export const detectThermalThrottling = (): boolean => {
  // Simple heuristic: if performance drops significantly over time
  // This would need more sophisticated implementation in practice
  return false;
};

/**
 * Theme color utilities
 */
export const getThemeColors = (isDark: boolean) => {
  const colors = {
    light: {
      primary: [0.96, 0.4, 0.26] as [number, number, number], // vermilion-500
      accent: [0.91, 0.24, 0.49] as [number, number, number], // sakura-500
      background: [1.0, 1.0, 1.0] as [number, number, number], // white
      particle: [0.43, 0.43, 0.43] as [number, number, number], // sumi-700
    },
    dark: {
      primary: [1.0, 0.45, 0.3] as [number, number, number], // vermilion-400
      accent: [0.95, 0.46, 0.57] as [number, number, number], // sakura-400
      background: [0.05, 0.05, 0.05] as [number, number, number], // near black
      particle: [0.69, 0.69, 0.69] as [number, number, number], // sumi-300
    },
  };

  return isDark ? colors.dark : colors.light;
};
/*
*
 * Responsive scaling and window resize utilities
 */

export interface ResponsiveScalingConfig {
  baseWidth: number;
  baseHeight: number;
  minScale: number;
  maxScale: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    ultrawide: number;
  };
}

export interface WindowDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
}

export interface ResponsiveSettings {
  renderScale: number;
  particleCountMultiplier: number;
  interactionRadiusMultiplier: number;
  animationSpeedMultiplier: number;
  qualityLevel: number;
}

/**
 * Default responsive scaling configuration
 */
export const DEFAULT_RESPONSIVE_CONFIG: ResponsiveScalingConfig = {
  baseWidth: 1920,
  baseHeight: 1080,
  minScale: 0.3,
  maxScale: 1.0,
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    ultrawide: 2560,
  },
};

/**
 * Gets current window dimensions and properties
 */
export const getWindowDimensions = (): WindowDimensions => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / height;
  const pixelRatio = window.devicePixelRatio || 1;
  const orientation = width > height ? 'landscape' : 'portrait';

  return {
    width,
    height,
    aspectRatio,
    pixelRatio,
    orientation,
  };
};

/**
 * Calculates optimal render scale based on screen size and device capabilities
 */
export const calculateResponsiveScale = (
  dimensions: WindowDimensions,
  deviceCapabilities: DeviceCapabilities,
  config: ResponsiveScalingConfig = DEFAULT_RESPONSIVE_CONFIG
): number => {
  const { width, height, pixelRatio } = dimensions;
  const { tier, score } = deviceCapabilities;
  
  // Base scale calculation based on screen size relative to reference resolution
  const widthScale = width / config.baseWidth;
  const heightScale = height / config.baseHeight;
  const baseScale = Math.min(widthScale, heightScale);
  
  // Device capability adjustments
  let capabilityMultiplier = 1.0;
  switch (tier) {
    case 'low':
      capabilityMultiplier = 0.5;
      break;
    case 'medium':
      capabilityMultiplier = 0.75;
      break;
    case 'high':
      capabilityMultiplier = 1.0;
      break;
  }
  
  // Pixel ratio adjustments (higher DPI screens can handle more detail)
  const pixelRatioBonus = Math.min(pixelRatio / 2, 0.3);
  
  // Screen complexity penalty for very large screens
  const screenArea = width * height;
  const referenceArea = config.baseWidth * config.baseHeight;
  const complexityPenalty = screenArea > referenceArea * 2 ? 0.8 : 1.0;
  
  // Calculate final scale
  let finalScale = baseScale * capabilityMultiplier * complexityPenalty + pixelRatioBonus;
  
  // Clamp to configured range
  finalScale = Math.max(config.minScale, Math.min(config.maxScale, finalScale));
  
  return finalScale;
};

/**
 * Determines device category based on screen width
 */
export const getDeviceCategory = (
  width: number,
  config: ResponsiveScalingConfig = DEFAULT_RESPONSIVE_CONFIG
): 'mobile' | 'tablet' | 'desktop' | 'ultrawide' => {
  if (width < config.breakpoints.mobile) return 'mobile';
  if (width < config.breakpoints.tablet) return 'tablet';
  if (width < config.breakpoints.desktop) return 'desktop';
  return 'ultrawide';
};

/**
 * Calculates responsive settings based on device category and capabilities
 */
export const calculateResponsiveSettings = (
  dimensions: WindowDimensions,
  deviceCapabilities: DeviceCapabilities,
  config: ResponsiveScalingConfig = DEFAULT_RESPONSIVE_CONFIG
): ResponsiveSettings => {
  const category = getDeviceCategory(dimensions.width, config);
  const renderScale = calculateResponsiveScale(dimensions, deviceCapabilities, config);
  
  let settings: ResponsiveSettings = {
    renderScale,
    particleCountMultiplier: 1.0,
    interactionRadiusMultiplier: 1.0,
    animationSpeedMultiplier: 1.0,
    qualityLevel: 1.0,
  };
  
  // Device category specific adjustments
  switch (category) {
    case 'mobile':
      settings = {
        ...settings,
        particleCountMultiplier: 0.4,
        interactionRadiusMultiplier: 0.7,
        animationSpeedMultiplier: 0.8,
        qualityLevel: 0.5,
      };
      break;
    case 'tablet':
      settings = {
        ...settings,
        particleCountMultiplier: 0.7,
        interactionRadiusMultiplier: 0.85,
        animationSpeedMultiplier: 0.9,
        qualityLevel: 0.7,
      };
      break;
    case 'desktop':
      settings = {
        ...settings,
        particleCountMultiplier: 1.0,
        interactionRadiusMultiplier: 1.0,
        animationSpeedMultiplier: 1.0,
        qualityLevel: 1.0,
      };
      break;
    case 'ultrawide':
      settings = {
        ...settings,
        particleCountMultiplier: 1.3,
        interactionRadiusMultiplier: 1.2,
        animationSpeedMultiplier: 1.1,
        qualityLevel: 1.0,
      };
      break;
  }
  
  // Orientation adjustments
  if (dimensions.orientation === 'portrait' && category === 'mobile') {
    settings.particleCountMultiplier *= 0.8;
    settings.interactionRadiusMultiplier *= 0.9;
  }
  
  // Device capability adjustments
  const capabilityMultiplier = deviceCapabilities.score;
  settings.particleCountMultiplier *= capabilityMultiplier;
  settings.qualityLevel *= capabilityMultiplier;
  
  return settings;
};

/**
 * Smooth transition manager for responsive changes
 */
export class ResponsiveTransitionManager {
  private currentSettings: ResponsiveSettings;
  private targetSettings: ResponsiveSettings;
  private transitionSpeed: number;
  private isTransitioning: boolean;
  
  constructor(initialSettings: ResponsiveSettings, transitionSpeed: number = 0.05) {
    this.currentSettings = { ...initialSettings };
    this.targetSettings = { ...initialSettings };
    this.transitionSpeed = transitionSpeed;
    this.isTransitioning = false;
  }
  
  /**
   * Sets new target settings and starts transition
   */
  setTargetSettings(newSettings: ResponsiveSettings): void {
    this.targetSettings = { ...newSettings };
    this.isTransitioning = true;
  }
  
  /**
   * Updates transition progress (call every frame)
   */
  update(): ResponsiveSettings {
    if (!this.isTransitioning) {
      return this.currentSettings;
    }
    
    let hasChanges = false;
    
    // Interpolate each setting
    const interpolate = (current: number, target: number): number => {
      if (Math.abs(current - target) < 0.001) {
        return target;
      }
      hasChanges = true;
      return current + (target - current) * this.transitionSpeed;
    };
    
    this.currentSettings = {
      renderScale: interpolate(this.currentSettings.renderScale, this.targetSettings.renderScale),
      particleCountMultiplier: interpolate(this.currentSettings.particleCountMultiplier, this.targetSettings.particleCountMultiplier),
      interactionRadiusMultiplier: interpolate(this.currentSettings.interactionRadiusMultiplier, this.targetSettings.interactionRadiusMultiplier),
      animationSpeedMultiplier: interpolate(this.currentSettings.animationSpeedMultiplier, this.targetSettings.animationSpeedMultiplier),
      qualityLevel: interpolate(this.currentSettings.qualityLevel, this.targetSettings.qualityLevel),
    };
    
    if (!hasChanges) {
      this.isTransitioning = false;
    }
    
    return this.currentSettings;
  }
  
  /**
   * Checks if transition is complete
   */
  isTransitionComplete(): boolean {
    return !this.isTransitioning;
  }
  
  /**
   * Gets current settings
   */
  getCurrentSettings(): ResponsiveSettings {
    return { ...this.currentSettings };
  }
  
  /**
   * Forces transition to complete immediately
   */
  completeTransition(): void {
    this.currentSettings = { ...this.targetSettings };
    this.isTransitioning = false;
  }
  
  /**
   * Sets transition speed
   */
  setTransitionSpeed(speed: number): void {
    this.transitionSpeed = Math.max(0.001, Math.min(1.0, speed));
  }
}

/**
 * Debounced resize handler utility
 */
export class DebouncedResizeHandler {
  private callback: () => void;
  private delay: number;
  private timeoutId: number | null;
  
  constructor(callback: () => void, delay: number = 150) {
    this.callback = callback;
    this.delay = delay;
    this.timeoutId = null;
  }
  
  /**
   * Triggers the debounced callback
   */
  trigger(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = window.setTimeout(() => {
      this.callback();
      this.timeoutId = null;
    }, this.delay);
  }
  
  /**
   * Cancels pending callback
   */
  cancel(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  
  /**
   * Updates the delay
   */
  setDelay(delay: number): void {
    this.delay = Math.max(0, delay);
  }
}

/**
 * Touch interaction utilities for mobile devices
 */
export interface TouchInteraction {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  pressure: number;
  timestamp: number;
}

/**
 * Processes touch events for mobile shader interaction
 */
export const processTouchInteraction = (
  touch: Touch,
  containerRect: DOMRect,
  previousTouch?: TouchInteraction
): TouchInteraction => {
  const x = Math.max(0, Math.min(1, (touch.clientX - containerRect.left) / containerRect.width));
  const y = Math.max(0, Math.min(1, 1.0 - (touch.clientY - containerRect.top) / containerRect.height));
  
  let velocity = { x: 0, y: 0 };
  
  if (previousTouch) {
    const deltaTime = Date.now() - previousTouch.timestamp;
    if (deltaTime > 0) {
      velocity.x = (x - previousTouch.position.x) / deltaTime * 1000; // pixels per second
      velocity.y = (y - previousTouch.position.y) / deltaTime * 1000;
    }
  }
  
  return {
    position: { x, y },
    velocity,
    pressure: touch.force || 1.0,
    timestamp: Date.now(),
  };
};

/**
 * Calculates optimal touch interaction radius based on device and touch pressure
 */
export const calculateTouchInteractionRadius = (
  baseRadius: number,
  touchInteraction: TouchInteraction,
  deviceCategory: 'mobile' | 'tablet' | 'desktop' | 'ultrawide'
): number => {
  let radius = baseRadius;
  
  // Device-specific adjustments
  switch (deviceCategory) {
    case 'mobile':
      radius *= 0.7; // Smaller radius for mobile
      break;
    case 'tablet':
      radius *= 0.85;
      break;
    default:
      // Desktop and ultrawide use base radius
      break;
  }
  
  // Pressure-based adjustments (if supported)
  if (touchInteraction.pressure > 0) {
    radius *= (0.7 + touchInteraction.pressure * 0.3); // Scale between 0.7x and 1.0x
  }
  
  // Velocity-based adjustments
  const velocityMagnitude = Math.sqrt(
    touchInteraction.velocity.x ** 2 + touchInteraction.velocity.y ** 2
  );
  const velocityBoost = Math.min(velocityMagnitude * 0.01, 0.3);
  radius += velocityBoost;
  
  return radius;
};

/**
 * Enhanced responsive scaling utilities for window resize handling
 */

export interface ResponsiveScaleTransition {
  fromScale: number;
  toScale: number;
  fromParticleCount: number;
  toParticleCount: number;
  fromInteractionRadius: number;
  toInteractionRadius: number;
  progress: number;
  duration: number;
  startTime: number;
}

/**
 * Manages smooth transitions during window resize events
 */
export class ResponsiveScaleManager {
  private currentTransition: ResponsiveScaleTransition | null = null;
  private resizeTimeoutId: number | null = null;
  private lastResizeTime = 0;
  private resizeDebounceDelay = 150;
  private transitionDuration = 300;
  
  constructor(debounceDelay = 150, transitionDuration = 300) {
    this.resizeDebounceDelay = debounceDelay;
    this.transitionDuration = transitionDuration;
  }
  
  /**
   * Starts a smooth transition between responsive settings
   */
  startTransition(
    fromSettings: ResponsiveShaderSettings,
    toSettings: ResponsiveShaderSettings
  ): void {
    const now = performance.now();
    
    this.currentTransition = {
      fromScale: fromSettings.renderScale,
      toScale: toSettings.renderScale,
      fromParticleCount: fromSettings.particleCount,
      toParticleCount: toSettings.particleCount,
      fromInteractionRadius: fromSettings.interactionRadius,
      toInteractionRadius: toSettings.interactionRadius,
      progress: 0,
      duration: this.transitionDuration,
      startTime: now,
    };
  }
  
  /**
   * Updates the current transition and returns interpolated settings
   */
  updateTransition(): ResponsiveShaderSettings | null {
    if (!this.currentTransition) return null;
    
    const now = performance.now();
    const elapsed = now - this.currentTransition.startTime;
    const progress = Math.min(elapsed / this.currentTransition.duration, 1);
    
    // Smooth easing function (ease-out)
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOut(progress);
    
    const interpolatedSettings: ResponsiveShaderSettings = {
      renderScale: this.lerp(
        this.currentTransition.fromScale,
        this.currentTransition.toScale,
        easedProgress
      ),
      particleCount: Math.round(this.lerp(
        this.currentTransition.fromParticleCount,
        this.currentTransition.toParticleCount,
        easedProgress
      )),
      interactionRadius: this.lerp(
        this.currentTransition.fromInteractionRadius,
        this.currentTransition.toInteractionRadius,
        easedProgress
      ),
      animationSpeed: 1.0, // Keep constant during transition
      qualityLevel: 1.0,
      enableComplexEffects: true,
      debounceDelay: this.resizeDebounceDelay,
      transitionDuration: this.transitionDuration,
    };
    
    // Complete transition if finished
    if (progress >= 1) {
      this.currentTransition = null;
    }
    
    return interpolatedSettings;
  }
  
  /**
   * Checks if a transition is currently active
   */
  isTransitioning(): boolean {
    return this.currentTransition !== null;
  }
  
  /**
   * Handles debounced resize events
   */
  handleResize(callback: () => void): void {
    this.lastResizeTime = performance.now();
    
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
    }
    
    this.resizeTimeoutId = window.setTimeout(() => {
      callback();
      this.resizeTimeoutId = null;
    }, this.resizeDebounceDelay);
  }
  
  /**
   * Cancels any pending resize callback
   */
  cancelResize(): void {
    if (this.resizeTimeoutId) {
      clearTimeout(this.resizeTimeoutId);
      this.resizeTimeoutId = null;
    }
  }
  
  /**
   * Linear interpolation helper
   */
  private lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t;
  }
  
  /**
   * Sets debounce delay for resize events
   */
  setDebounceDelay(delay: number): void {
    this.resizeDebounceDelay = Math.max(50, Math.min(delay, 1000));
  }
  
  /**
   * Sets transition duration
   */
  setTransitionDuration(duration: number): void {
    this.transitionDuration = Math.max(100, Math.min(duration, 2000));
  }
}

/**
 * Calculates responsive shader settings with smooth scaling
 */
export const calculateResponsiveShaderSettingsWithTransition = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities,
  baseSettings: Partial<ResponsiveShaderSettings> = {},
  previousSettings?: ResponsiveShaderSettings
): ResponsiveShaderSettings => {
  // Calculate new settings
  const newSettings = calculateResponsiveShaderSettings(viewport, deviceCapabilities, baseSettings);
  
  // If we have previous settings, ensure smooth transitions
  if (previousSettings) {
    // Prevent dramatic changes that could cause jarring transitions
    const maxScaleChange = 0.3;
    const maxParticleChange = 50;
    
    if (Math.abs(newSettings.renderScale - previousSettings.renderScale) > maxScaleChange) {
      const direction = newSettings.renderScale > previousSettings.renderScale ? 1 : -1;
      newSettings.renderScale = previousSettings.renderScale + (maxScaleChange * direction);
    }
    
    if (Math.abs(newSettings.particleCount - previousSettings.particleCount) > maxParticleChange) {
      const direction = newSettings.particleCount > previousSettings.particleCount ? 1 : -1;
      newSettings.particleCount = previousSettings.particleCount + (maxParticleChange * direction);
    }
  }
  
  return newSettings;
};

/**
 * Handles mobile-specific resize optimizations
 */
export const handleMobileResizeOptimizations = (
  viewport: ViewportDimensions,
  isResizing: boolean
): ResponsiveShaderSettings => {
  const baseSettings = calculateResponsiveShaderSettings(viewport, {
    tier: 'low',
    score: 0.4,
    features: {
      webgl2: false,
      floatTextures: false,
      halfFloatTextures: false,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 2048,
      maxVertexAttribs: 8,
      maxFragmentUniforms: 16,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      cores: 4,
      deviceMemory: 4,
      pixelRatio: viewport.pixelRatio,
      refreshRate: 60,
      renderer: 'mobile',
      vendor: 'mobile',
    },
  } as DeviceCapabilities);
  
  // Apply additional mobile optimizations during resize
  if (isResizing) {
    return {
      ...baseSettings,
      renderScale: Math.max(0.4, baseSettings.renderScale * 0.7), // Reduce quality during resize
      particleCount: Math.floor(baseSettings.particleCount * 0.6), // Fewer particles during resize
      animationSpeed: baseSettings.animationSpeed * 0.8, // Slower animations during resize
      enableComplexEffects: false, // Disable complex effects during resize
      debounceDelay: 200, // Longer debounce for mobile
      transitionDuration: 400, // Longer transition for smoother mobile experience
    };
  }
  
  return baseSettings;
};

/**
 * Calculates optimal settings for different screen orientations
 */
export const calculateOrientationOptimizations = (
  viewport: ViewportDimensions,
  previousOrientation?: 'portrait' | 'landscape'
): ResponsiveShaderSettings => {
  const baseSettings = calculateResponsiveShaderSettings(viewport, {
    tier: viewport.deviceType === 'mobile' ? 'low' : 'medium',
    score: viewport.deviceType === 'mobile' ? 0.4 : 0.7,
    features: {
      webgl2: false,
      floatTextures: false,
      halfFloatTextures: false,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 2048,
      maxVertexAttribs: 8,
      maxFragmentUniforms: 16,
      isMobile: viewport.deviceType === 'mobile',
      isTablet: viewport.deviceType === 'tablet',
      isDesktop: viewport.deviceType === 'desktop',
      cores: 4,
      deviceMemory: 4,
      pixelRatio: viewport.pixelRatio,
      refreshRate: 60,
      renderer: 'unknown',
      vendor: 'unknown',
    },
  } as DeviceCapabilities);
  
  // Orientation-specific adjustments
  if (viewport.orientation === 'portrait') {
    // Portrait mode optimizations
    return {
      ...baseSettings,
      particleCount: Math.floor(baseSettings.particleCount * 0.8), // Fewer particles in portrait
      interactionRadius: baseSettings.interactionRadius * 0.9, // Smaller interaction area
    };
  } else {
    // Landscape mode optimizations
    return {
      ...baseSettings,
      particleCount: Math.floor(baseSettings.particleCount * 1.1), // More particles in landscape
      interactionRadius: baseSettings.interactionRadius * 1.1, // Larger interaction area
    };
  }
};

/**
 * Handles ultrawide display optimizations
 */
export const calculateUltrawideOptimizations = (
  viewport: ViewportDimensions
): ResponsiveShaderSettings => {
  const baseSettings = calculateResponsiveShaderSettings(viewport, {
    tier: 'high',
    score: 0.9,
    features: {
      webgl2: true,
      floatTextures: true,
      halfFloatTextures: true,
      depthTextures: true,
      instancedArrays: true,
      vertexArrayObjects: true,
      maxTextureSize: 4096,
      maxVertexAttribs: 16,
      maxFragmentUniforms: 32,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      cores: 8,
      deviceMemory: 16,
      pixelRatio: viewport.pixelRatio,
      refreshRate: 120,
      renderer: 'high-end',
      vendor: 'nvidia',
    },
  } as DeviceCapabilities);
  
  // Ultrawide-specific optimizations
  return {
    ...baseSettings,
    particleCount: Math.floor(baseSettings.particleCount * 1.3), // More particles for ultrawide
    interactionRadius: baseSettings.interactionRadius * 1.2, // Larger interaction area
    enableComplexEffects: true, // Enable all effects for ultrawide
    renderScale: Math.min(1.0, baseSettings.renderScale * 1.1), // Slightly higher quality
  };
};

/**
 * Enhanced responsive viewport utilities for comprehensive screen size handling
 */

export interface ResponsiveBreakpoints {
  xs: number;    // Extra small devices (phones)
  sm: number;    // Small devices (large phones)
  md: number;    // Medium devices (tablets)
  lg: number;    // Large devices (desktops)
  xl: number;    // Extra large devices (large desktops)
  xxl: number;   // Extra extra large devices (ultrawide)
}

export interface ResponsiveScaling {
  scale: number;
  particleMultiplier: number;
  interactionMultiplier: number;
  qualityMultiplier: number;
  animationSpeedMultiplier: number;
}

/**
 * Default responsive breakpoints based on common device sizes
 */
export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  xs: 480,   // Small phones
  sm: 768,   // Large phones / small tablets
  md: 1024,  // Tablets / small laptops
  lg: 1440,  // Laptops / desktops
  xl: 1920,  // Large desktops
  xxl: 2560, // Ultrawide displays
};

/**
 * Calculates responsive scaling factors based on screen size
 */
export const calculateResponsiveScaling = (
  viewport: ViewportDimensions,
  breakpoints: ResponsiveBreakpoints = DEFAULT_BREAKPOINTS
): ResponsiveScaling => {
  const { width, height, aspectRatio, deviceType } = viewport;
  
  // Base scaling factors
  let scale = 1.0;
  let particleMultiplier = 1.0;
  let interactionMultiplier = 1.0;
  let qualityMultiplier = 1.0;
  let animationSpeedMultiplier = 1.0;
  
  // Screen size-based adjustments
  if (width <= breakpoints.xs) {
    // Extra small screens (small phones)
    scale = 0.7;
    particleMultiplier = 0.4;
    interactionMultiplier = 0.8;
    qualityMultiplier = 0.6;
    animationSpeedMultiplier = 0.8;
  } else if (width <= breakpoints.sm) {
    // Small screens (large phones)
    scale = 0.8;
    particleMultiplier = 0.6;
    interactionMultiplier = 0.9;
    qualityMultiplier = 0.7;
    animationSpeedMultiplier = 0.85;
  } else if (width <= breakpoints.md) {
    // Medium screens (tablets)
    scale = 0.9;
    particleMultiplier = 0.8;
    interactionMultiplier = 1.0;
    qualityMultiplier = 0.85;
    animationSpeedMultiplier = 0.9;
  } else if (width <= breakpoints.lg) {
    // Large screens (laptops/desktops)
    scale = 1.0;
    particleMultiplier = 1.0;
    interactionMultiplier = 1.0;
    qualityMultiplier = 1.0;
    animationSpeedMultiplier = 1.0;
  } else if (width <= breakpoints.xl) {
    // Extra large screens (large desktops)
    scale = 1.05;
    particleMultiplier = 1.2;
    interactionMultiplier = 1.1;
    qualityMultiplier = 1.1;
    animationSpeedMultiplier = 1.0;
  } else {
    // Ultra-wide screens
    scale = 1.1;
    particleMultiplier = 1.4;
    interactionMultiplier = 1.2;
    qualityMultiplier = 1.2;
    animationSpeedMultiplier = 1.0;
  }
  
  // Aspect ratio adjustments
  if (aspectRatio < 0.75) {
    // Portrait orientation - reduce horizontal effects
    scale *= 0.9;
    interactionMultiplier *= 0.8;
  } else if (aspectRatio > 2.0) {
    // Ultra-wide aspect ratio - enhance horizontal effects
    scale *= 1.1;
    interactionMultiplier *= 1.3;
    particleMultiplier *= 1.2;
  }
  
  // Device type fine-tuning
  if (deviceType === 'mobile') {
    particleMultiplier *= 0.7;
    qualityMultiplier *= 0.8;
    animationSpeedMultiplier *= 0.9;
  } else if (deviceType === 'tablet') {
    particleMultiplier *= 0.85;
    qualityMultiplier *= 0.9;
  }
  
  return {
    scale,
    particleMultiplier,
    interactionMultiplier,
    qualityMultiplier,
    animationSpeedMultiplier,
  };
};

/**
 * Smooth resize transition manager for handling window resize events
 */
export class SmoothResizeManager {
  private isResizing = false;
  private resizeStartTime = 0;
  private resizeEndTimeout: number | null = null;
  private currentDimensions: ViewportDimensions;
  private targetDimensions: ViewportDimensions;
  private transitionProgress = 1.0;
  private transitionDuration = 300; // ms
  private debounceDelay = 150; // ms
  
  constructor(
    initialDimensions: ViewportDimensions,
    transitionDuration = 300,
    debounceDelay = 150
  ) {
    this.currentDimensions = { ...initialDimensions };
    this.targetDimensions = { ...initialDimensions };
    this.transitionDuration = transitionDuration;
    this.debounceDelay = debounceDelay;
  }
  
  /**
   * Starts a resize transition to new dimensions
   */
  startResize(newDimensions: ViewportDimensions): void {
    // Clear any existing resize end timeout
    if (this.resizeEndTimeout) {
      clearTimeout(this.resizeEndTimeout);
    }
    
    // If not currently resizing, start new transition
    if (!this.isResizing) {
      this.isResizing = true;
      this.resizeStartTime = performance.now();
      this.transitionProgress = 0;
      this.currentDimensions = { ...this.targetDimensions };
    }
    
    // Update target dimensions
    this.targetDimensions = { ...newDimensions };
    
    // Set timeout to end resize state
    this.resizeEndTimeout = window.setTimeout(() => {
      this.endResize();
    }, this.debounceDelay);
  }
  
  /**
   * Updates the resize transition and returns current interpolated dimensions
   */
  update(): { dimensions: ViewportDimensions; isResizing: boolean; progress: number } {
    if (!this.isResizing) {
      return {
        dimensions: this.targetDimensions,
        isResizing: false,
        progress: 1.0,
      };
    }
    
    const elapsed = performance.now() - this.resizeStartTime;
    this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1.0);
    
    // Smooth easing function (ease-out)
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOut(this.transitionProgress);
    
    // Interpolate dimensions
    const interpolatedDimensions: ViewportDimensions = {
      width: this.lerp(this.currentDimensions.width, this.targetDimensions.width, easedProgress),
      height: this.lerp(this.currentDimensions.height, this.targetDimensions.height, easedProgress),
      aspectRatio: this.lerp(this.currentDimensions.aspectRatio, this.targetDimensions.aspectRatio, easedProgress),
      pixelRatio: this.targetDimensions.pixelRatio, // Don't interpolate pixel ratio
      orientation: this.targetDimensions.orientation, // Don't interpolate orientation
      deviceType: this.targetDimensions.deviceType, // Don't interpolate device type
      isUltrawide: this.targetDimensions.isUltrawide, // Don't interpolate boolean
    };
    
    return {
      dimensions: interpolatedDimensions,
      isResizing: this.isResizing,
      progress: easedProgress,
    };
  }
  
  /**
   * Ends the resize transition
   */
  private endResize(): void {
    this.isResizing = false;
    this.transitionProgress = 1.0;
    this.currentDimensions = { ...this.targetDimensions };
    this.resizeEndTimeout = null;
  }
  
  /**
   * Forces the resize transition to complete immediately
   */
  completeResize(): void {
    if (this.resizeEndTimeout) {
      clearTimeout(this.resizeEndTimeout);
    }
    this.endResize();
  }
  
  /**
   * Checks if currently in resize transition
   */
  getIsResizing(): boolean {
    return this.isResizing;
  }
  
  /**
   * Gets current transition progress (0-1)
   */
  getProgress(): number {
    return this.transitionProgress;
  }
  
  /**
   * Linear interpolation helper
   */
  private lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t;
  }
  
  /**
   * Updates transition settings
   */
  setTransitionSettings(duration: number, debounceDelay: number): void {
    this.transitionDuration = Math.max(100, Math.min(duration, 2000));
    this.debounceDelay = Math.max(50, Math.min(debounceDelay, 1000));
  }
}

/**
 * Advanced mobile touch optimization utilities
 */
export interface MobileTouchOptimizations {
  touchSensitivity: number;
  gestureThreshold: number;
  tapRadius: number;
  swipeVelocityThreshold: number;
  pinchScaleThreshold: number;
  rotationThreshold: number;
}

/**
 * Calculates optimal touch interaction settings for mobile devices
 */
export const calculateMobileTouchOptimizations = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities
): MobileTouchOptimizations => {
  const baseOptimizations: MobileTouchOptimizations = {
    touchSensitivity: 1.0,
    gestureThreshold: 10, // pixels
    tapRadius: 44, // pixels (iOS HIG recommendation)
    swipeVelocityThreshold: 300, // pixels per second
    pinchScaleThreshold: 0.1, // scale difference
    rotationThreshold: 15, // degrees
  };
  
  // Adjust based on screen size
  if (viewport.width <= DEFAULT_BREAKPOINTS.xs) {
    // Small screens - increase touch targets and sensitivity
    baseOptimizations.touchSensitivity = 1.3;
    baseOptimizations.tapRadius = 48;
    baseOptimizations.gestureThreshold = 8;
  } else if (viewport.width <= DEFAULT_BREAKPOINTS.sm) {
    // Medium mobile screens
    baseOptimizations.touchSensitivity = 1.2;
    baseOptimizations.tapRadius = 46;
    baseOptimizations.gestureThreshold = 9;
  }
  
  // Adjust based on pixel ratio (high-DPI screens)
  if (viewport.pixelRatio > 2) {
    baseOptimizations.touchSensitivity *= 0.9; // Reduce sensitivity on high-DPI
    baseOptimizations.gestureThreshold *= viewport.pixelRatio * 0.5;
  }
  
  // Adjust based on device capabilities
  if (deviceCapabilities.tier === 'low') {
    baseOptimizations.touchSensitivity *= 0.8; // Reduce for performance
    baseOptimizations.swipeVelocityThreshold *= 1.2; // Higher threshold
  }
  
  return baseOptimizations;
};

/**
 * Handles complex multi-touch gesture recognition for shader interaction
 */
export interface MultiTouchGesture {
  type: 'tap' | 'swipe' | 'pinch' | 'rotate' | 'pan' | 'none';
  center: { x: number; y: number };
  velocity: { x: number; y: number };
  scale: number;
  rotation: number;
  distance: number;
  touchCount: number;
}

/**
 * Processes multi-touch events and recognizes gestures
 */
export const processMultiTouchGesture = (
  touches: TouchList,
  containerRect: DOMRect,
  previousGesture?: MultiTouchGesture
): MultiTouchGesture => {
  const touchCount = touches.length;
  
  if (touchCount === 0) {
    return {
      type: 'none',
      center: { x: 0.5, y: 0.5 },
      velocity: { x: 0, y: 0 },
      scale: 1.0,
      rotation: 0,
      distance: 0,
      touchCount: 0,
    };
  }
  
  // Calculate center point
  let centerX = 0;
  let centerY = 0;
  
  for (let i = 0; i < touchCount; i++) {
    const touch = touches[i];
    centerX += (touch.clientX - containerRect.left) / containerRect.width;
    centerY += 1.0 - (touch.clientY - containerRect.top) / containerRect.height;
  }
  
  centerX /= touchCount;
  centerY /= touchCount;
  
  // Clamp center to valid range
  centerX = Math.max(0, Math.min(1, centerX));
  centerY = Math.max(0, Math.min(1, centerY));
  
  const center = { x: centerX, y: centerY };
  
  // Calculate velocity if we have previous gesture
  let velocity = { x: 0, y: 0 };
  if (previousGesture && previousGesture.touchCount === touchCount) {
    velocity.x = (center.x - previousGesture.center.x) * 60; // Assume 60fps
    velocity.y = (center.y - previousGesture.center.y) * 60;
  }
  
  // Single touch - tap or pan
  if (touchCount === 1) {
    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    return {
      type: velocityMagnitude > 0.1 ? 'pan' : 'tap',
      center,
      velocity,
      scale: 1.0,
      rotation: 0,
      distance: 0,
      touchCount,
    };
  }
  
  // Two touches - pinch, rotate, or swipe
  if (touchCount === 2) {
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const x1 = (touch1.clientX - containerRect.left) / containerRect.width;
    const y1 = 1.0 - (touch1.clientY - containerRect.top) / containerRect.height;
    const x2 = (touch2.clientX - containerRect.left) / containerRect.width;
    const y2 = 1.0 - (touch2.clientY - containerRect.top) / containerRect.height;
    
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    let scale = 1.0;
    let rotation = 0;
    let gestureType: MultiTouchGesture['type'] = 'pan';
    
    if (previousGesture && previousGesture.touchCount === 2) {
      scale = distance / (previousGesture.distance || 1);
      rotation = angle - (previousGesture.rotation || 0);
      
      // Determine gesture type based on changes
      const scaleChange = Math.abs(scale - 1.0);
      const rotationChange = Math.abs(rotation);
      const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      
      if (scaleChange > 0.05) {
        gestureType = 'pinch';
      } else if (rotationChange > 0.1) {
        gestureType = 'rotate';
      } else if (velocityMagnitude > 0.2) {
        gestureType = 'swipe';
      }
    }
    
    return {
      type: gestureType,
      center,
      velocity,
      scale,
      rotation: angle,
      distance,
      touchCount,
    };
  }
  
  // Three or more touches - complex gesture (treat as pan for now)
  return {
    type: 'pan',
    center,
    velocity,
    scale: 1.0,
    rotation: 0,
    distance: 0,
    touchCount,
  };
};

/**
 * Enhanced responsive scaling and window resize handling utilities
 */

export interface ResponsiveTransitionState {
  isTransitioning: boolean;
  progress: number; // 0.0 to 1.0
  startTime: number;
  duration: number;
  fromSettings: ResponsiveShaderSettings;
  toSettings: ResponsiveShaderSettings;
}

export interface WindowResizeEvent {
  viewport: ViewportDimensions;
  previousViewport: ViewportDimensions;
  resizeType: 'window' | 'orientation' | 'zoom';
  timestamp: number;
}

/**
 * Advanced responsive transition manager for smooth scaling during resize events
 */
export class ResponsiveTransitionManager {
  private transitionState: ResponsiveTransitionState | null = null;
  private easing: keyof typeof easingFunctions = 'easeOut';
  
  constructor(
    private defaultDuration: number = 300,
    easing: keyof typeof easingFunctions = 'easeOut'
  ) {
    this.easing = easing;
  }
  
  /**
   * Starts a smooth transition between responsive settings
   */
  startTransition(
    fromSettings: ResponsiveShaderSettings,
    toSettings: ResponsiveShaderSettings,
    duration?: number
  ): void {
    this.transitionState = {
      isTransitioning: true,
      progress: 0,
      startTime: performance.now(),
      duration: duration || this.defaultDuration,
      fromSettings: { ...fromSettings },
      toSettings: { ...toSettings },
    };
  }
  
  /**
   * Updates the transition and returns current interpolated settings
   */
  update(): ResponsiveShaderSettings | null {
    if (!this.transitionState) return null;
    
    const elapsed = performance.now() - this.transitionState.startTime;
    const rawProgress = Math.min(elapsed / this.transitionState.duration, 1.0);
    
    // Apply easing
    this.transitionState.progress = easingFunctions[this.easing](rawProgress);
    
    // Interpolate settings
    const { fromSettings, toSettings, progress } = this.transitionState;
    const interpolatedSettings: ResponsiveShaderSettings = {
      renderScale: this.lerp(fromSettings.renderScale, toSettings.renderScale, progress),
      particleCount: Math.round(this.lerp(fromSettings.particleCount, toSettings.particleCount, progress)),
      interactionRadius: this.lerp(fromSettings.interactionRadius, toSettings.interactionRadius, progress),
      animationSpeed: this.lerp(fromSettings.animationSpeed, toSettings.animationSpeed, progress),
      qualityLevel: this.lerp(fromSettings.qualityLevel, toSettings.qualityLevel, progress),
      enableComplexEffects: progress > 0.5 ? toSettings.enableComplexEffects : fromSettings.enableComplexEffects,
      debounceDelay: Math.round(this.lerp(fromSettings.debounceDelay, toSettings.debounceDelay, progress)),
      transitionDuration: Math.round(this.lerp(fromSettings.transitionDuration, toSettings.transitionDuration, progress)),
    };
    
    // Complete transition if finished
    if (rawProgress >= 1.0) {
      this.transitionState = null;
    }
    
    return interpolatedSettings;
  }
  
  /**
   * Checks if currently transitioning
   */
  isTransitioning(): boolean {
    return this.transitionState !== null;
  }
  
  /**
   * Gets current transition progress (0-1)
   */
  getProgress(): number {
    return this.transitionState?.progress || 1.0;
  }
  
  /**
   * Forces transition to complete immediately
   */
  completeTransition(): ResponsiveShaderSettings | null {
    if (!this.transitionState) return null;
    
    const finalSettings = { ...this.transitionState.toSettings };
    this.transitionState = null;
    return finalSettings;
  }
  
  /**
   * Cancels current transition
   */
  cancelTransition(): void {
    this.transitionState = null;
  }
  
  /**
   * Linear interpolation helper
   */
  private lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t;
  }
  
  /**
   * Sets easing function for transitions
   */
  setEasing(easing: keyof typeof easingFunctions): void {
    this.easing = easing;
  }
  
  /**
   * Sets default transition duration
   */
  setDefaultDuration(duration: number): void {
    this.defaultDuration = Math.max(100, Math.min(duration, 2000));
  }
}

/**
 * Advanced responsive scale manager with debouncing and smooth transitions
 */
export class ResponsiveScaleManager {
  private resizeTimeout: number | null = null;
  private isResizing = false;
  private resizeStartTime = 0;
  private currentViewport: ViewportDimensions;
  private resizeHistory: WindowResizeEvent[] = [];
  private maxHistoryLength = 10;
  
  constructor(
    private debounceDelay: number = 150,
    private transitionDuration: number = 300
  ) {
    this.currentViewport = calculateViewportDimensions();
  }
  
  /**
   * Handles window resize with debouncing and smooth transitions
   */
  handleResize(
    callback: (event: WindowResizeEvent, settings: ResponsiveShaderSettings) => void,
    deviceCapabilities: DeviceCapabilities
  ): void {
    // Clear existing timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    const newViewport = calculateViewportDimensions();
    const previousViewport = { ...this.currentViewport };
    
    // Determine resize type
    let resizeType: WindowResizeEvent['resizeType'] = 'window';
    if (newViewport.orientation !== previousViewport.orientation) {
      resizeType = 'orientation';
    } else if (Math.abs(newViewport.pixelRatio - previousViewport.pixelRatio) > 0.1) {
      resizeType = 'zoom';
    }
    
    // Start resize state if not already resizing
    if (!this.isResizing) {
      this.isResizing = true;
      this.resizeStartTime = performance.now();
    }
    
    // Create resize event
    const resizeEvent: WindowResizeEvent = {
      viewport: newViewport,
      previousViewport,
      resizeType,
      timestamp: performance.now(),
    };
    
    // Add to history
    this.resizeHistory.push(resizeEvent);
    if (this.resizeHistory.length > this.maxHistoryLength) {
      this.resizeHistory.shift();
    }
    
    // Update current viewport
    this.currentViewport = newViewport;
    
    // Set debounced callback
    this.resizeTimeout = window.setTimeout(() => {
      this.isResizing = false;
      
      // Calculate new responsive settings
      const newSettings = calculateResponsiveShaderSettingsWithTransition(
        newViewport,
        deviceCapabilities,
        {},
        undefined
      );
      
      // Call callback with event and settings
      callback(resizeEvent, newSettings);
      
      this.resizeTimeout = null;
    }, this.debounceDelay);
  }
  
  /**
   * Gets current resize state
   */
  getResizeState(): {
    isResizing: boolean;
    duration: number;
    resizeType: WindowResizeEvent['resizeType'] | null;
  } {
    const latestEvent = this.resizeHistory[this.resizeHistory.length - 1];
    return {
      isResizing: this.isResizing,
      duration: this.isResizing ? performance.now() - this.resizeStartTime : 0,
      resizeType: latestEvent?.resizeType || null,
    };
  }
  
  /**
   * Gets resize history for analysis
   */
  getResizeHistory(): WindowResizeEvent[] {
    return [...this.resizeHistory];
  }
  
  /**
   * Clears resize history
   */
  clearHistory(): void {
    this.resizeHistory = [];
  }
  
  /**
   * Updates debounce settings
   */
  setDebounceDelay(delay: number): void {
    this.debounceDelay = Math.max(50, Math.min(delay, 1000));
  }
  
  /**
   * Updates transition duration
   */
  setTransitionDuration(duration: number): void {
    this.transitionDuration = Math.max(100, Math.min(duration, 2000));
  }
  
  /**
   * Forces resize handling to complete immediately
   */
  forceComplete(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    this.isResizing = false;
  }
}

/**
 * Enhanced mobile resize optimizations for touch devices
 */
export const handleMobileResizeOptimizations = (
  viewport: ViewportDimensions,
  resizeEvent: WindowResizeEvent
): ResponsiveShaderSettings => {
  const baseSettings = calculateResponsiveShaderSettings(viewport, {
    tier: 'low',
    score: 0.4,
    features: {
      webgl2: false,
      floatTextures: false,
      halfFloatTextures: false,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 2048,
      maxVertexAttribs: 8,
      maxFragmentUniforms: 16,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      cores: 4,
      deviceMemory: 4,
      pixelRatio: viewport.pixelRatio,
      refreshRate: 60,
      renderer: 'mobile',
      vendor: 'unknown',
    },
  } as DeviceCapabilities);
  
  // Mobile-specific optimizations based on resize type
  if (resizeEvent.resizeType === 'orientation') {
    // Orientation change optimizations
    return {
      ...baseSettings,
      particleCount: Math.floor(baseSettings.particleCount * 0.7), // Reduce particles during orientation change
      animationSpeed: baseSettings.animationSpeed * 0.8, // Slower animations during transition
      debounceDelay: 200, // Longer debounce for orientation changes
      transitionDuration: 400, // Longer transition for orientation
    };
  } else if (resizeEvent.resizeType === 'zoom') {
    // Zoom/pinch optimizations
    return {
      ...baseSettings,
      renderScale: Math.min(0.8, baseSettings.renderScale), // Lower render scale during zoom
      enableComplexEffects: false, // Disable complex effects during zoom
      debounceDelay: 100, // Shorter debounce for zoom
      transitionDuration: 200, // Shorter transition for zoom
    };
  }
  
  // Standard mobile window resize
  return {
    ...baseSettings,
    debounceDelay: 150,
    transitionDuration: 300,
  };
};

/**
 * Touch interaction processing for mobile devices during resize
 */
export interface TouchInteraction {
  isActive: boolean;
  position: { x: number; y: number };
  pressure: number;
  radiusX: number;
  radiusY: number;
  rotationAngle: number;
  timestamp: number;
}

/**
 * Processes touch interactions with responsive scaling considerations
 */
export const processTouchInteraction = (
  touch: Touch,
  containerRect: DOMRect,
  viewport: ViewportDimensions
): TouchInteraction => {
  // Calculate normalized position with responsive scaling
  const x = Math.max(0, Math.min(1, (touch.clientX - containerRect.left) / containerRect.width));
  const y = Math.max(0, Math.min(1, 1.0 - (touch.clientY - containerRect.top) / containerRect.height));
  
  // Adjust touch properties based on viewport characteristics
  let adjustedRadiusX = touch.radiusX || 20;
  let adjustedRadiusY = touch.radiusY || 20;
  
  // Scale touch radius based on device pixel ratio and screen size
  const scaleFactor = Math.min(viewport.pixelRatio, 2.0) * (viewport.width / 1920);
  adjustedRadiusX *= scaleFactor;
  adjustedRadiusY *= scaleFactor;
  
  // Clamp touch radius to reasonable bounds
  adjustedRadiusX = Math.max(10, Math.min(adjustedRadiusX, 50));
  adjustedRadiusY = Math.max(10, Math.min(adjustedRadiusY, 50));
  
  return {
    isActive: true,
    position: { x, y },
    pressure: touch.force || 1.0,
    radiusX: adjustedRadiusX,
    radiusY: adjustedRadiusY,
    rotationAngle: touch.rotationAngle || 0,
    timestamp: performance.now(),
  };
};

/**
 * Calculates optimal touch interaction radius based on screen size and device type
 */
export const calculateTouchInteractionRadius = (
  viewport: ViewportDimensions,
  baseRadius: number = 0.3
): number => {
  let adjustedRadius = baseRadius;
  
  // Adjust based on screen size
  if (viewport.width <= DEFAULT_BREAKPOINTS.xs) {
    adjustedRadius *= 0.8; // Smaller radius for small screens
  } else if (viewport.width <= DEFAULT_BREAKPOINTS.sm) {
    adjustedRadius *= 0.9; // Slightly smaller for medium mobile screens
  }
  
  // Adjust based on orientation
  if (viewport.orientation === 'portrait') {
    adjustedRadius *= 0.85; // Smaller radius in portrait mode
  }
  
  // Adjust based on pixel ratio (high-DPI screens)
  if (viewport.pixelRatio > 2) {
    adjustedRadius *= 0.9; // Slightly smaller for high-DPI screens
  }
  
  return Math.max(0.15, Math.min(adjustedRadius, 0.5)); // Clamp to reasonable bounds
};

/**
 * Enhanced responsive shader settings calculation with smooth transitions
 */
export const calculateResponsiveShaderSettingsWithTransition = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities,
  baseSettings: Partial<ResponsiveShaderSettings> = {},
  previousSettings?: ResponsiveShaderSettings
): ResponsiveShaderSettings => {
  // Calculate new settings
  const newSettings = calculateResponsiveShaderSettings(viewport, deviceCapabilities, baseSettings);
  
  // If we have previous settings, ensure smooth transitions
  if (previousSettings) {
    // Limit dramatic changes to prevent jarring transitions
    const maxParticleChange = 0.3; // Max 30% change in particle count
    const maxScaleChange = 0.2; // Max 20% change in render scale
    
    const particleRatio = newSettings.particleCount / previousSettings.particleCount;
    if (particleRatio > 1 + maxParticleChange) {
      newSettings.particleCount = Math.floor(previousSettings.particleCount * (1 + maxParticleChange));
    } else if (particleRatio < 1 - maxParticleChange) {
      newSettings.particleCount = Math.floor(previousSettings.particleCount * (1 - maxParticleChange));
    }
    
    const scaleRatio = newSettings.renderScale / previousSettings.renderScale;
    if (scaleRatio > 1 + maxScaleChange) {
      newSettings.renderScale = previousSettings.renderScale * (1 + maxScaleChange);
    } else if (scaleRatio < 1 - maxScaleChange) {
      newSettings.renderScale = previousSettings.renderScale * (1 - maxScaleChange);
    }
  }
  
  return newSettings;
};

/**
 * Calculates orientation-specific optimizations for mobile devices
 */
export const calculateOrientationOptimizations = (
  viewport: ViewportDimensions,
  previousOrientation: 'portrait' | 'landscape'
): ResponsiveShaderSettings => {
  const baseSettings = calculateResponsiveShaderSettings(viewport, {
    tier: viewport.deviceType === 'mobile' ? 'low' : 'medium',
    score: viewport.deviceType === 'mobile' ? 0.4 : 0.6,
    features: {
      webgl2: false,
      floatTextures: false,
      halfFloatTextures: false,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 2048,
      maxVertexAttribs: 8,
      maxFragmentUniforms: 16,
      isMobile: viewport.deviceType === 'mobile',
      isTablet: viewport.deviceType === 'tablet',
      isDesktop: viewport.deviceType === 'desktop',
      cores: navigator.hardwareConcurrency || 4,
      deviceMemory: (navigator as any).deviceMemory || 4,
      pixelRatio: viewport.pixelRatio,
      refreshRate: 60,
      renderer: 'unknown',
      vendor: 'unknown',
    },
  } as DeviceCapabilities);

  // Apply orientation-specific adjustments
  if (viewport.orientation === 'portrait') {
    // Portrait mode optimizations
    return {
      ...baseSettings,
      particleCount: Math.floor(baseSettings.particleCount * 0.8), // Fewer particles in portrait
      interactionRadius: baseSettings.interactionRadius * 0.9, // Smaller interaction area
      animationSpeed: baseSettings.animationSpeed * 0.9, // Slightly slower animations
      transitionDuration: 400, // Longer transition for orientation change
    };
  } else {
    // Landscape mode optimizations
    return {
      ...baseSettings,
      particleCount: Math.floor(baseSettings.particleCount * 1.1), // More particles in landscape
      interactionRadius: baseSettings.interactionRadius * 1.1, // Larger interaction area
      animationSpeed: baseSettings.animationSpeed * 1.05, // Slightly faster animations
      transitionDuration: 350, // Standard transition duration
    };
  }
};

/**
 * Calculates ultrawide display optimizations
 */
export const calculateUltrawideOptimizations = (
  viewport: ViewportDimensions,
  deviceCapabilities: DeviceCapabilities
): ResponsiveShaderSettings => {
  const baseSettings = calculateResponsiveShaderSettings(viewport, deviceCapabilities);

  if (viewport.isUltrawide) {
    return {
      ...baseSettings,
      particleCount: Math.floor(baseSettings.particleCount * 1.3), // More particles for ultrawide
      interactionRadius: baseSettings.interactionRadius * 1.2, // Larger interaction radius
      renderScale: Math.min(baseSettings.renderScale * 0.9, 1.0), // Slightly lower render scale for performance
      animationSpeed: baseSettings.animationSpeed * 1.1, // Faster animations for better visual flow
    };
  }

  return baseSettings;
};

/**
 * Processes touch interactions with enhanced mobile optimizations
 */
export const processTouchInteraction = (
  touch: Touch,
  containerRect: DOMRect,
  previousTouch?: TouchInteraction
): TouchInteraction => {
  // Calculate normalized position
  const x = Math.max(0, Math.min(1, (touch.clientX - containerRect.left) / containerRect.width));
  const y = Math.max(0, Math.min(1, 1.0 - (touch.clientY - containerRect.top) / containerRect.height));

  // Calculate touch properties with mobile optimizations
  const pressure = touch.force || 1.0;
  const radiusX = Math.max(20, Math.min(touch.radiusX || 25, 60)); // Clamp touch radius
  const radiusY = Math.max(20, Math.min(touch.radiusY || 25, 60));
  const rotationAngle = touch.rotationAngle || 0;
  const timestamp = performance.now();

  return {
    isActive: true,
    position: { x, y },
    pressure,
    radiusX,
    radiusY,
    rotationAngle,
    timestamp,
  };
};

/**
 * Calculates touch interaction radius with responsive scaling
 */
export const calculateTouchInteractionRadius = (
  baseRadius: number,
  touchInteraction?: TouchInteraction,
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): number => {
  let adjustedRadius = baseRadius;

  // Adjust based on device type
  if (deviceType === 'mobile') {
    adjustedRadius *= 0.8; // Smaller radius for mobile
  } else if (deviceType === 'tablet') {
    adjustedRadius *= 1.1; // Larger radius for tablet
  }

  // Adjust based on touch properties if available
  if (touchInteraction) {
    const touchSize = Math.sqrt(touchInteraction.radiusX * touchInteraction.radiusY);
    const sizeMultiplier = Math.max(0.7, Math.min(touchSize / 30, 1.5)); // Scale based on touch size
    adjustedRadius *= sizeMultiplier;

    // Adjust based on pressure if available
    if (touchInteraction.pressure > 0) {
      const pressureMultiplier = Math.max(0.8, Math.min(touchInteraction.pressure * 1.2, 1.4));
      adjustedRadius *= pressureMultiplier;
    }
  }

  return Math.max(0.1, Math.min(adjustedRadius, 0.6)); // Clamp to reasonable bounds
};