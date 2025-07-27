/**
 * Fallback shader implementations for graceful degradation
 * Provides simplified shaders when the main enhanced shader fails
 */

/**
 * Simple fallback vertex shader - compatible with WebGL 1.0
 */
export const fallbackVertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`;

/**
 * Minimal fallback fragment shader - basic animated background
 */
export const minimalFallbackFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float time;
  uniform vec2 resolution;
  uniform vec3 primaryColor;
  uniform vec3 backgroundColor;
  uniform float intensity;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Simple animated gradient
    float gradient = sin(uv.x * 3.14159 + time * 0.5) * 0.5 + 0.5;
    gradient *= sin(uv.y * 3.14159 + time * 0.3) * 0.5 + 0.5;
    
    // Add some noise for texture
    float n = noise(uv * 10.0 + time * 0.1) * 0.1;
    
    // Mix colors
    vec3 color = mix(backgroundColor, primaryColor, gradient + n);
    
    gl_FragColor = vec4(color, intensity * 0.3);
  }
`;

/**
 * Reduced quality fallback fragment shader - simplified particle system
 */
export const reducedFallbackFragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float time;
  uniform vec2 resolution;
  uniform vec3 primaryColor;
  uniform vec3 accentColor;
  uniform vec3 backgroundColor;
  uniform float intensity;
  uniform float particleCount;
  uniform float flowSpeed;

  // Simple hash function for pseudo-random numbers
  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }

  // Simple 2D noise
  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    
    float res = mix(
      mix(hash(ip.x + ip.y * 57.0), hash(ip.x + 1.0 + ip.y * 57.0), u.x),
      mix(hash(ip.x + (ip.y + 1.0) * 57.0), hash(ip.x + 1.0 + (ip.y + 1.0) * 57.0), u.x),
      u.y
    );
    
    return res * res;
  }

  // Simplified particle system
  float particles(vec2 uv) {
    float result = 0.0;
    float animTime = time * flowSpeed;
    
    // Reduced particle count for performance
    float maxParticles = min(particleCount, 20.0);
    
    for (float i = 0.0; i < maxParticles; i += 1.0) {
      if (i >= maxParticles) break;
      
      // Simple particle movement
      vec2 pos = vec2(
        sin(animTime * 0.3 + i * 0.5) * 0.8,
        cos(animTime * 0.2 + i * 0.7) * 0.6
      );
      
      // Simple distance calculation
      float dist = length(uv - pos);
      float particle = 1.0 / (1.0 + dist * 50.0);
      
      result += particle;
    }
    
    return result;
  }

  // Simple flowing lines
  float flowingLines(vec2 uv) {
    float lines = 0.0;
    float animTime = time * flowSpeed;
    
    // Fewer lines for performance
    for (float i = 0.0; i < 3.0; i += 1.0) {
      float angle = i * 1.047 + animTime * 0.1; // 60 degrees apart
      vec2 direction = vec2(cos(angle), sin(angle));
      
      float line = abs(sin(dot(uv, direction) * 4.0 + animTime));
      line = smoothstep(0.8, 0.9, line);
      
      lines += line * 0.3;
    }
    
    return lines;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    
    // Background gradient
    vec3 background = mix(backgroundColor, primaryColor * 0.1, length(uv) * 0.3);
    
    // Add particles
    float particleLayer = particles(uv);
    
    // Add flowing lines
    float lineLayer = flowingLines(uv);
    
    // Combine layers
    vec3 particleColor = mix(primaryColor, accentColor, sin(time * 0.5) * 0.5 + 0.5);
    vec3 lineColor = accentColor * 0.8;
    
    vec3 finalColor = background;
    finalColor = mix(finalColor, particleColor, particleLayer * 0.6);
    finalColor = mix(finalColor, lineColor, lineLayer * 0.4);
    
    // Simple noise overlay
    float noiseOverlay = noise(uv * 5.0 + time * 0.1) * 0.05 + 0.95;
    finalColor *= noiseOverlay;
    
    gl_FragColor = vec4(finalColor, intensity * 0.7);
  }
`;

/**
 * CSS-based fallback for when WebGL is completely unavailable
 */
export const cssOnlyFallback = `
  .shader-fallback {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      var(--background-color, #ffffff) 0%,
      var(--primary-color, #f56500) 25%,
      var(--accent-color, #e83e8c) 50%,
      var(--primary-color, #f56500) 75%,
      var(--background-color, #ffffff) 100%
    );
    background-size: 400% 400%;
    animation: gradientShift 15s ease-in-out infinite;
    opacity: 0.3;
    mix-blend-mode: screen;
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    25% {
      background-position: 100% 50%;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
  }

  .shader-fallback::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 30% 70%,
      var(--accent-color, #e83e8c) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 30%,
      var(--primary-color, #f56500) 0%,
      transparent 50%
    );
    animation: floatingOrbs 20s ease-in-out infinite;
    opacity: 0.4;
  }

  @keyframes floatingOrbs {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(10px, -15px) scale(1.1);
    }
    50% {
      transform: translate(-5px, 10px) scale(0.9);
    }
    75% {
      transform: translate(-10px, -5px) scale(1.05);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .shader-fallback {
      animation: none;
      background: linear-gradient(
        45deg,
        var(--background-color, #ffffff) 0%,
        var(--primary-color, #f56500) 50%,
        var(--background-color, #ffffff) 100%
      );
    }
    
    .shader-fallback::before {
      animation: none;
      opacity: 0.2;
    }
  }

  /* Dark theme adjustments */
  .dark .shader-fallback {
    --background-color: #0d0d0d;
    --primary-color: #ff7733;
    --accent-color: #f25c92;
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .shader-fallback {
      opacity: 0.2;
    }
    
    .shader-fallback::before {
      opacity: 0.1;
    }
  }
`;

/**
 * Static fallback for maximum compatibility
 */
export const staticFallback = `
  .shader-static-fallback {
    position: absolute;
    inset: 0;
    background: var(--background-color, #ffffff);
    opacity: 0.1;
  }

  .shader-static-fallback::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      var(--primary-color, #f56500) 0%,
      transparent 70%
    );
    opacity: 0.3;
  }

  .dark .shader-static-fallback {
    --background-color: #0d0d0d;
    --primary-color: #ff7733;
  }
`;

/**
 * Shader source validation and selection
 */
export interface FallbackShaderSet {
  vertex: string;
  fragment: string;
  level: 'minimal' | 'reduced' | 'css' | 'static';
  description: string;
}

/**
 * Gets appropriate fallback shader based on capabilities and error level
 */
export function getFallbackShader(
  webglSupported: boolean,
  errorSeverity: 'low' | 'medium' | 'high' | 'critical',
  deviceCapabilities?: {
    maxTextureSize: number;
    maxFragmentUniforms: number;
  }
): FallbackShaderSet {
  
  // Critical errors or no WebGL support - use CSS fallback
  if (!webglSupported || errorSeverity === 'critical') {
    return {
      vertex: '',
      fragment: '',
      level: 'css',
      description: 'CSS-only animated background (WebGL unavailable)',
    };
  }

  // High error rate or very limited hardware - minimal shader
  if (errorSeverity === 'high' || 
      (deviceCapabilities && 
       (deviceCapabilities.maxTextureSize < 512 || 
        deviceCapabilities.maxFragmentUniforms < 8))) {
    return {
      vertex: fallbackVertexShader,
      fragment: minimalFallbackFragmentShader,
      level: 'minimal',
      description: 'Minimal animated background with basic effects',
    };
  }

  // Medium error rate or limited hardware - reduced shader
  if (errorSeverity === 'medium' || 
      (deviceCapabilities && 
       (deviceCapabilities.maxTextureSize < 1024 || 
        deviceCapabilities.maxFragmentUniforms < 16))) {
    return {
      vertex: fallbackVertexShader,
      fragment: reducedFallbackFragmentShader,
      level: 'reduced',
      description: 'Reduced quality shader with simplified particle system',
    };
  }

  // Low error rate - try reduced shader as fallback
  return {
    vertex: fallbackVertexShader,
    fragment: reducedFallbackFragmentShader,
    level: 'reduced',
    description: 'Fallback shader with reduced complexity',
  };
}

/**
 * Validates shader source for WebGL compatibility
 */
export function validateShaderCompatibility(
  fragmentSource: string,
  webglVersion: number
): { compatible: boolean; issues: string[]; fixes: string[] } {
  const issues: string[] = [];
  const fixes: string[] = [];

  // Check WebGL version compatibility
  if (webglVersion < 2) {
    if (fragmentSource.includes('#version 300 es')) {
      issues.push('WebGL 2.0 version directive in WebGL 1.0 context');
      fixes.push('Remove #version 300 es or use WebGL 1.0 compatible syntax');
    }

    if (fragmentSource.includes('in ') || fragmentSource.includes('out ')) {
      issues.push('WebGL 2.0 in/out keywords in WebGL 1.0 context');
      fixes.push('Use attribute/varying keywords instead of in/out');
    }
  }

  // Check precision qualifiers
  if (!fragmentSource.includes('precision') && fragmentSource.includes('float')) {
    issues.push('Missing precision qualifier for float types');
    fixes.push('Add "precision mediump float;" at the beginning');
  }

  // Check for potentially problematic functions
  const problematicFunctions = ['texture2D', 'texture2DLod', 'dFdx', 'dFdy'];
  problematicFunctions.forEach(func => {
    if (fragmentSource.includes(func) && webglVersion < 2) {
      if (func.includes('dFd')) {
        issues.push(`${func} requires OES_standard_derivatives extension`);
        fixes.push(`Check for extension support before using ${func}`);
      }
    }
  });

  // Check for complex loops that might cause issues
  const loopMatches = fragmentSource.match(/for\s*\([^)]*;\s*[^;]*<\s*(\d+)/g);
  if (loopMatches) {
    loopMatches.forEach(match => {
      const iterations = parseInt(match.match(/(\d+)$/)?.[1] || '0');
      if (iterations > 100) {
        issues.push(`Large loop with ${iterations} iterations may cause performance issues`);
        fixes.push('Consider reducing loop iterations or using alternative approaches');
      }
    });
  }

  return {
    compatible: issues.length === 0,
    issues,
    fixes,
  };
}

/**
 * Creates a CSS fallback element
 */
export function createCSSFallback(
  container: HTMLElement,
  themeColors: {
    primary: string;
    accent: string;
    background: string;
  },
  intensity: number = 0.3
): HTMLElement {
  const fallbackElement = document.createElement('div');
  fallbackElement.className = 'shader-fallback';
  
  // Apply theme colors as CSS custom properties
  fallbackElement.style.setProperty('--primary-color', themeColors.primary);
  fallbackElement.style.setProperty('--accent-color', themeColors.accent);
  fallbackElement.style.setProperty('--background-color', themeColors.background);
  fallbackElement.style.opacity = intensity.toString();

  // Add CSS styles if not already present
  if (!document.getElementById('shader-fallback-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'shader-fallback-styles';
    styleElement.textContent = cssOnlyFallback;
    document.head.appendChild(styleElement);
  }

  container.appendChild(fallbackElement);
  return fallbackElement;
}

/**
 * Creates a static fallback element for maximum compatibility
 */
export function createStaticFallback(
  container: HTMLElement,
  themeColors: {
    primary: string;
    background: string;
  },
  intensity: number = 0.1
): HTMLElement {
  const fallbackElement = document.createElement('div');
  fallbackElement.className = 'shader-static-fallback';
  
  // Apply theme colors
  fallbackElement.style.setProperty('--primary-color', themeColors.primary);
  fallbackElement.style.setProperty('--background-color', themeColors.background);
  fallbackElement.style.opacity = intensity.toString();

  // Add CSS styles if not already present
  if (!document.getElementById('shader-static-fallback-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'shader-static-fallback-styles';
    styleElement.textContent = staticFallback;
    document.head.appendChild(styleElement);
  }

  container.appendChild(fallbackElement);
  return fallbackElement;
}