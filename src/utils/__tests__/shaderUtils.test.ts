import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import test from 'node:test';
import { describe } from 'node:test';
import { describe } from 'node:test';
import {
  validateParticleConfig,
  calculateOptimalParticleCount,
  generateParticlePhysics,
  calculateBrownianMotion,
  validateMouseInteraction,
  calculateParticleLifecycle,
  AdvancedPerformanceMonitor,
  detectDeviceCapabilities,
  QUALITY_PRESETS,
  getOptimalQualityPreset,
  getBatteryStatus,
  detectThermalThrottling,
  getThemeColors,
  interpolateMousePosition,
  calculateMouseVelocity,
  calculateDynamicInteractionRadius,
  generateMouseTrail,
  calculateBezierFlow,
  generateVoronoiCell,
  calculateHexagonalGrid,
  generateSpiralPattern,
  calculateFluidMesh,
  generateOrganicNoise,
  clampColor,
  screenBlend,
  overlayBlend,
  softLightBlend,
  colorDodgeBlend,
  multiplyBlend,
  additiveBlend,
  subtractiveBlend,
  blendColors,
  composeLayers,
  calculateAtmosphericPerspective,
  adjustColorTemperature,
  adjustContrast,
  adjustSaturation,
  easingFunctions,
  interpolateThemeColors,
  calculateThemeIntensity,
  calculateThemeContrast,
  calculateThemeGlow,
  ThemeTransitionManager,
  THEME_PALETTES,
  getThemeColorsFromPalette,
  calculateResponsiveScaling,
  SmoothResizeManager,
  calculateMobileTouchOptimizations,
  processMultiTouchGesture,
  type BlendMode,
  type ViewportDimensions,
  type MultiTouchGesture,
} from '../shaderUtils';

describe('shaderUtils', () => {
  describe('validateParticleConfig', () => {
    test('should clamp particle count within valid range', () => {
      expect(validateParticleConfig({ particleCount: 5 }).particleCount).toBe(10); // Below minimum
      expect(validateParticleConfig({ particleCount: 150 }).particleCount).toBe(150); // Within range
      expect(validateParticleConfig({ particleCount: 500 }).particleCount).toBe(300); // Above maximum
    });

    test('should clamp animation speed within valid range', () => {
      expect(validateParticleConfig({ animationSpeed: 0.05 }).animationSpeed).toBe(0.1); // Below minimum
      expect(validateParticleConfig({ animationSpeed: 1.5 }).animationSpeed).toBe(1.5); // Within range
      expect(validateParticleConfig({ animationSpeed: 5.0 }).animationSpeed).toBe(3.0); // Above maximum
    });

    test('should clamp intensity within valid range', () => {
      expect(validateParticleConfig({ intensity: -0.5 }).intensity).toBe(0.0); // Below minimum
      expect(validateParticleConfig({ intensity: 0.7 }).intensity).toBe(0.7); // Within range
      expect(validateParticleConfig({ intensity: 1.5 }).intensity).toBe(1.0); // Above maximum
    });

    test('should use default values for missing properties', () => {
      const config = validateParticleConfig({});
      expect(config.particleCount).toBe(100);
      expect(config.animationSpeed).toBe(1.0);
      expect(config.interactionEnabled).toBe(true);
      expect(config.intensity).toBe(0.6);
    });
  });

  describe('calculateOptimalParticleCount', () => {
    test('should apply correct multipliers for different device types', () => {
      const baseCount = 100;
      
      expect(calculateOptimalParticleCount(baseCount, 'mobile')).toBe(50);
      expect(calculateOptimalParticleCount(baseCount, 'desktop')).toBe(100);
      expect(calculateOptimalParticleCount(baseCount, 'highEnd')).toBe(200);
    });

    test('should return integer values', () => {
      const baseCount = 75;
      
      expect(Number.isInteger(calculateOptimalParticleCount(baseCount, 'mobile'))).toBe(true);
      expect(Number.isInteger(calculateOptimalParticleCount(baseCount, 'desktop'))).toBe(true);
      expect(Number.isInteger(calculateOptimalParticleCount(baseCount, 'highEnd'))).toBe(true);
    });
  });

  describe('generateParticlePhysics', () => {
    test('should generate consistent physics parameters for same input', () => {
      const physics1 = generateParticlePhysics(5, 1.0);
      const physics2 = generateParticlePhysics(5, 1.0);
      
      expect(physics1.seed.x).toBe(physics2.seed.x);
      expect(physics1.seed.y).toBe(physics2.seed.y);
      expect(physics1.baseFrequency.x).toBe(physics2.baseFrequency.x);
      expect(physics1.baseFrequency.y).toBe(physics2.baseFrequency.y);
    });

    test('should generate different parameters for different particles', () => {
      const physics1 = generateParticlePhysics(1, 1.0);
      const physics2 = generateParticlePhysics(2, 1.0);
      
      expect(physics1.seed.x).not.toBe(physics2.seed.x);
      expect(physics1.seed.y).not.toBe(physics2.seed.y);
    });

    test('should have reasonable parameter ranges', () => {
      const physics = generateParticlePhysics(10, 1.0);
      
      expect(physics.seed.x).toBeGreaterThan(0);
      expect(physics.seed.y).toBeGreaterThan(0);
      expect(physics.baseFrequency.x).toBeGreaterThan(0);
      expect(physics.baseFrequency.y).toBeGreaterThan(0);
      expect(physics.amplitude.primary).toBe(0.7);
      expect(physics.amplitude.secondary).toBe(0.3);
    });
  });

  describe('calculateBrownianMotion', () => {
    test('should return motion parameters with correct structure', () => {
      const motion = calculateBrownianMotion({ x: 0.5, y: 0.5 }, 1.0);
      
      expect(motion).toHaveProperty('octave1');
      expect(motion).toHaveProperty('octave2');
      expect(motion.octave1).toHaveProperty('scale');
      expect(motion.octave1).toHaveProperty('amplitude');
      expect(motion.octave1).toHaveProperty('timeOffset');
    });

    test('should scale amplitude with intensity', () => {
      const motion1 = calculateBrownianMotion({ x: 0.5, y: 0.5 }, 1.0, 0.5);
      const motion2 = calculateBrownianMotion({ x: 0.5, y: 0.5 }, 1.0, 1.0);
      
      expect(motion1.octave1.amplitude).toBeLessThan(motion2.octave1.amplitude);
      expect(motion1.octave2.amplitude).toBeLessThan(motion2.octave2.amplitude);
    });
  });

  describe('validateMouseInteraction', () => {
    test('should detect when particle is within interaction radius', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.6, y: 0.6 };
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      expect(interaction.isInRange).toBe(true);
      expect(interaction.forceMagnitude).toBeGreaterThan(0);
    });

    test('should detect when particle is outside interaction radius', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.9, y: 0.9 };
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      expect(interaction.isInRange).toBe(false);
      expect(interaction.forceMagnitude).toBe(0);
      expect(interaction.interactionType).toBe('none');
    });

    test('should identify repulsion zone for close particles', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.52, y: 0.52 }; // Very close to mouse
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      expect(interaction.interactionType).toBe('repulsion');
      expect(interaction.forceMagnitude).toBeGreaterThan(0.5);
    });

    test('should identify orbital zone for medium distance particles', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.6, y: 0.5 }; // Medium distance
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      expect(interaction.interactionType).toBe('orbital');
      expect(interaction.tangent.x).toBe(0); // Perpendicular to horizontal direction
      expect(Math.abs(interaction.tangent.y)).toBe(1);
    });

    test('should identify attraction zone for distant particles', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.68, y: 0.5 }; // Far but within radius
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      expect(interaction.interactionType).toBe('attraction');
      expect(interaction.forceMagnitude).toBeGreaterThan(0);
      expect(interaction.forceMagnitude).toBeLessThan(0.3);
    });

    test('should calculate correct force direction', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.6, y: 0.5 };
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      expect(interaction.direction.x).toBeGreaterThan(0); // Particle is to the right of mouse
      expect(Math.abs(interaction.direction.y)).toBeLessThan(0.01); // Same Y position
    });

    test('should calculate tangent vector for orbital motion', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const particlePos = { x: 0.6, y: 0.5 };
      const radius = 0.2;
      
      const interaction = validateMouseInteraction(mousePos, radius, particlePos);
      
      // Tangent should be perpendicular to direction
      const dotProduct = interaction.direction.x * interaction.tangent.x + 
                       interaction.direction.y * interaction.tangent.y;
      expect(Math.abs(dotProduct)).toBeLessThan(0.01); // Should be ~0 for perpendicular vectors
    });
  });

  describe('interpolateMousePosition', () => {
    test('should interpolate between current and target positions', () => {
      const current = { x: 0.0, y: 0.0 };
      const target = { x: 1.0, y: 1.0 };
      const lerpFactor = 0.5;
      
      const result = interpolateMousePosition(current, target, lerpFactor);
      
      expect(result.x).toBe(0.5);
      expect(result.y).toBe(0.5);
    });

    test('should use default lerp factor when not provided', () => {
      const current = { x: 0.0, y: 0.0 };
      const target = { x: 1.0, y: 1.0 };
      
      const result = interpolateMousePosition(current, target);
      
      expect(result.x).toBe(0.1); // Default lerp factor is 0.1
      expect(result.y).toBe(0.1);
    });

    test('should handle edge cases', () => {
      const current = { x: 0.5, y: 0.5 };
      const target = { x: 0.5, y: 0.5 }; // Same position
      
      const result = interpolateMousePosition(current, target, 0.5);
      
      expect(result.x).toBe(0.5);
      expect(result.y).toBe(0.5);
    });
  });

  describe('calculateMouseVelocity', () => {
    test('should calculate velocity correctly', () => {
      const previous = { x: 0.0, y: 0.0 };
      const current = { x: 0.1, y: 0.1 };
      const deltaTime = 16.67; // ~60fps
      
      const result = calculateMouseVelocity(previous, current, deltaTime);
      
      expect(result.velocity.x).toBeCloseTo(6.0, 1); // 0.1 / 0.01667 * 1000
      expect(result.velocity.y).toBeCloseTo(6.0, 1);
      expect(result.magnitude).toBeGreaterThan(0);
    });

    test('should normalize velocity vector', () => {
      const previous = { x: 0.0, y: 0.0 };
      const current = { x: 0.3, y: 0.4 }; // 3-4-5 triangle
      
      const result = calculateMouseVelocity(previous, current);
      
      expect(result.normalized.x).toBeCloseTo(0.6, 1);
      expect(result.normalized.y).toBeCloseTo(0.8, 1);
      
      // Normalized vector should have magnitude ~1
      const normalizedMagnitude = Math.sqrt(
        result.normalized.x * result.normalized.x + 
        result.normalized.y * result.normalized.y
      );
      expect(normalizedMagnitude).toBeCloseTo(1.0, 1);
    });

    test('should handle zero velocity', () => {
      const previous = { x: 0.5, y: 0.5 };
      const current = { x: 0.5, y: 0.5 }; // No movement
      
      const result = calculateMouseVelocity(previous, current);
      
      expect(result.velocity.x).toBe(0);
      expect(result.velocity.y).toBe(0);
      expect(result.magnitude).toBe(0);
      expect(result.normalized.x).toBe(0);
      expect(result.normalized.y).toBe(0);
    });
  });

  describe('calculateDynamicInteractionRadius', () => {
    test('should increase radius based on velocity', () => {
      const baseRadius = 0.3;
      const lowVelocity = 1.0;
      const highVelocity = 5.0;
      
      const lowResult = calculateDynamicInteractionRadius(baseRadius, lowVelocity);
      const highResult = calculateDynamicInteractionRadius(baseRadius, highVelocity);
      
      expect(lowResult).toBeGreaterThan(baseRadius);
      expect(highResult).toBeGreaterThan(lowResult);
    });

    test('should cap the velocity boost', () => {
      const baseRadius = 0.3;
      const extremeVelocity = 100.0;
      const maxBoost = 0.2;
      
      const result = calculateDynamicInteractionRadius(baseRadius, extremeVelocity, maxBoost);
      
      expect(result).toBeLessThanOrEqual(baseRadius + maxBoost);
    });

    test('should use default max boost when not provided', () => {
      const baseRadius = 0.3;
      const highVelocity = 10.0;
      
      const result = calculateDynamicInteractionRadius(baseRadius, highVelocity);
      
      expect(result).toBeLessThanOrEqual(baseRadius + 0.2); // Default max boost
    });
  });

  describe('generateMouseTrail', () => {
    test('should generate trail effect parameters', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const time = 1.0;
      
      const trail = generateMouseTrail(mousePos, time);
      
      expect(typeof trail.x).toBe('number');
      expect(typeof trail.y).toBe('number');
      expect(Math.abs(trail.x)).toBeLessThanOrEqual(0.02);
      expect(Math.abs(trail.y)).toBeLessThanOrEqual(0.015);
    });

    test('should scale with trail intensity', () => {
      const mousePos = { x: 0.5, y: 0.5 };
      const time = 1.0;
      
      const normalTrail = generateMouseTrail(mousePos, time, 1.0);
      const intenseTrail = generateMouseTrail(mousePos, time, 2.0);
      
      expect(Math.abs(intenseTrail.x)).toBeGreaterThanOrEqual(Math.abs(normalTrail.x));
      expect(Math.abs(intenseTrail.y)).toBeGreaterThanOrEqual(Math.abs(normalTrail.y));
    });

    test('should vary with mouse position and time', () => {
      const mousePos1 = { x: 0.3, y: 0.3 };
      const mousePos2 = { x: 0.7, y: 0.7 };
      const time = 1.0;
      
      const trail1 = generateMouseTrail(mousePos1, time);
      const trail2 = generateMouseTrail(mousePos2, time);
      
      // Different mouse positions should generally produce different trails
      expect(trail1.x).not.toBe(trail2.x);
      expect(trail1.y).not.toBe(trail2.y);
    });
  });

  describe('Geometric Pattern Utilities', () => {
    describe('calculateBezierFlow', () => {
      test('should handle two control points (linear)', () => {
        const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
        const result = calculateBezierFlow(0.5, points);
        
        expect(result.x).toBe(0.5);
        expect(result.y).toBe(0.5);
      });

      test('should handle three control points (quadratic)', () => {
        const points = [{ x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 }];
        const result = calculateBezierFlow(0.5, points);
        
        expect(result.x).toBe(0.5);
        expect(result.y).toBe(0.5); // Peak of the curve
      });

      test('should return zero for empty control points', () => {
        const result = calculateBezierFlow(0.5, []);
        
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
      });

      test('should handle edge cases (t=0 and t=1)', () => {
        const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
        
        const start = calculateBezierFlow(0, points);
        const end = calculateBezierFlow(1, points);
        
        expect(start.x).toBe(0);
        expect(start.y).toBe(0);
        expect(end.x).toBe(1);
        expect(end.y).toBe(1);
      });
    });

    describe('generateVoronoiCell', () => {
      test('should calculate Voronoi cell properties', () => {
        const position = { x: 0.5, y: 0.5 };
        const result = generateVoronoiCell(position, 4.0, 1.0);
        
        expect(result.distance).toBeGreaterThanOrEqual(0);
        expect(result.closestPoint).toHaveProperty('x');
        expect(result.closestPoint).toHaveProperty('y');
        expect(result.cellBoundary).toBeGreaterThanOrEqual(0);
        expect(result.cellBoundary).toBeLessThanOrEqual(1);
      });

      test('should vary with time parameter', () => {
        const position = { x: 0.5, y: 0.5 };
        const result1 = generateVoronoiCell(position, 4.0, 0.0);
        const result2 = generateVoronoiCell(position, 4.0, 10.0);
        
        // Results should be different due to animated points
        expect(result1.closestPoint.x).not.toBe(result2.closestPoint.x);
      });

      test('should handle different grid sizes', () => {
        const position = { x: 0.5, y: 0.5 };
        const smallGrid = generateVoronoiCell(position, 2.0);
        const largeGrid = generateVoronoiCell(position, 8.0);
        
        expect(smallGrid).toHaveProperty('distance');
        expect(largeGrid).toHaveProperty('distance');
      });
    });

    describe('calculateHexagonalGrid', () => {
      test('should calculate hexagonal grid coordinates', () => {
        const position = { x: 0.5, y: 0.5 };
        const result = calculateHexagonalGrid(position, 4.0);
        
        expect(result.gridPosition).toHaveProperty('x');
        expect(result.gridPosition).toHaveProperty('y');
        expect(result.localPosition).toHaveProperty('x');
        expect(result.localPosition).toHaveProperty('y');
        expect(typeof result.distanceToCenter).toBe('number');
        expect(typeof result.isInsideHex).toBe('boolean');
      });

      test('should determine if position is inside hexagon', () => {
        const centerPosition = { x: 0.0, y: 0.0 };
        const edgePosition = { x: 0.5, y: 0.5 };
        
        const centerResult = calculateHexagonalGrid(centerPosition, 4.0);
        const edgeResult = calculateHexagonalGrid(edgePosition, 4.0);
        
        expect(centerResult.distanceToCenter).toBeLessThan(edgeResult.distanceToCenter);
      });

      test('should scale with grid size parameter', () => {
        const position = { x: 0.1, y: 0.1 };
        const smallScale = calculateHexagonalGrid(position, 2.0);
        const largeScale = calculateHexagonalGrid(position, 8.0);
        
        expect(smallScale.gridPosition.x).not.toBe(largeScale.gridPosition.x);
      });
    });

    describe('generateSpiralPattern', () => {
      test('should generate spiral patterns', () => {
        const position = { x: 0.3, y: 0.4 };
        const result = generateSpiralPattern(position, 1.0, 3);
        
        expect(result.radius).toBeGreaterThan(0);
        expect(result.angle).toBeGreaterThan(-Math.PI);
        expect(result.angle).toBeLessThanOrEqual(Math.PI);
        expect(result.spirals).toHaveLength(3);
        expect(typeof result.combinedIntensity).toBe('number');
      });

      test('should create different spirals for different positions', () => {
        const pos1 = { x: 0.2, y: 0.3 };
        const pos2 = { x: 0.7, y: 0.8 };
        
        const spiral1 = generateSpiralPattern(pos1, 1.0, 2);
        const spiral2 = generateSpiralPattern(pos2, 1.0, 2);
        
        expect(spiral1.radius).not.toBe(spiral2.radius);
        expect(spiral1.angle).not.toBe(spiral2.angle);
      });

      test('should handle different spiral counts', () => {
        const position = { x: 0.5, y: 0.5 };
        const fewSpirals = generateSpiralPattern(position, 1.0, 2);
        const manySpirals = generateSpiralPattern(position, 1.0, 5);
        
        expect(fewSpirals.spirals).toHaveLength(2);
        expect(manySpirals.spirals).toHaveLength(5);
      });
    });

    describe('calculateFluidMesh', () => {
      test('should calculate fluid mesh deformation', () => {
        const position = { x: 0.5, y: 0.5 };
        const result = calculateFluidMesh(position, 1.0, 3.0);
        
        expect(typeof result.meshX).toBe('number');
        expect(typeof result.meshY).toBe('number');
        expect(result.intersection).toBeGreaterThanOrEqual(0);
        expect(result.intersection).toBeLessThanOrEqual(1);
        expect(result.flowDirection).toHaveProperty('x');
        expect(result.flowDirection).toHaveProperty('y');
      });

      test('should vary with time parameter', () => {
        const position = { x: 0.5, y: 0.5 };
        const result1 = calculateFluidMesh(position, 0.0);
        const result2 = calculateFluidMesh(position, 10.0);
        
        expect(result1.meshX).not.toBe(result2.meshX);
        expect(result1.meshY).not.toBe(result2.meshY);
      });

      test('should scale with scale parameter', () => {
        const position = { x: 0.1, y: 0.1 };
        const smallScale = calculateFluidMesh(position, 1.0, 1.0);
        const largeScale = calculateFluidMesh(position, 1.0, 5.0);
        
        expect(smallScale.meshX).not.toBe(largeScale.meshX);
        expect(smallScale.meshY).not.toBe(largeScale.meshY);
      });
    });

    describe('generateOrganicNoise', () => {
      test('should generate multi-octave noise', () => {
        const position = { x: 0.5, y: 0.5 };
        const result = generateOrganicNoise(position, 1.0, 3, 8.0);
        
        expect(typeof result.value).toBe('number');
        expect(result.value).toBeGreaterThanOrEqual(-1);
        expect(result.value).toBeLessThanOrEqual(1);
        expect(typeof result.threshold).toBe('number');
        expect(result.pattern).toBeGreaterThanOrEqual(0);
        expect(result.pattern).toBeLessThanOrEqual(1);
      });

      test('should vary with different octave counts', () => {
        const position = { x: 0.5, y: 0.5 };
        const fewOctaves = generateOrganicNoise(position, 1.0, 1);
        const manyOctaves = generateOrganicNoise(position, 1.0, 5);
        
        // More octaves should generally produce different (more complex) results
        expect(typeof fewOctaves.value).toBe('number');
        expect(typeof manyOctaves.value).toBe('number');
      });

      test('should change threshold over time', () => {
        const position = { x: 0.5, y: 0.5 };
        const result1 = generateOrganicNoise(position, 0.0);
        const result2 = generateOrganicNoise(position, 100.0);
        
        expect(result1.threshold).not.toBe(result2.threshold);
      });
    });
  });

  describe('calculateParticleLifecycle', () => {
    test('should calculate lifecycle phase between 0 and 1', () => {
      const lifecycle = calculateParticleLifecycle({ x: 0.5, y: 0.5 }, 10.0, 5);
      
      expect(lifecycle.lifecycle).toBeGreaterThanOrEqual(0);
      expect(lifecycle.lifecycle).toBeLessThan(1);
    });

    test('should calculate edge fading for particles near screen edges', () => {
      const centerParticle = calculateParticleLifecycle({ x: 0.0, y: 0.0 }, 1.0, 1);
      const edgeParticle = calculateParticleLifecycle({ x: 0.95, y: 0.95 }, 1.0, 1);
      
      expect(centerParticle.edgeFade).toBeGreaterThan(edgeParticle.edgeFade);
    });

    test('should combine lifecycle and edge fading for total opacity', () => {
      const lifecycle = calculateParticleLifecycle({ x: 0.5, y: 0.5 }, 1.0, 1);
      
      expect(lifecycle.totalOpacity).toBeGreaterThanOrEqual(0);
      expect(lifecycle.totalOpacity).toBeLessThanOrEqual(1);
      expect(lifecycle.totalOpacity).toBe(lifecycle.lifecycleOpacity * lifecycle.edgeFade);
    });
  });

  describe('Performance Monitoring and Optimization', () => {
    describe('detectDeviceCapabilities', () => {
      test('should detect device capabilities', () => {
        const capabilities = detectDeviceCapabilities();
        
        expect(capabilities).toHaveProperty('tier');
        expect(capabilities).toHaveProperty('score');
        expect(capabilities).toHaveProperty('gpu');
        expect(capabilities).toHaveProperty('memory');
        expect(capabilities).toHaveProperty('cores');
        expect(capabilities).toHaveProperty('screenComplexity');
        expect(capabilities).toHaveProperty('supportsWebGL2');
        expect(capabilities).toHaveProperty('maxTextureSize');
        
        expect(['low', 'medium', 'high']).toContain(capabilities.tier);
        expect(capabilities.score).toBeGreaterThanOrEqual(0.1);
        expect(capabilities.score).toBeLessThanOrEqual(1.0);
      });

      test('should handle WebGL unavailable', () => {
        // Mock WebGL unavailable
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
        
        const capabilities = detectDeviceCapabilities();
        
        expect(capabilities.tier).toBe('low');
        expect(capabilities.score).toBe(0.1);
        expect(capabilities.gpu).toBe('unknown');
        
        // Restore original method
        HTMLCanvasElement.prototype.getContext = originalGetContext;
      });
    });

    describe('AdvancedPerformanceMonitor', () => {
      test('should initialize with device-based quality', () => {
        const monitor = new AdvancedPerformanceMonitor();
        const capabilities = monitor.getDeviceCapabilities();
        
        expect(capabilities).toHaveProperty('tier');
        expect(monitor.getQualityLevel()).toBeGreaterThan(0);
        expect(monitor.getQualityLevel()).toBeLessThanOrEqual(1);
      });

      test('should update performance metrics', () => {
        const mockCallback = jest.fn();
        const monitor = new AdvancedPerformanceMonitor(mockCallback);
        
        const metrics = monitor.update();
        
        expect(metrics).toHaveProperty('fps');
        expect(metrics).toHaveProperty('averageFps');
        expect(metrics).toHaveProperty('frameTime');
        expect(metrics).toHaveProperty('qualityLevel');
        expect(metrics.fps).toBeGreaterThan(0);
      });

      test('should adjust target FPS', () => {
        const monitor = new AdvancedPerformanceMonitor();
        
        monitor.setTargetFps(30);
        // Target FPS should be clamped to reasonable range
        expect(() => monitor.setTargetFps(200)).not.toThrow();
        expect(() => monitor.setTargetFps(5)).not.toThrow();
      });

      test('should detect quality adjustment needs', () => {
        const monitor = new AdvancedPerformanceMonitor();
        
        // Simulate low FPS
        (monitor as any).fps = 20;
        expect(monitor.shouldReduceQuality()).toBe(true);
        
        // Simulate high FPS
        (monitor as any).fps = 80;
        expect(monitor.shouldIncreaseQuality()).toBe(true);
      });
    });

    describe('QUALITY_PRESETS', () => {
      test('should contain valid quality presets', () => {
        const presets = ['low', 'medium', 'high', 'ultra'];
        
        presets.forEach(preset => {
          const config = QUALITY_PRESETS[preset as keyof typeof QUALITY_PRESETS];
          
          expect(config).toHaveProperty('particleCount');
          expect(config).toHaveProperty('animationSpeed');
          expect(config).toHaveProperty('interactionEnabled');
          expect(config).toHaveProperty('renderScale');
          expect(config).toHaveProperty('antialias');
          expect(config).toHaveProperty('complexGeometry');
          
          expect(config.particleCount).toBeGreaterThan(0);
          expect(config.animationSpeed).toBeGreaterThan(0);
          expect(config.renderScale).toBeGreaterThan(0);
          expect(config.renderScale).toBeLessThanOrEqual(1);
        });
      });
    });

    describe('getOptimalQualityPreset', () => {
      test('should return appropriate preset for device tier', () => {
        const lowDevice = { tier: 'low' as const, score: 0.3 } as DeviceCapabilities;
        const mediumDevice = { tier: 'medium' as const, score: 0.6 } as DeviceCapabilities;
        const highDevice = { tier: 'high' as const, score: 0.8 } as DeviceCapabilities;
        const ultraDevice = { tier: 'high' as const, score: 0.95 } as DeviceCapabilities;
        
        expect(getOptimalQualityPreset(lowDevice)).toBe(QUALITY_PRESETS.low);
        expect(getOptimalQualityPreset(mediumDevice)).toBe(QUALITY_PRESETS.medium);
        expect(getOptimalQualityPreset(highDevice)).toBe(QUALITY_PRESETS.high);
        expect(getOptimalQualityPreset(ultraDevice)).toBe(QUALITY_PRESETS.ultra);
      });
    });
  });

  describe('getThemeColors', () => {
    test('should return light theme colors when isDark is false', () => {
      const colors = getThemeColors(false);
      
      expect(colors.primary).toEqual([0.96, 0.4, 0.26]);
      expect(colors.accent).toEqual([0.91, 0.24, 0.49]);
      expect(colors.background).toEqual([1.0, 1.0, 1.0]);
      expect(colors.particle).toEqual([0.43, 0.43, 0.43]);
    });

    test('should return dark theme colors when isDark is true', () => {
      const colors = getThemeColors(true);
      
      expect(colors.primary).toEqual([1.0, 0.45, 0.3]);
      expect(colors.accent).toEqual([0.95, 0.46, 0.57]);
      expect(colors.background).toEqual([0.05, 0.05, 0.05]);
      expect(colors.particle).toEqual([0.69, 0.69, 0.69]);
    });

    test('should return arrays with exactly 3 elements for each color', () => {
      const lightColors = getThemeColors(false);
      const darkColors = getThemeColors(true);
      
      Object.values(lightColors).forEach(color => {
        expect(color).toHaveLength(3);
        color.forEach(component => {
          expect(typeof component).toBe('number');
          expect(component).toBeGreaterThanOrEqual(0);
          expect(component).toBeLessThanOrEqual(1);
        });
      });
      
      Object.values(darkColors).forEach(color => {
        expect(color).toHaveLength(3);
        color.forEach(component => {
          expect(typeof component).toBe('number');
          expect(component).toBeGreaterThanOrEqual(0);
          expect(component).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('Advanced Blending and Composition', () => {
    describe('clampColor', () => {
      test('should clamp color values to valid range', () => {
        const overbrightColor = { r: 1.5, g: -0.5, b: 0.7 };
        const result = clampColor(overbrightColor);
        
        expect(result.r).toBe(1.0);
        expect(result.g).toBe(0.0);
        expect(result.b).toBe(0.7);
      });

      test('should not modify colors already in range', () => {
        const validColor = { r: 0.5, g: 0.3, b: 0.8 };
        const result = clampColor(validColor);
        
        expect(result).toEqual(validColor);
      });
    });

    describe('screenBlend', () => {
      test('should brighten colors using screen blend', () => {
        const base = { r: 0.5, g: 0.5, b: 0.5 };
        const overlay = { r: 0.5, g: 0.5, b: 0.5 };
        const result = screenBlend(base, overlay);
        
        expect(result.r).toBeGreaterThan(base.r);
        expect(result.g).toBeGreaterThan(base.g);
        expect(result.b).toBeGreaterThan(base.b);
      });

      test('should handle edge cases', () => {
        const black = { r: 0, g: 0, b: 0 };
        const white = { r: 1, g: 1, b: 1 };
        
        const blackResult = screenBlend(black, white);
        const whiteResult = screenBlend(white, black);
        
        expect(blackResult).toEqual(white);
        expect(whiteResult).toEqual(white);
      });
    });

    describe('overlayBlend', () => {
      test('should combine multiply and screen based on base color', () => {
        const darkBase = { r: 0.2, g: 0.2, b: 0.2 };
        const lightBase = { r: 0.8, g: 0.8, b: 0.8 };
        const overlay = { r: 0.5, g: 0.5, b: 0.5 };
        
        const darkResult = overlayBlend(darkBase, overlay);
        const lightResult = overlayBlend(lightBase, overlay);
        
        // Dark base should get darker (multiply effect)
        expect(darkResult.r).toBeLessThan(darkBase.r);
        // Light base should get lighter (screen effect)
        expect(lightResult.r).toBeGreaterThan(lightBase.r);
      });
    });

    describe('softLightBlend', () => {
      test('should create subtle lighting effects', () => {
        const base = { r: 0.5, g: 0.5, b: 0.5 };
        const lightOverlay = { r: 0.7, g: 0.7, b: 0.7 };
        const darkOverlay = { r: 0.3, g: 0.3, b: 0.3 };
        
        const lightResult = softLightBlend(base, lightOverlay);
        const darkResult = softLightBlend(base, darkOverlay);
        
        expect(lightResult.r).toBeGreaterThan(base.r);
        expect(darkResult.r).toBeLessThan(base.r);
      });
    });

    describe('colorDodgeBlend', () => {
      test('should create bright highlights', () => {
        const base = { r: 0.5, g: 0.5, b: 0.5 };
        const overlay = { r: 0.8, g: 0.8, b: 0.8 };
        const result = colorDodgeBlend(base, overlay);
        
        expect(result.r).toBeGreaterThan(base.r);
        expect(result.g).toBeGreaterThan(base.g);
        expect(result.b).toBeGreaterThan(base.b);
      });

      test('should handle near-white overlay', () => {
        const base = { r: 0.5, g: 0.5, b: 0.5 };
        const nearWhite = { r: 0.99, g: 0.99, b: 0.99 };
        const result = colorDodgeBlend(base, nearWhite);
        
        expect(result.r).toBe(1.0);
        expect(result.g).toBe(1.0);
        expect(result.b).toBe(1.0);
      });
    });

    describe('blendColors', () => {
      test('should apply different blend modes correctly', () => {
        const base = { r: 0.5, g: 0.5, b: 0.5 };
        const overlay = { r: 0.7, g: 0.7, b: 0.7 };
        
        const screenResult = blendColors(base, overlay, 'screen');
        const overlayResult = blendColors(base, overlay, 'overlay');
        const normalResult = blendColors(base, overlay, 'normal');
        
        expect(screenResult).not.toEqual(overlayResult);
        expect(normalResult).toEqual(overlay);
      });

      test('should apply opacity correctly', () => {
        const base = { r: 0.2, g: 0.2, b: 0.2 };
        const overlay = { r: 0.8, g: 0.8, b: 0.8 };
        
        const fullOpacity = blendColors(base, overlay, 'normal', 1.0);
        const halfOpacity = blendColors(base, overlay, 'normal', 0.5);
        const zeroOpacity = blendColors(base, overlay, 'normal', 0.0);
        
        expect(fullOpacity).toEqual(overlay);
        expect(halfOpacity.r).toBe(0.5); // Midpoint between base and overlay
        expect(zeroOpacity).toEqual(base);
      });
    });

    describe('composeLayers', () => {
      test('should compose layers with proper depth sorting', () => {
        const layers = [
          { color: { r: 1, g: 0, b: 0 }, alpha: 0.5, depth: 1.0, blendMode: 'normal' as BlendMode },
          { color: { r: 0, g: 1, b: 0 }, alpha: 0.5, depth: 0.5, blendMode: 'normal' as BlendMode },
          { color: { r: 0, g: 0, b: 1 }, alpha: 0.5, depth: 0.0, blendMode: 'normal' as BlendMode },
        ];
        
        const result = composeLayers(layers);
        
        expect(result.color).toHaveProperty('r');
        expect(result.color).toHaveProperty('g');
        expect(result.color).toHaveProperty('b');
        expect(result.alpha).toBeGreaterThan(0);
        expect(result.alpha).toBeLessThanOrEqual(1);
      });

      test('should handle empty layer array', () => {
        const result = composeLayers([]);
        
        expect(result.color).toEqual({ r: 0, g: 0, b: 0 });
        expect(result.alpha).toBe(0);
      });

      test('should skip layers with zero alpha', () => {
        const layers = [
          { color: { r: 1, g: 0, b: 0 }, alpha: 0.0, depth: 0.0, blendMode: 'normal' as BlendMode },
          { color: { r: 0, g: 1, b: 0 }, alpha: 0.5, depth: 1.0, blendMode: 'normal' as BlendMode },
        ];
        
        const result = composeLayers(layers);
        
        // Should only show the green layer
        expect(result.color.g).toBeGreaterThan(result.color.r);
      });
    });

    describe('calculateAtmosphericPerspective', () => {
      test('should blend color with atmosphere based on distance', () => {
        const color = { r: 1, g: 0, b: 0 }; // Red
        const atmosphere = { r: 0, g: 0, b: 1 }; // Blue
        
        const nearResult = calculateAtmosphericPerspective(color, 0.1, atmosphere, 1.0);
        const farResult = calculateAtmosphericPerspective(color, 1.0, atmosphere, 1.0);
        
        expect(nearResult.r).toBeGreaterThan(farResult.r); // Less atmospheric effect
        expect(farResult.b).toBeGreaterThan(nearResult.b); // More atmospheric effect
      });

      test('should use default atmosphere color when not provided', () => {
        const color = { r: 1, g: 0, b: 0 };
        const result = calculateAtmosphericPerspective(color, 0.5);
        
        expect(result).toHaveProperty('r');
        expect(result).toHaveProperty('g');
        expect(result).toHaveProperty('b');
      });
    });

    describe('Color Grading', () => {
      describe('adjustColorTemperature', () => {
        test('should warm up colors with positive temperature', () => {
          const color = { r: 0.5, g: 0.5, b: 0.5 };
          const result = adjustColorTemperature(color, 0.5);
          
          expect(result.r).toBeGreaterThan(color.r);
          expect(result.b).toBeLessThan(color.b);
        });

        test('should cool down colors with negative temperature', () => {
          const color = { r: 0.5, g: 0.5, b: 0.5 };
          const result = adjustColorTemperature(color, -0.5);
          
          expect(result.r).toBeLessThan(color.r);
          expect(result.b).toBeGreaterThan(color.b);
        });
      });

      describe('adjustContrast', () => {
        test('should increase contrast with values > 1', () => {
          const color = { r: 0.7, g: 0.3, b: 0.5 };
          const result = adjustContrast(color, 1.5);
          
          expect(result.r).toBeGreaterThan(color.r); // Above midpoint, gets brighter
          expect(result.g).toBeLessThan(color.g); // Below midpoint, gets darker
        });

        test('should decrease contrast with values < 1', () => {
          const color = { r: 0.8, g: 0.2, b: 0.5 };
          const result = adjustContrast(color, 0.5);
          
          expect(result.r).toBeLessThan(color.r); // Moves toward midpoint
          expect(result.g).toBeGreaterThan(color.g); // Moves toward midpoint
          expect(result.b).toBe(0.5); // Already at midpoint
        });
      });

      describe('adjustSaturation', () => {
        test('should increase saturation with values > 1', () => {
          const color = { r: 0.8, g: 0.5, b: 0.3 };
          const result = adjustSaturation(color, 1.5);
          
          // Colors should move away from luminance value
          const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
          expect(Math.abs(result.r - luminance)).toBeGreaterThan(Math.abs(color.r - luminance));
        });

        test('should create grayscale with saturation = 0', () => {
          const color = { r: 1, g: 0, b: 0 }; // Pure red
          const result = adjustSaturation(color, 0);
          
          // Should be grayscale (all channels equal to luminance)
          expect(result.r).toBeCloseTo(result.g, 3);
          expect(result.g).toBeCloseTo(result.b, 3);
        });
      });
    });
  });

  describe('Theme-Responsive Color System', () => {
    describe('easingFunctions', () => {
      test('should provide different easing curves', () => {
        const t = 0.5;
        
        expect(easingFunctions.linear(t)).toBe(0.5);
        expect(easingFunctions.easeIn(t)).toBe(0.25); // t^2
        expect(easingFunctions.easeOut(t)).toBeCloseTo(0.75, 2); // 1 - (1-t)^2
        expect(easingFunctions.easeInOut(t)).toBe(0.5); // Midpoint
      });

      test('should handle edge cases', () => {
        Object.values(easingFunctions).forEach(fn => {
          expect(fn(0)).toBe(0);
          expect(fn(1)).toBe(1);
        });
      });
    });

    describe('interpolateThemeColors', () => {
      test('should interpolate between light and dark colors', () => {
        const lightColor = { r: 1, g: 1, b: 1 }; // White
        const darkColor = { r: 0, g: 0, b: 0 };  // Black
        
        const midpoint = interpolateThemeColors(lightColor, darkColor, 0.5);
        expect(midpoint.r).toBeCloseTo(0.75, 2); // easeOut at 0.5
        expect(midpoint.g).toBeCloseTo(0.75, 2);
        expect(midpoint.b).toBeCloseTo(0.75, 2);
      });

      test('should handle different easing functions', () => {
        const lightColor = { r: 1, g: 0, b: 0 };
        const darkColor = { r: 0, g: 1, b: 0 };
        
        const linear = interpolateThemeColors(lightColor, darkColor, 0.5, 'linear');
        const easeIn = interpolateThemeColors(lightColor, darkColor, 0.5, 'easeIn');
        
        expect(linear.r).toBe(0.5);
        expect(easeIn.r).toBe(0.75); // Less progress with easeIn
      });

      test('should clamp progress values', () => {
        const lightColor = { r: 1, g: 1, b: 1 };
        const darkColor = { r: 0, g: 0, b: 0 };
        
        const underflow = interpolateThemeColors(lightColor, darkColor, -0.5);
        const overflow = interpolateThemeColors(lightColor, darkColor, 1.5);
        
        expect(underflow).toEqual(lightColor);
        expect(overflow).toEqual(darkColor);
      });
    });

    describe('calculateThemeIntensity', () => {
      test('should adjust intensity based on theme progress', () => {
        const baseIntensity = 1.0;
        
        const lightIntensity = calculateThemeIntensity(baseIntensity, 0.0);
        const darkIntensity = calculateThemeIntensity(baseIntensity, 1.0);
        const midIntensity = calculateThemeIntensity(baseIntensity, 0.5);
        
        expect(lightIntensity).toBe(1.0); // Default light multiplier
        expect(darkIntensity).toBe(1.3); // Default dark multiplier
        expect(midIntensity).toBe(1.15); // Midpoint
      });

      test('should use custom multipliers', () => {
        const result = calculateThemeIntensity(1.0, 0.5, 0.8, 1.6);
        expect(result).toBe(1.2); // 1.0 * (0.8 + (1.6 - 0.8) * 0.5)
      });
    });

    describe('calculateThemeContrast', () => {
      test('should adjust contrast based on theme progress', () => {
        const baseContrast = 1.0;
        
        const lightContrast = calculateThemeContrast(baseContrast, 0.0);
        const darkContrast = calculateThemeContrast(baseContrast, 1.0);
        
        expect(lightContrast).toBe(1.0);
        expect(darkContrast).toBe(1.2);
      });
    });

    describe('calculateThemeGlow', () => {
      test('should adjust glow based on theme progress', () => {
        const baseGlow = 1.0;
        
        const lightGlow = calculateThemeGlow(baseGlow, 0.0);
        const darkGlow = calculateThemeGlow(baseGlow, 1.0);
        
        expect(lightGlow).toBe(0.8);
        expect(darkGlow).toBe(1.4);
      });
    });

    describe('ThemeTransitionManager', () => {
      test('should initialize with correct theme', () => {
        const lightManager = new ThemeTransitionManager('light');
        const darkManager = new ThemeTransitionManager('dark');
        
        expect(lightManager.getCurrentTheme()).toBe('light');
        expect(darkManager.getCurrentTheme()).toBe('dark');
      });

      test('should transition between themes', () => {
        const manager = new ThemeTransitionManager('light', 0.5); // Fast transition
        
        expect(manager.getCurrentTheme()).toBe('light');
        
        manager.setTheme('dark');
        expect(manager.isTransitionComplete()).toBe(false);
        
        // Update a few times to progress the transition
        for (let i = 0; i < 10; i++) {
          manager.update();
        }
        
        expect(manager.getCurrentTheme()).toBe('dark');
      });

      test('should handle transition speed changes', () => {
        const manager = new ThemeTransitionManager('light', 0.1);
        
        manager.setTransitionSpeed(0.5);
        manager.setTheme('dark');
        
        const progress1 = manager.update();
        const progress2 = manager.update();
        
        // Should make significant progress with high speed
        expect(progress2).toBeGreaterThan(progress1);
      });

      test('should handle easing changes', () => {
        const manager = new ThemeTransitionManager('light');
        
        manager.setEasing('linear');
        manager.setTheme('dark');
        
        // Should work without errors
        expect(() => manager.update()).not.toThrow();
        expect(() => manager.getProgress()).not.toThrow();
      });

      test('should detect transition completion', () => {
        const manager = new ThemeTransitionManager('light', 1.0); // Instant transition
        
        manager.setTheme('dark');
        manager.update();
        
        expect(manager.isTransitionComplete()).toBe(true);
      });
    });

    describe('THEME_PALETTES', () => {
      test('should contain valid color palettes', () => {
        Object.values(THEME_PALETTES).forEach(palette => {
          expect(palette).toHaveProperty('light');
          expect(palette).toHaveProperty('dark');
          
          ['light', 'dark'].forEach(theme => {
            const colors = palette[theme as 'light' | 'dark'];
            expect(colors).toHaveProperty('primary');
            expect(colors).toHaveProperty('accent');
            expect(colors).toHaveProperty('background');
            expect(colors).toHaveProperty('particle');
            
            // Check color value ranges
            Object.values(colors).forEach(color => {
              expect(color.r).toBeGreaterThanOrEqual(0);
              expect(color.r).toBeLessThanOrEqual(1);
              expect(color.g).toBeGreaterThanOrEqual(0);
              expect(color.g).toBeLessThanOrEqual(1);
              expect(color.b).toBeGreaterThanOrEqual(0);
              expect(color.b).toBeLessThanOrEqual(1);
            });
          });
        });
      });
    });

    describe('getThemeColorsFromPalette', () => {
      test('should return correct colors for palette and theme', () => {
        const portfolioLight = getThemeColorsFromPalette('portfolio', 'light');
        const portfolioDark = getThemeColorsFromPalette('portfolio', 'dark');
        
        expect(portfolioLight).toEqual(THEME_PALETTES.portfolio.light);
        expect(portfolioDark).toEqual(THEME_PALETTES.portfolio.dark);
      });

      test('should work with all available palettes', () => {
        const palettes = Object.keys(THEME_PALETTES) as (keyof typeof THEME_PALETTES)[];
        
        palettes.forEach(palette => {
          expect(() => getThemeColorsFromPalette(palette, 'light')).not.toThrow();
          expect(() => getThemeColorsFromPalette(palette, 'dark')).not.toThrow();
        });
      });
    });
  });

  describe('Performance Monitoring and Optimization', () => {
    describe('detectDeviceCapabilities', () => {
      test('should detect device capabilities', () => {
        const capabilities = detectDeviceCapabilities();
        
        expect(capabilities).toHaveProperty('tier');
        expect(capabilities).toHaveProperty('score');
        expect(capabilities).toHaveProperty('features');
        expect(['low', 'medium', 'high']).toContain(capabilities.tier);
        expect(capabilities.score).toBeGreaterThanOrEqual(0.1);
        expect(capabilities.score).toBeLessThanOrEqual(1.0);
      });

      test('should detect WebGL features', () => {
        const capabilities = detectDeviceCapabilities();
        
        expect(capabilities.features).toHaveProperty('webgl2');
        expect(capabilities.features).toHaveProperty('floatTextures');
        expect(capabilities.features).toHaveProperty('maxTextureSize');
        expect(capabilities.features).toHaveProperty('isMobile');
        expect(capabilities.features).toHaveProperty('cores');
        expect(capabilities.features).toHaveProperty('deviceMemory');
      });

      test('should handle WebGL unavailability gracefully', () => {
        // Mock WebGL unavailable
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
        
        const capabilities = detectDeviceCapabilities();
        
        expect(capabilities.tier).toBe('low');
        expect(capabilities.score).toBe(0.1);
        
        // Restore original method
        HTMLCanvasElement.prototype.getContext = originalGetContext;
      });
    });

    describe('calculateOptimalSettings', () => {
      test('should calculate settings for low-end devices', () => {
        const lowEndCapabilities = {
          tier: 'low' as const,
          score: 0.2,
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
            renderer: 'Intel HD Graphics',
            vendor: 'Intel',
          },
        };
        
        const settings = calculateOptimalSettings(lowEndCapabilities);
        
        expect(settings.particleCount).toBeLessThan(50);
        expect(settings.qualityLevel).toBeLessThan(0.5);
        expect(settings.renderScale).toBeLessThan(1.0);
      });

      test('should calculate settings for high-end devices', () => {
        const highEndCapabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {
            webgl2: true,
            floatTextures: true,
            halfFloatTextures: true,
            depthTextures: true,
            instancedArrays: true,
            vertexArrayObjects: true,
            maxTextureSize: 16384,
            maxVertexAttribs: 32,
            maxFragmentUniforms: 1024,
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            cores: 16,
            deviceMemory: 32,
            pixelRatio: 1,
            refreshRate: 144,
            renderer: 'NVIDIA GeForce RTX 3080',
            vendor: 'NVIDIA',
          },
        };
        
        const settings = calculateOptimalSettings(highEndCapabilities);
        
        expect(settings.particleCount).toBeGreaterThan(100);
        expect(settings.qualityLevel).toBe(1.0);
        expect(settings.renderScale).toBe(1.0);
      });

      test('should adjust for mobile devices', () => {
        const mobileCapabilities = {
          tier: 'medium' as const,
          score: 0.5,
          features: {
            webgl2: false,
            floatTextures: false,
            halfFloatTextures: false,
            depthTextures: false,
            instancedArrays: false,
            vertexArrayObjects: false,
            maxTextureSize: 4096,
            maxVertexAttribs: 16,
            maxFragmentUniforms: 64,
            isMobile: true,
            isTablet: false,
            isDesktop: false,
            cores: 8,
            deviceMemory: 6,
            pixelRatio: 3,
            refreshRate: 60,
            renderer: 'Apple A15 GPU',
            vendor: 'Apple',
          },
        };
        
        const settings = calculateOptimalSettings(mobileCapabilities);
        
        // Mobile should have reduced settings even for medium tier
        expect(settings.renderScale).toBeLessThan(0.8);
        expect(settings.particleCount).toBeLessThan(70);
      });
    });

    describe('AdvancedPerformanceMonitor', () => {
      test('should initialize with default metrics', () => {
        const monitor = new AdvancedPerformanceMonitor();
        const metrics = monitor.getMetrics();
        
        expect(metrics.fps).toBe(60);
        expect(metrics.averageFps).toBe(60);
        expect(metrics.stabilityScore).toBe(1.0);
        expect(metrics.thermalState).toBe('normal');
      });

      test('should update metrics', () => {
        const monitor = new AdvancedPerformanceMonitor();
        
        // Simulate frame updates
        for (let i = 0; i < 5; i++) {
          monitor.update();
        }
        
        const metrics = monitor.getMetrics();
        expect(typeof metrics.fps).toBe('number');
        expect(typeof metrics.averageFps).toBe('number');
      });

      test('should detect performance issues', () => {
        const monitor = new AdvancedPerformanceMonitor();
        
        // Simulate low performance by setting internal state
        (monitor as any).metrics.averageFps = 25;
        
        expect(monitor.shouldReduceQuality()).toBe(true);
        expect(monitor.shouldIncreaseQuality()).toBe(false);
      });

      test('should recommend quality levels', () => {
        const monitor = new AdvancedPerformanceMonitor();
        
        // Test different performance scenarios
        (monitor as any).metrics.averageFps = 25;
        expect(monitor.getQualityRecommendation()).toBeLessThan(0.5);
        
        (monitor as any).metrics.averageFps = 60;
        (monitor as any).metrics.stabilityScore = 0.9;
        expect(monitor.getQualityRecommendation()).toBe(1.0);
      });

      test('should call performance change callback', () => {
        const mockCallback = jest.fn();
        const monitor = new AdvancedPerformanceMonitor(mockCallback);
        
        // Mock performance.now to simulate time passage
        const originalNow = performance.now;
        let mockTime = 0;
        performance.now = jest.fn(() => mockTime);
        
        // Simulate frame updates over time
        mockTime = 0;
        monitor.update();
        
        mockTime = 1100; // More than 1 second later
        monitor.update();
        
        expect(mockCallback).toHaveBeenCalled();
        
        // Restore original performance.now
        performance.now = originalNow;
      });
    });

    describe('getBatteryInfo', () => {
      test('should handle battery API unavailability', async () => {
        // Mock navigator without battery API
        const originalNavigator = global.navigator;
        (global as any).navigator = {};
        
        const batteryInfo = await getBatteryInfo();
        
        expect(batteryInfo).toHaveProperty('level');
        expect(batteryInfo).toHaveProperty('charging');
        expect(batteryInfo.level).toBe(1.0);
        expect(batteryInfo.charging).toBe(true);
        
        // Restore original navigator
        global.navigator = originalNavigator;
      });

      test('should return battery info when available', async () => {
        // Mock battery API
        const mockBattery = {
          level: 0.8,
          charging: false,
          chargingTime: Infinity,
          dischargingTime: 3600,
        };
        
        const originalNavigator = global.navigator;
        (global as any).navigator = {
          getBattery: jest.fn().mockResolvedValue(mockBattery),
        };
        
        const batteryInfo = await getBatteryInfo();
        
        expect(batteryInfo.level).toBe(0.8);
        expect(batteryInfo.charging).toBe(false);
        
        // Restore original navigator
        global.navigator = originalNavigator;
      });
    });

    describe('getNetworkInfo', () => {
      test('should handle network API unavailability', () => {
        const originalNavigator = global.navigator;
        (global as any).navigator = {};
        
        const networkInfo = getNetworkInfo();
        
        expect(networkInfo).toHaveProperty('effectiveType');
        expect(networkInfo).toHaveProperty('downlink');
        expect(networkInfo.effectiveType).toBe('unknown');
        expect(networkInfo.downlink).toBe(0);
        
        // Restore original navigator
        global.navigator = originalNavigator;
      });

      test('should return network info when available', () => {
        const mockConnection = {
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
          saveData: false,
        };
        
        const originalNavigator = global.navigator;
        (global as any).navigator = {
          connection: mockConnection,
        };
        
        const networkInfo = getNetworkInfo();
        
        expect(networkInfo.effectiveType).toBe('4g');
        expect(networkInfo.downlink).toBe(10);
        expect(networkInfo.rtt).toBe(50);
        expect(networkInfo.saveData).toBe(false);
        
        // Restore original navigator
        global.navigator = originalNavigator;
      });
    });
  });
});
  desc
ribe('Responsive Scaling and Window Resize Utilities', () => {
    describe('getWindowDimensions', () => {
      test('should return current window dimensions', () => {
        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
        Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });

        const dimensions = getWindowDimensions();

        expect(dimensions.width).toBe(1920);
        expect(dimensions.height).toBe(1080);
        expect(dimensions.aspectRatio).toBeCloseTo(1920 / 1080, 2);
        expect(dimensions.pixelRatio).toBe(2);
        expect(dimensions.orientation).toBe('landscape');
      });

      test('should detect portrait orientation', () => {
        Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true });

        const dimensions = getWindowDimensions();

        expect(dimensions.orientation).toBe('portrait');
        expect(dimensions.aspectRatio).toBeCloseTo(768 / 1024, 2);
      });

      test('should handle missing devicePixelRatio', () => {
        Object.defineProperty(window, 'devicePixelRatio', { value: undefined, configurable: true });

        const dimensions = getWindowDimensions();

        expect(dimensions.pixelRatio).toBe(1);
      });
    });

    describe('calculateResponsiveScale', () => {
      test('should calculate scale based on screen size', () => {
        const dimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1920 / 1080,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };

        const scale = calculateResponsiveScale(dimensions, capabilities);

        expect(scale).toBeGreaterThan(0.3);
        expect(scale).toBeLessThanOrEqual(1.0);
      });

      test('should reduce scale for low-end devices', () => {
        const dimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1920 / 1080,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const lowEndCapabilities = {
          tier: 'low' as const,
          score: 0.3,
          features: {} as any,
        };

        const highEndCapabilities = {
          tier: 'high' as const,
          score: 0.9,
          features: {} as any,
        };

        const lowScale = calculateResponsiveScale(dimensions, lowEndCapabilities);
        const highScale = calculateResponsiveScale(dimensions, highEndCapabilities);

        expect(lowScale).toBeLessThan(highScale);
      });

      test('should apply pixel ratio bonus', () => {
        const lowDPIDimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1920 / 1080,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const highDPIDimensions = {
          ...lowDPIDimensions,
          pixelRatio: 3,
        };

        const capabilities = {
          tier: 'medium' as const,
          score: 0.6,
          features: {} as any,
        };

        const lowDPIScale = calculateResponsiveScale(lowDPIDimensions, capabilities);
        const highDPIScale = calculateResponsiveScale(highDPIDimensions, capabilities);

        expect(highDPIScale).toBeGreaterThan(lowDPIScale);
      });

      test('should apply complexity penalty for large screens', () => {
        const normalDimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1920 / 1080,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const largeDimensions = {
          width: 3840,
          height: 2160,
          aspectRatio: 3840 / 2160,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };

        const normalScale = calculateResponsiveScale(normalDimensions, capabilities);
        const largeScale = calculateResponsiveScale(largeDimensions, capabilities);

        expect(largeScale).toBeLessThan(normalScale);
      });

      test('should clamp scale to configured range', () => {
        const dimensions = {
          width: 320,
          height: 240,
          aspectRatio: 320 / 240,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const capabilities = {
          tier: 'low' as const,
          score: 0.1,
          features: {} as any,
        };

        const config = {
          baseWidth: 1920,
          baseHeight: 1080,
          minScale: 0.5,
          maxScale: 0.8,
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1440,
            ultrawide: 2560,
          },
        };

        const scale = calculateResponsiveScale(dimensions, capabilities, config);

        expect(scale).toBeGreaterThanOrEqual(config.minScale);
        expect(scale).toBeLessThanOrEqual(config.maxScale);
      });
    });

    describe('getDeviceCategory', () => {
      test('should categorize mobile devices', () => {
        expect(getDeviceCategory(320)).toBe('mobile');
        expect(getDeviceCategory(480)).toBe('mobile');
        expect(getDeviceCategory(767)).toBe('mobile');
      });

      test('should categorize tablet devices', () => {
        expect(getDeviceCategory(768)).toBe('tablet');
        expect(getDeviceCategory(900)).toBe('tablet');
        expect(getDeviceCategory(1023)).toBe('tablet');
      });

      test('should categorize desktop devices', () => {
        expect(getDeviceCategory(1024)).toBe('desktop');
        expect(getDeviceCategory(1200)).toBe('desktop');
        expect(getDeviceCategory(1439)).toBe('desktop');
      });

      test('should categorize ultrawide devices', () => {
        expect(getDeviceCategory(1440)).toBe('ultrawide');
        expect(getDeviceCategory(2560)).toBe('ultrawide');
        expect(getDeviceCategory(3840)).toBe('ultrawide');
      });

      test('should use custom breakpoints', () => {
        const customConfig = {
          baseWidth: 1920,
          baseHeight: 1080,
          minScale: 0.3,
          maxScale: 1.0,
          breakpoints: {
            mobile: 600,
            tablet: 900,
            desktop: 1200,
            ultrawide: 2000,
          },
        };

        expect(getDeviceCategory(500, customConfig)).toBe('mobile');
        expect(getDeviceCategory(700, customConfig)).toBe('tablet');
        expect(getDeviceCategory(1000, customConfig)).toBe('desktop');
        expect(getDeviceCategory(2500, customConfig)).toBe('ultrawide');
      });
    });

    describe('calculateResponsiveSettings', () => {
      test('should return appropriate settings for mobile', () => {
        const dimensions = {
          width: 375,
          height: 667,
          aspectRatio: 375 / 667,
          pixelRatio: 2,
          orientation: 'portrait' as const,
        };

        const capabilities = {
          tier: 'medium' as const,
          score: 0.6,
          features: {} as any,
        };

        const settings = calculateResponsiveSettings(dimensions, capabilities);

        expect(settings.particleCountMultiplier).toBeLessThan(1.0);
        expect(settings.interactionRadiusMultiplier).toBeLessThan(1.0);
        expect(settings.animationSpeedMultiplier).toBeLessThan(1.0);
        expect(settings.qualityLevel).toBeLessThan(1.0);
      });

      test('should return appropriate settings for desktop', () => {
        const dimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1920 / 1080,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };

        const settings = calculateResponsiveSettings(dimensions, capabilities);

        expect(settings.particleCountMultiplier).toBe(1.0);
        expect(settings.interactionRadiusMultiplier).toBe(1.0);
        expect(settings.animationSpeedMultiplier).toBe(1.0);
        expect(settings.qualityLevel).toBe(1.0);
      });

      test('should return enhanced settings for ultrawide', () => {
        const dimensions = {
          width: 3440,
          height: 1440,
          aspectRatio: 3440 / 1440,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const capabilities = {
          tier: 'high' as const,
          score: 0.9,
          features: {} as any,
        };

        const settings = calculateResponsiveSettings(dimensions, capabilities);

        expect(settings.particleCountMultiplier).toBeGreaterThan(1.0);
        expect(settings.interactionRadiusMultiplier).toBeGreaterThan(1.0);
        expect(settings.animationSpeedMultiplier).toBeGreaterThan(1.0);
      });

      test('should apply portrait orientation adjustments for mobile', () => {
        const portraitDimensions = {
          width: 375,
          height: 667,
          aspectRatio: 375 / 667,
          pixelRatio: 2,
          orientation: 'portrait' as const,
        };

        const landscapeDimensions = {
          width: 667,
          height: 375,
          aspectRatio: 667 / 375,
          pixelRatio: 2,
          orientation: 'landscape' as const,
        };

        const capabilities = {
          tier: 'medium' as const,
          score: 0.6,
          features: {} as any,
        };

        const portraitSettings = calculateResponsiveSettings(portraitDimensions, capabilities);
        const landscapeSettings = calculateResponsiveSettings(landscapeDimensions, capabilities);

        expect(portraitSettings.particleCountMultiplier).toBeLessThan(landscapeSettings.particleCountMultiplier);
        expect(portraitSettings.interactionRadiusMultiplier).toBeLessThan(landscapeSettings.interactionRadiusMultiplier);
      });

      test('should scale settings based on device capabilities', () => {
        const dimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1920 / 1080,
          pixelRatio: 1,
          orientation: 'landscape' as const,
        };

        const lowCapabilities = {
          tier: 'low' as const,
          score: 0.3,
          features: {} as any,
        };

        const highCapabilities = {
          tier: 'high' as const,
          score: 0.9,
          features: {} as any,
        };

        const lowSettings = calculateResponsiveSettings(dimensions, lowCapabilities);
        const highSettings = calculateResponsiveSettings(dimensions, highCapabilities);

        expect(lowSettings.particleCountMultiplier).toBeLessThan(highSettings.particleCountMultiplier);
        expect(lowSettings.qualityLevel).toBeLessThan(highSettings.qualityLevel);
      });
    });

    describe('ResponsiveTransitionManager', () => {
      test('should initialize with provided settings', () => {
        const initialSettings = {
          renderScale: 1.0,
          particleCountMultiplier: 1.0,
          interactionRadiusMultiplier: 1.0,
          animationSpeedMultiplier: 1.0,
          qualityLevel: 1.0,
        };

        const manager = new ResponsiveTransitionManager(initialSettings);
        const currentSettings = manager.getCurrentSettings();

        expect(currentSettings).toEqual(initialSettings);
        expect(manager.isTransitionComplete()).toBe(true);
      });

      test('should start transition when target settings change', () => {
        const initialSettings = {
          renderScale: 1.0,
          particleCountMultiplier: 1.0,
          interactionRadiusMultiplier: 1.0,
          animationSpeedMultiplier: 1.0,
          qualityLevel: 1.0,
        };

        const targetSettings = {
          renderScale: 0.5,
          particleCountMultiplier: 0.5,
          interactionRadiusMultiplier: 0.5,
          animationSpeedMultiplier: 0.5,
          qualityLevel: 0.5,
        };

        const manager = new ResponsiveTransitionManager(initialSettings);
        manager.setTargetSettings(targetSettings);

        expect(manager.isTransitionComplete()).toBe(false);
      });

      test('should interpolate settings over time', () => {
        const initialSettings = {
          renderScale: 1.0,
          particleCountMultiplier: 1.0,
          interactionRadiusMultiplier: 1.0,
          animationSpeedMultiplier: 1.0,
          qualityLevel: 1.0,
        };

        const targetSettings = {
          renderScale: 0.5,
          particleCountMultiplier: 0.5,
          interactionRadiusMultiplier: 0.5,
          animationSpeedMultiplier: 0.5,
          qualityLevel: 0.5,
        };

        const manager = new ResponsiveTransitionManager(initialSettings, 0.1);
        manager.setTargetSettings(targetSettings);

        // Update once
        const firstUpdate = manager.update();
        expect(firstUpdate.renderScale).toBeLessThan(1.0);
        expect(firstUpdate.renderScale).toBeGreaterThan(0.5);

        // Update multiple times to complete transition
        for (let i = 0; i < 50; i++) {
          manager.update();
        }

        const finalSettings = manager.getCurrentSettings();
        expect(finalSettings.renderScale).toBeCloseTo(0.5, 2);
        expect(manager.isTransitionComplete()).toBe(true);
      });

      test('should allow immediate transition completion', () => {
        const initialSettings = {
          renderScale: 1.0,
          particleCountMultiplier: 1.0,
          interactionRadiusMultiplier: 1.0,
          animationSpeedMultiplier: 1.0,
          qualityLevel: 1.0,
        };

        const targetSettings = {
          renderScale: 0.5,
          particleCountMultiplier: 0.5,
          interactionRadiusMultiplier: 0.5,
          animationSpeedMultiplier: 0.5,
          qualityLevel: 0.5,
        };

        const manager = new ResponsiveTransitionManager(initialSettings);
        manager.setTargetSettings(targetSettings);
        manager.completeTransition();

        const currentSettings = manager.getCurrentSettings();
        expect(currentSettings).toEqual(targetSettings);
        expect(manager.isTransitionComplete()).toBe(true);
      });

      test('should allow transition speed adjustment', () => {
        const initialSettings = {
          renderScale: 1.0,
          particleCountMultiplier: 1.0,
          interactionRadiusMultiplier: 1.0,
          animationSpeedMultiplier: 1.0,
          qualityLevel: 1.0,
        };

        const manager = new ResponsiveTransitionManager(initialSettings, 0.01);
        manager.setTransitionSpeed(0.5);

        // Speed should be clamped to reasonable range
        expect(() => manager.setTransitionSpeed(2.0)).not.toThrow();
        expect(() => manager.setTransitionSpeed(-0.1)).not.toThrow();
      });
    });

    describe('DebouncedResizeHandler', () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      test('should debounce callback execution', () => {
        const callback = jest.fn();
        const handler = new DebouncedResizeHandler(callback, 100);

        // Trigger multiple times rapidly
        handler.trigger();
        handler.trigger();
        handler.trigger();

        // Callback should not be called yet
        expect(callback).not.toHaveBeenCalled();

        // Fast-forward time
        jest.advanceTimersByTime(100);

        // Callback should be called once
        expect(callback).toHaveBeenCalledTimes(1);
      });

      test('should reset debounce timer on subsequent triggers', () => {
        const callback = jest.fn();
        const handler = new DebouncedResizeHandler(callback, 100);

        handler.trigger();
        jest.advanceTimersByTime(50);
        
        handler.trigger(); // This should reset the timer
        jest.advanceTimersByTime(50);
        
        // Callback should not be called yet
        expect(callback).not.toHaveBeenCalled();
        
        jest.advanceTimersByTime(50);
        
        // Now callback should be called
        expect(callback).toHaveBeenCalledTimes(1);
      });

      test('should allow cancellation of pending callback', () => {
        const callback = jest.fn();
        const handler = new DebouncedResizeHandler(callback, 100);

        handler.trigger();
        handler.cancel();

        jest.advanceTimersByTime(100);

        expect(callback).not.toHaveBeenCalled();
      });

      test('should allow delay adjustment', () => {
        const callback = jest.fn();
        const handler = new DebouncedResizeHandler(callback, 100);

        handler.setDelay(200);
        handler.trigger();

        jest.advanceTimersByTime(100);
        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(100);
        expect(callback).toHaveBeenCalledTimes(1);
      });

      test('should handle negative delay values', () => {
        const callback = jest.fn();
        const handler = new DebouncedResizeHandler(callback, 100);

        expect(() => handler.setDelay(-50)).not.toThrow();
        
        handler.trigger();
        jest.advanceTimersByTime(1);
        
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('Touch Interaction Utilities', () => {
      describe('processTouchInteraction', () => {
        test('should process touch coordinates correctly', () => {
          const mockTouch = {
            clientX: 100,
            clientY: 50,
            force: 0.8,
          } as Touch;

          const containerRect = {
            left: 0,
            top: 0,
            width: 200,
            height: 100,
          } as DOMRect;

          const interaction = processTouchInteraction(mockTouch, containerRect);

          expect(interaction.position.x).toBe(0.5); // 100 / 200
          expect(interaction.position.y).toBe(0.5); // 1.0 - (50 / 100)
          expect(interaction.pressure).toBe(0.8);
          expect(interaction.velocity.x).toBe(0);
          expect(interaction.velocity.y).toBe(0);
          expect(typeof interaction.timestamp).toBe('number');
        });

        test('should calculate velocity from previous touch', () => {
          const mockTouch = {
            clientX: 120,
            clientY: 60,
            force: 1.0,
          } as Touch;

          const containerRect = {
            left: 0,
            top: 0,
            width: 200,
            height: 100,
          } as DOMRect;

          const previousTouch = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 0, y: 0 },
            pressure: 1.0,
            timestamp: Date.now() - 16, // 16ms ago
          };

          const interaction = processTouchInteraction(mockTouch, containerRect, previousTouch);

          expect(interaction.velocity.x).toBeGreaterThan(0);
          expect(interaction.velocity.y).toBeGreaterThan(0);
        });

        test('should clamp coordinates to valid range', () => {
          const mockTouch = {
            clientX: -50, // Outside left boundary
            clientY: 150, // Outside bottom boundary
            force: 1.0,
          } as Touch;

          const containerRect = {
            left: 0,
            top: 0,
            width: 200,
            height: 100,
          } as DOMRect;

          const interaction = processTouchInteraction(mockTouch, containerRect);

          expect(interaction.position.x).toBe(0); // Clamped to 0
          expect(interaction.position.y).toBe(1); // Clamped to 1 (inverted Y)
        });

        test('should handle missing force property', () => {
          const mockTouch = {
            clientX: 100,
            clientY: 50,
          } as Touch;

          const containerRect = {
            left: 0,
            top: 0,
            width: 200,
            height: 100,
          } as DOMRect;

          const interaction = processTouchInteraction(mockTouch, containerRect);

          expect(interaction.pressure).toBe(1.0); // Default value
        });
      });

      describe('calculateTouchInteractionRadius', () => {
        test('should adjust radius for mobile devices', () => {
          const baseRadius = 0.3;
          const touchInteraction = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 0, y: 0 },
            pressure: 1.0,
            timestamp: Date.now(),
          };

          const mobileRadius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'mobile');
          const desktopRadius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'desktop');

          expect(mobileRadius).toBeLessThan(desktopRadius);
          expect(mobileRadius).toBe(baseRadius * 0.7);
        });

        test('should adjust radius based on touch pressure', () => {
          const baseRadius = 0.3;
          const lightTouch = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 0, y: 0 },
            pressure: 0.3,
            timestamp: Date.now(),
          };

          const heavyTouch = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 0, y: 0 },
            pressure: 1.0,
            timestamp: Date.now(),
          };

          const lightRadius = calculateTouchInteractionRadius(baseRadius, lightTouch, 'desktop');
          const heavyRadius = calculateTouchInteractionRadius(baseRadius, heavyTouch, 'desktop');

          expect(lightRadius).toBeLessThan(heavyRadius);
        });

        test('should increase radius based on touch velocity', () => {
          const baseRadius = 0.3;
          const slowTouch = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 1, y: 1 },
            pressure: 1.0,
            timestamp: Date.now(),
          };

          const fastTouch = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 10, y: 10 },
            pressure: 1.0,
            timestamp: Date.now(),
          };

          const slowRadius = calculateTouchInteractionRadius(baseRadius, slowTouch, 'desktop');
          const fastRadius = calculateTouchInteractionRadius(baseRadius, fastTouch, 'desktop');

          expect(fastRadius).toBeGreaterThan(slowRadius);
        });

        test('should handle tablet devices appropriately', () => {
          const baseRadius = 0.3;
          const touchInteraction = {
            position: { x: 0.5, y: 0.5 },
            velocity: { x: 0, y: 0 },
            pressure: 1.0,
            timestamp: Date.now(),
          };

          const tabletRadius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'tablet');
          const mobileRadius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'mobile');
          const desktopRadius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'desktop');

          expect(tabletRadius).toBeGreaterThan(mobileRadius);
          expect(tabletRadius).toBeLessThan(desktopRadius);
          expect(tabletRadius).toBe(baseRadius * 0.85);
        });
      });
    });

    describe('Responsive Scaling Utilities', () => {
    describe('calculateViewportDimensions', () => {
      test('should calculate viewport dimensions correctly', () => {
        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
        Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
        
        const viewport = calculateViewportDimensions();
        
        expect(viewport.width).toBe(1920);
        expect(viewport.height).toBe(1080);
        expect(viewport.aspectRatio).toBeCloseTo(1.78, 2);
        expect(viewport.pixelRatio).toBe(2);
        expect(viewport.orientation).toBe('landscape');
        expect(viewport.deviceType).toBe('desktop');
        expect(viewport.isUltrawide).toBe(false);
      });

      test('should detect mobile devices correctly', () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          configurable: true,
        });
        Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
        
        const viewport = calculateViewportDimensions();
        
        expect(viewport.deviceType).toBe('mobile');
        expect(viewport.orientation).toBe('portrait');
        expect(viewport.isUltrawide).toBe(false);
      });

      test('should detect ultrawide displays', () => {
        Object.defineProperty(window, 'innerWidth', { value: 3440, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1440, configurable: true });
        
        const viewport = calculateViewportDimensions();
        
        expect(viewport.isUltrawide).toBe(true);
        expect(viewport.aspectRatio).toBeCloseTo(2.39, 2);
      });

      test('should detect tablet devices', () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
          configurable: true,
        });
        Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
        
        const viewport = calculateViewportDimensions();
        
        expect(viewport.deviceType).toBe('tablet');
        expect(viewport.orientation).toBe('landscape');
      });
    });

    describe('calculateResponsiveRenderScale', () => {
      test('should calculate appropriate render scale for mobile', () => {
        const viewport = {
          width: 375,
          height: 667,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait' as const,
          deviceType: 'mobile' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'low' as const,
          score: 0.3,
          features: {} as any,
        };
        
        const renderScale = calculateResponsiveRenderScale(viewport, capabilities);
        
        expect(renderScale).toBeGreaterThan(0.2);
        expect(renderScale).toBeLessThan(0.8);
      });

      test('should calculate appropriate render scale for desktop', () => {
        const viewport = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape' as const,
          deviceType: 'desktop' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };
        
        const renderScale = calculateResponsiveRenderScale(viewport, capabilities);
        
        expect(renderScale).toBeGreaterThan(0.8);
        expect(renderScale).toBeLessThanOrEqual(1.2);
      });

      test('should adjust for high-DPI displays', () => {
        const viewport = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 3,
          orientation: 'landscape' as const,
          deviceType: 'desktop' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };
        
        const renderScale = calculateResponsiveRenderScale(viewport, capabilities);
        
        // Should be reduced for high DPI
        expect(renderScale).toBeLessThan(1.0);
      });
    });

    describe('calculateResponsiveShaderSettings', () => {
      test('should generate appropriate settings for mobile', () => {
        const viewport = {
          width: 375,
          height: 667,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait' as const,
          deviceType: 'mobile' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'low' as const,
          score: 0.3,
          features: {} as any,
        };
        
        const settings = calculateResponsiveShaderSettings(viewport, capabilities);
        
        expect(settings.particleCount).toBeLessThan(80);
        expect(settings.renderScale).toBeLessThan(1.0);
        expect(settings.interactionRadius).toBeLessThanOrEqual(0.25);
        expect(settings.animationSpeed).toBeLessThanOrEqual(1.0);
        expect(settings.enableComplexEffects).toBe(false);
      });

      test('should generate appropriate settings for desktop', () => {
        const viewport = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape' as const,
          deviceType: 'desktop' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };
        
        const settings = calculateResponsiveShaderSettings(viewport, capabilities);
        
        expect(settings.particleCount).toBeGreaterThan(80);
        expect(settings.renderScale).toBeGreaterThan(0.8);
        expect(settings.interactionRadius).toBeGreaterThanOrEqual(0.3);
        expect(settings.enableComplexEffects).toBe(true);
      });

      test('should handle ultrawide displays', () => {
        const viewport = {
          width: 3440,
          height: 1440,
          aspectRatio: 2.39,
          pixelRatio: 1,
          orientation: 'landscape' as const,
          deviceType: 'desktop' as const,
          isUltrawide: true,
        };
        
        const capabilities = {
          tier: 'high' as const,
          score: 0.8,
          features: {} as any,
        };
        
        const settings = calculateResponsiveShaderSettings(viewport, capabilities);
        
        expect(settings.interactionRadius).toBeGreaterThan(0.3);
        expect(settings.particleCount).toBeGreaterThan(100);
      });
    });

    describe('ResponsiveTransitionManager', () => {
      test('should handle smooth transitions between settings', () => {
        const manager = new ResponsiveTransitionManager(300);
        
        const currentSettings = {
          renderScale: 0.8,
          particleCount: 100,
          interactionRadius: 0.3,
          animationSpeed: 1.0,
          qualityLevel: 0.8,
          enableComplexEffects: true,
          debounceDelay: 150,
          transitionDuration: 300,
        };
        
        const newSettings = {
          renderScale: 0.6,
          particleCount: 60,
          interactionRadius: 0.25,
          animationSpeed: 0.8,
          qualityLevel: 0.6,
          enableComplexEffects: false,
          debounceDelay: 200,
          transitionDuration: 300,
        };
        
        manager.startTransition(currentSettings, newSettings);
        
        expect(manager.isActive()).toBe(true);
        
        const interpolatedSettings = manager.updateTransition();
        expect(interpolatedSettings).not.toBeNull();
        
        if (interpolatedSettings) {
          expect(interpolatedSettings.renderScale).toBeGreaterThan(0.6);
          expect(interpolatedSettings.renderScale).toBeLessThan(0.8);
          expect(interpolatedSettings.particleCount).toBeGreaterThan(60);
          expect(interpolatedSettings.particleCount).toBeLessThan(100);
        }
      });

      test('should complete transitions properly', () => {
        const manager = new ResponsiveTransitionManager(100); // Short duration for testing
        
        const currentSettings = {
          renderScale: 1.0,
          particleCount: 100,
          interactionRadius: 0.3,
          animationSpeed: 1.0,
          qualityLevel: 1.0,
          enableComplexEffects: true,
          debounceDelay: 150,
          transitionDuration: 100,
        };
        
        const newSettings = {
          renderScale: 0.5,
          particleCount: 50,
          interactionRadius: 0.2,
          animationSpeed: 0.7,
          qualityLevel: 0.5,
          enableComplexEffects: false,
          debounceDelay: 200,
          transitionDuration: 100,
        };
        
        manager.startTransition(currentSettings, newSettings);
        
        // Simulate time passing
        jest.useFakeTimers();
        jest.advanceTimersByTime(150);
        
        const finalSettings = manager.updateTransition();
        expect(manager.isActive()).toBe(false);
        
        if (finalSettings) {
          expect(finalSettings.renderScale).toBe(0.5);
          expect(finalSettings.particleCount).toBe(50);
        }
        
        jest.useRealTimers();
      });
    });

    describe('calculateMobileOptimizations', () => {
      test('should provide appropriate mobile optimizations', () => {
        const viewport = {
          width: 375,
          height: 667,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait' as const,
          deviceType: 'mobile' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'low' as const,
          score: 0.3,
          features: {} as any,
        };
        
        const optimizations = calculateMobileOptimizations(viewport, capabilities);
        
        expect(optimizations.reducedParticleCount).toBeLessThan(50);
        expect(optimizations.simplifiedInteractions).toBe(true);
        expect(optimizations.batteryOptimized).toBe(true);
        expect(optimizations.reducedAnimationSpeed).toBeLessThan(1.0);
        expect(optimizations.touchSensitivity).toBeGreaterThan(0);
      });

      test('should adjust for very small screens', () => {
        const viewport = {
          width: 320,
          height: 568,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait' as const,
          deviceType: 'mobile' as const,
          isUltrawide: false,
        };
        
        const capabilities = {
          tier: 'low' as const,
          score: 0.3,
          features: {} as any,
        };
        
        const optimizations = calculateMobileOptimizations(viewport, capabilities);
        
        expect(optimizations.touchSensitivity).toBeGreaterThan(1.0);
        expect(optimizations.reducedParticleCount).toBeLessThan(30);
      });
    });
  });
});

  describe('Enhanced Responsive Scaling', () => {
    describe('calculateResponsiveScaling', () => {
      test('should calculate appropriate scaling for different screen sizes', () => {
        const mobileViewport: ViewportDimensions = {
          width: 375,
          height: 667,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait',
          deviceType: 'mobile',
          isUltrawide: false,
        };
        
        const desktopViewport: ViewportDimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: false,
        };
        
        const mobileScaling = calculateResponsiveScaling(mobileViewport);
        const desktopScaling = calculateResponsiveScaling(desktopViewport);
        
        expect(mobileScaling.scale).toBeLessThan(desktopScaling.scale);
        expect(mobileScaling.particleMultiplier).toBeLessThan(desktopScaling.particleMultiplier);
        expect(mobileScaling.qualityMultiplier).toBeLessThan(desktopScaling.qualityMultiplier);
      });

      test('should handle portrait orientation adjustments', () => {
        const portraitViewport: ViewportDimensions = {
          width: 768,
          height: 1024,
          aspectRatio: 0.75,
          pixelRatio: 1,
          orientation: 'portrait',
          deviceType: 'tablet',
          isUltrawide: false,
        };
        
        const landscapeViewport: ViewportDimensions = {
          width: 1024,
          height: 768,
          aspectRatio: 1.33,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'tablet',
          isUltrawide: false,
        };
        
        const portraitScaling = calculateResponsiveScaling(portraitViewport);
        const landscapeScaling = calculateResponsiveScaling(landscapeViewport);
        
        expect(portraitScaling.interactionMultiplier).toBeLessThan(landscapeScaling.interactionMultiplier);
      });

      test('should handle ultrawide displays', () => {
        const ultrawideViewport: ViewportDimensions = {
          width: 3440,
          height: 1440,
          aspectRatio: 2.39,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: true,
        };
        
        const scaling = calculateResponsiveScaling(ultrawideViewport);
        
        expect(scaling.scale).toBeGreaterThan(1.0);
        expect(scaling.particleMultiplier).toBeGreaterThan(1.2);
        expect(scaling.interactionMultiplier).toBeGreaterThan(1.1);
      });
    });

    describe('SmoothResizeManager', () => {
      test('should initialize with correct dimensions', () => {
        const initialDimensions: ViewportDimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: false,
        };
        
        const manager = new SmoothResizeManager(initialDimensions);
        const result = manager.update();
        
        expect(result.dimensions.width).toBe(1920);
        expect(result.dimensions.height).toBe(1080);
        expect(result.isResizing).toBe(false);
        expect(result.progress).toBe(1.0);
      });

      test('should start resize transition', () => {
        const initialDimensions: ViewportDimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: false,
        };
        
        const newDimensions: ViewportDimensions = {
          width: 1280,
          height: 720,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: false,
        };
        
        const manager = new SmoothResizeManager(initialDimensions);
        manager.startResize(newDimensions);
        
        const result = manager.update();
        expect(result.isResizing).toBe(true);
        expect(result.progress).toBeGreaterThanOrEqual(0);
      });

      test('should complete resize immediately when requested', () => {
        const initialDimensions: ViewportDimensions = {
          width: 1920,
          height: 1080,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: false,
        };
        
        const newDimensions: ViewportDimensions = {
          width: 1280,
          height: 720,
          aspectRatio: 1.78,
          pixelRatio: 1,
          orientation: 'landscape',
          deviceType: 'desktop',
          isUltrawide: false,
        };
        
        const manager = new SmoothResizeManager(initialDimensions);
        manager.startResize(newDimensions);
        manager.completeResize();
        
        const result = manager.update();
        expect(result.isResizing).toBe(false);
        expect(result.progress).toBe(1.0);
        expect(result.dimensions.width).toBe(1280);
        expect(result.dimensions.height).toBe(720);
      });
    });

    describe('calculateMobileTouchOptimizations', () => {
      test('should calculate touch optimizations for mobile devices', () => {
        const mobileViewport: ViewportDimensions = {
          width: 375,
          height: 667,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait',
          deviceType: 'mobile',
          isUltrawide: false,
        };
        
        const deviceCapabilities = {
          tier: 'low' as const,
          score: 0.4,
          features: {} as any,
        };
        
        const optimizations = calculateMobileTouchOptimizations(mobileViewport, deviceCapabilities);
        
        expect(optimizations.touchSensitivity).toBeGreaterThan(0);
        expect(optimizations.gestureThreshold).toBeGreaterThan(0);
        expect(optimizations.tapRadius).toBeGreaterThanOrEqual(44); // iOS HIG minimum
        expect(optimizations.swipeVelocityThreshold).toBeGreaterThan(0);
        expect(optimizations.pinchScaleThreshold).toBeGreaterThan(0);
        expect(optimizations.rotationThreshold).toBeGreaterThan(0);
      });

      test('should adjust for small screens', () => {
        const smallMobileViewport: ViewportDimensions = {
          width: 320,
          height: 568,
          aspectRatio: 0.56,
          pixelRatio: 2,
          orientation: 'portrait',
          deviceType: 'mobile',
          isUltrawide: false,
        };
        
        const largeMobileViewport: ViewportDimensions = {
          width: 414,
          height: 896,
          aspectRatio: 0.46,
          pixelRatio: 3,
          orientation: 'portrait',
          deviceType: 'mobile',
          isUltrawide: false,
        };
        
        const deviceCapabilities = {
          tier: 'low' as const,
          score: 0.4,
          features: {} as any,
        };
        
        const smallOptimizations = calculateMobileTouchOptimizations(smallMobileViewport, deviceCapabilities);
        const largeOptimizations = calculateMobileTouchOptimizations(largeMobileViewport, deviceCapabilities);
        
        expect(smallOptimizations.touchSensitivity).toBeGreaterThan(largeOptimizations.touchSensitivity);
        expect(smallOptimizations.tapRadius).toBeGreaterThanOrEqual(largeOptimizations.tapRadius);
      });
    });

    describe('processMultiTouchGesture', () => {
      // Mock TouchList and Touch objects for testing
      const createMockTouch = (clientX: number, clientY: number, identifier: number = 0): Touch => ({
        clientX,
        clientY,
        identifier,
        pageX: clientX,
        pageY: clientY,
        screenX: clientX,
        screenY: clientY,
        radiusX: 10,
        radiusY: 10,
        rotationAngle: 0,
        force: 1,
        target: document.createElement('div'),
      });
      
      const createMockTouchList = (touches: Touch[]): TouchList => {
        const touchList = {
          length: touches.length,
          item: (index: number) => touches[index] || null,
          [Symbol.iterator]: function* () {
            for (let i = 0; i < touches.length; i++) {
              yield touches[i];
            }
          },
        };
        
        // Add indexed access
        touches.forEach((touch, index) => {
          (touchList as any)[index] = touch;
        });
        
        return touchList as TouchList;
      };
      
      const mockRect: DOMRect = {
        left: 0,
        top: 0,
        width: 400,
        height: 600,
        right: 400,
        bottom: 600,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };

      test('should handle no touches', () => {
        const emptyTouchList = createMockTouchList([]);
        const gesture = processMultiTouchGesture(emptyTouchList, mockRect);
        
        expect(gesture.type).toBe('none');
        expect(gesture.touchCount).toBe(0);
        expect(gesture.center.x).toBe(0.5);
        expect(gesture.center.y).toBe(0.5);
      });

      test('should handle single touch (tap)', () => {
        const touch = createMockTouch(200, 300);
        const touchList = createMockTouchList([touch]);
        const gesture = processMultiTouchGesture(touchList, mockRect);
        
        expect(gesture.type).toBe('tap');
        expect(gesture.touchCount).toBe(1);
        expect(gesture.center.x).toBe(0.5); // 200/400
        expect(gesture.center.y).toBe(0.5); // 1.0 - (300/600)
      });

      test('should handle two touches', () => {
        const touch1 = createMockTouch(150, 250, 0);
        const touch2 = createMockTouch(250, 350, 1);
        const touchList = createMockTouchList([touch1, touch2]);
        
        const gesture = processMultiTouchGesture(touchList, mockRect);
        
        expect(gesture.touchCount).toBe(2);
        expect(gesture.center.x).toBeCloseTo(0.5); // Average of touch positions
        expect(gesture.center.y).toBeCloseTo(0.5);
        expect(gesture.distance).toBeGreaterThan(0);
        expect(typeof gesture.rotation).toBe('number');
      });

      test('should clamp center coordinates to valid range', () => {
        // Touch outside the container bounds
        const touch = createMockTouch(-100, -100);
        const touchList = createMockTouchList([touch]);
        const gesture = processMultiTouchGesture(touchList, mockRect);
        
        expect(gesture.center.x).toBeGreaterThanOrEqual(0);
        expect(gesture.center.x).toBeLessThanOrEqual(1);
        expect(gesture.center.y).toBeGreaterThanOrEqual(0);
        expect(gesture.center.y).toBeLessThanOrEqual(1);
      });
    });
  });
});