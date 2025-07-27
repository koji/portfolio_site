/**
 * Comprehensive test suite for fallback shader systems
 * Tests shader validation, fallback selection, CSS fallbacks, and compatibility
 */

import { describe, test, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  fallbackVertexShader,
  minimalFallbackFragmentShader,
  reducedFallbackFragmentShader,
  cssOnlyFallback,
  staticFallback,
  getFallbackShader,
  validateShaderCompatibility,
  createCSSFallback,
  createStaticFallback,
  type FallbackShaderSet,
} from '../fallbackShaders';

// Mock DOM environment for testing
class MockElement {
  className = '';
  style: { [key: string]: string } = {};
  children: MockElement[] = [];
  parent: MockElement | null = null;

  constructor(public tagName: string) {}

  appendChild(child: MockElement): void {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: MockElement): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  setProperty(property: string, value: string): void {
    this.style[property] = value;
  }

  getAttribute(name: string): string | null {
    if (name === 'id') return this.id || null;
    return null;
  }

  setAttribute(name: string, value: string): void {
    if (name === 'id') this.id = value;
  }

  get textContent(): string {
    return this._textContent || '';
  }

  set textContent(value: string) {
    this._textContent = value;
  }

  private _textContent = '';
  private id = '';
}

class MockDocument {
  head = new MockElement('head');
  body = new MockElement('body');
  private elements: MockElement[] = [];

  createElement(tagName: string): MockElement {
    const element = new MockElement(tagName);
    this.elements.push(element);
    return element;
  }

  getElementById(id: string): MockElement | null {
    return this.elements.find(el => el.getAttribute('id') === id) || null;
  }

  appendChild(child: MockElement): void {
    this.body.appendChild(child);
  }
}

describe('Fallback Shader System', () => {
  let mockDocument: MockDocument;

  beforeEach(() => {
    mockDocument = new MockDocument();
    
    // Mock global document
    (global as any).document = mockDocument;
  });

  afterEach(() => {
    // Clean up global mocks
    delete (global as any).document;
  });

  describe('Shader Source Validation', () => {
    test('should validate basic vertex shader structure', () => {
      assert.strictEqual(typeof fallbackVertexShader, 'string');
      assert.strictEqual(fallbackVertexShader.includes('attribute vec4 position'), true);
      assert.strictEqual(fallbackVertexShader.includes('void main()'), true);
      assert.strictEqual(fallbackVertexShader.includes('gl_Position'), true);
    });

    test('should validate minimal fragment shader structure', () => {
      assert.strictEqual(typeof minimalFallbackFragmentShader, 'string');
      assert.strictEqual(minimalFallbackFragmentShader.includes('precision mediump float'), true);
      assert.strictEqual(minimalFallbackFragmentShader.includes('void main()'), true);
      assert.strictEqual(minimalFallbackFragmentShader.includes('gl_FragColor'), true);
    });

    test('should validate reduced fragment shader structure', () => {
      assert.strictEqual(typeof reducedFallbackFragmentShader, 'string');
      assert.strictEqual(reducedFallbackFragmentShader.includes('precision mediump float'), true);
      assert.strictEqual(reducedFallbackFragmentShader.includes('void main()'), true);
      assert.strictEqual(reducedFallbackFragmentShader.includes('gl_FragColor'), true);
    });

    test('should include required uniforms in fragment shaders', () => {
      const requiredUniforms = [
        'uniform float time',
        'uniform vec2 resolution',
        'uniform vec3 primaryColor',
        'uniform vec3 backgroundColor',
        'uniform float intensity',
      ];

      requiredUniforms.forEach(uniform => {
        assert.strictEqual(minimalFallbackFragmentShader.includes(uniform), true);
        assert.strictEqual(reducedFallbackFragmentShader.includes(uniform), true);
      });
    });

    test('should include particle system uniforms in reduced shader', () => {
      const particleUniforms = [
        'uniform float particleCount',
        'uniform float flowSpeed',
      ];

      particleUniforms.forEach(uniform => {
        assert.strictEqual(reducedFallbackFragmentShader.includes(uniform), true);
      });
    });

    test('should include noise and particle functions in reduced shader', () => {
      assert.strictEqual(reducedFallbackFragmentShader.includes('float hash('), true);
      assert.strictEqual(reducedFallbackFragmentShader.includes('float noise('), true);
      assert.strictEqual(reducedFallbackFragmentShader.includes('float particles('), true);
      assert.strictEqual(reducedFallbackFragmentShader.includes('float flowingLines('), true);
    });

    test('should have proper WebGL 1.0 compatibility', () => {
      const shaders = [fallbackVertexShader, minimalFallbackFragmentShader, reducedFallbackFragmentShader];
      
      shaders.forEach(shader => {
        // Should not contain WebGL 2.0 specific syntax
        assert.strictEqual(shader.includes('#version 300 es'), false);
        assert.strictEqual(shader.includes(' in '), false);
        assert.strictEqual(shader.includes(' out '), false);
        
        // Should contain WebGL 1.0 syntax
        if (shader.includes('attribute') || shader.includes('varying')) {
          // Vertex shader syntax
          assert.strictEqual(shader.includes('attribute') || shader.includes('uniform'), true);
        } else {
          // Fragment shader should have precision qualifier
          assert.strictEqual(shader.includes('precision'), true);
        }
      });
    });
  });

  describe('Shader Compatibility Validation', () => {
    test('should validate WebGL 1.0 compatible shaders', () => {
      const webgl1Shader = `
        precision mediump float;
        uniform float time;
        void main() {
          gl_FragColor = vec4(sin(time), 0.0, 0.0, 1.0);
        }
      `;

      const validation = validateShaderCompatibility(webgl1Shader, 1);
      assert.strictEqual(validation.compatible, true);
      assert.strictEqual(validation.issues.length, 0);
    });

    test('should detect WebGL 2.0 syntax in WebGL 1.0 context', () => {
      const webgl2Shader = `
        #version 300 es
        precision mediump float;
        in vec2 texCoord;
        out vec4 fragColor;
        void main() {
          fragColor = vec4(1.0);
        }
      `;

      const validation = validateShaderCompatibility(webgl2Shader, 1);
      assert.strictEqual(validation.compatible, false);
      assert.strictEqual(validation.issues.length > 0, true);
      assert.strictEqual(validation.issues.some(issue => issue.includes('version')), true);
      assert.strictEqual(validation.issues.some(issue => issue.includes('in/out')), true);
    });

    test('should detect missing precision qualifiers', () => {
      const noPrecisionShader = `
        uniform float time;
        void main() {
          float value = sin(time);
          gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
        }
      `;

      const validation = validateShaderCompatibility(noPrecisionShader, 1);
      assert.strictEqual(validation.compatible, false);
      assert.strictEqual(validation.issues.some(issue => issue.includes('precision')), true);
    });

    test('should detect potentially problematic large loops', () => {
      const largeLoopShader = `
        precision mediump float;
        void main() {
          float sum = 0.0;
          for (int i = 0; i < 500; i++) {
            sum += float(i);
          }
          gl_FragColor = vec4(sum * 0.001, 0.0, 0.0, 1.0);
        }
      `;

      const validation = validateShaderCompatibility(largeLoopShader, 1);
      assert.strictEqual(validation.compatible, false);
      assert.strictEqual(validation.issues.some(issue => issue.includes('loop')), true);
    });

    test('should provide helpful fixes for common issues', () => {
      const problematicShader = `
        #version 300 es
        in vec2 position;
        void main() {
          gl_FragColor = vec4(1.0);
        }
      `;

      const validation = validateShaderCompatibility(problematicShader, 1);
      assert.strictEqual(validation.fixes.length > 0, true);
      assert.strictEqual(validation.fixes.some(fix => fix.includes('Remove #version')), true);
    });

    test('should handle WebGL 2.0 context validation', () => {
      const webgl2Shader = `
        #version 300 es
        precision mediump float;
        in vec2 texCoord;
        out vec4 fragColor;
        void main() {
          fragColor = vec4(1.0);
        }
      `;

      const validation = validateShaderCompatibility(webgl2Shader, 2);
      assert.strictEqual(validation.compatible, true);
      assert.strictEqual(validation.issues.length, 0);
    });

    test('should detect extension dependencies', () => {
      const extensionShader = `
        precision mediump float;
        void main() {
          float dx = dFdx(gl_FragCoord.x);
          gl_FragColor = vec4(dx, 0.0, 0.0, 1.0);
        }
      `;

      const validation = validateShaderCompatibility(extensionShader, 1);
      assert.strictEqual(validation.issues.some(issue => issue.includes('dFdx')), true);
      assert.strictEqual(validation.fixes.some(fix => fix.includes('extension')), true);
    });
  });

  describe('Fallback Shader Selection', () => {
    test('should select CSS fallback for unsupported WebGL', () => {
      const fallback = getFallbackShader(false, 'critical');
      
      assert.strictEqual(fallback.level, 'css');
      assert.strictEqual(fallback.vertex, '');
      assert.strictEqual(fallback.fragment, '');
      assert.strictEqual(fallback.description.includes('CSS-only'), true);
    });

    test('should select minimal shader for high error severity', () => {
      const fallback = getFallbackShader(true, 'high');
      
      assert.strictEqual(fallback.level, 'minimal');
      assert.strictEqual(fallback.vertex, fallbackVertexShader);
      assert.strictEqual(fallback.fragment, minimalFallbackFragmentShader);
      assert.strictEqual(fallback.description.includes('Minimal'), true);
    });

    test('should select minimal shader for very limited hardware', () => {
      const limitedCapabilities = {
        maxTextureSize: 256,
        maxFragmentUniforms: 4,
      };

      const fallback = getFallbackShader(true, 'medium', limitedCapabilities);
      
      assert.strictEqual(fallback.level, 'minimal');
      assert.strictEqual(fallback.vertex, fallbackVertexShader);
      assert.strictEqual(fallback.fragment, minimalFallbackFragmentShader);
    });

    test('should select reduced shader for medium error severity', () => {
      const fallback = getFallbackShader(true, 'medium');
      
      assert.strictEqual(fallback.level, 'reduced');
      assert.strictEqual(fallback.vertex, fallbackVertexShader);
      assert.strictEqual(fallback.fragment, reducedFallbackFragmentShader);
      assert.strictEqual(fallback.description.includes('Reduced'), true);
    });

    test('should select reduced shader for limited hardware', () => {
      const limitedCapabilities = {
        maxTextureSize: 512,
        maxFragmentUniforms: 8,
      };

      const fallback = getFallbackShader(true, 'low', limitedCapabilities);
      
      assert.strictEqual(fallback.level, 'reduced');
    });

    test('should select reduced shader for low error severity as fallback', () => {
      const fallback = getFallbackShader(true, 'low');
      
      assert.strictEqual(fallback.level, 'reduced');
      assert.strictEqual(fallback.vertex, fallbackVertexShader);
      assert.strictEqual(fallback.fragment, reducedFallbackFragmentShader);
    });

    test('should handle edge cases in capability detection', () => {
      const edgeCases = [
        { maxTextureSize: 0, maxFragmentUniforms: 0 },
        { maxTextureSize: 1024, maxFragmentUniforms: 0 },
        { maxTextureSize: 0, maxFragmentUniforms: 16 },
      ];

      edgeCases.forEach(capabilities => {
        const fallback = getFallbackShader(true, 'low', capabilities);
        assert.strictEqual(['minimal', 'reduced'].includes(fallback.level), true);
      });
    });
  });

  describe('CSS Fallback System', () => {
    test('should validate CSS fallback structure', () => {
      assert.strictEqual(typeof cssOnlyFallback, 'string');
      assert.strictEqual(cssOnlyFallback.includes('.shader-fallback'), true);
      assert.strictEqual(cssOnlyFallback.includes('@keyframes gradientShift'), true);
      assert.strictEqual(cssOnlyFallback.includes('@keyframes floatingOrbs'), true);
    });

    test('should include accessibility support in CSS fallback', () => {
      assert.strictEqual(cssOnlyFallback.includes('@media (prefers-reduced-motion: reduce)'), true);
      assert.strictEqual(cssOnlyFallback.includes('@media (prefers-contrast: high)'), true);
    });

    test('should include dark theme support in CSS fallback', () => {
      assert.strictEqual(cssOnlyFallback.includes('.dark .shader-fallback'), true);
    });

    test('should create CSS fallback element with proper styling', () => {
      const container = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        accent: '#e83e8c',
        background: '#ffffff',
      };

      const fallbackElement = createCSSFallback(container as any, themeColors, 0.5);

      assert.strictEqual(fallbackElement.className, 'shader-fallback');
      assert.strictEqual(fallbackElement.style['--primary-color'], '#ff6600');
      assert.strictEqual(fallbackElement.style['--accent-color'], '#e83e8c');
      assert.strictEqual(fallbackElement.style['--background-color'], '#ffffff');
      assert.strictEqual(fallbackElement.style.opacity, '0.5');
      assert.strictEqual(container.children.includes(fallbackElement), true);
    });

    test('should inject CSS styles only once', () => {
      const container1 = mockDocument.createElement('div');
      const container2 = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        accent: '#e83e8c',
        background: '#ffffff',
      };

      createCSSFallback(container1 as any, themeColors);
      createCSSFallback(container2 as any, themeColors);

      // Should only create one style element
      const styleElements = mockDocument.head.children.filter(
        child => child.getAttribute('id') === 'shader-fallback-styles'
      );
      assert.strictEqual(styleElements.length <= 1, true);
    });

    test('should handle different theme colors correctly', () => {
      const container = mockDocument.createElement('div');
      const darkThemeColors = {
        primary: '#ff7733',
        accent: '#f25c92',
        background: '#0d0d0d',
      };

      const fallbackElement = createCSSFallback(container as any, darkThemeColors, 0.8);

      assert.strictEqual(fallbackElement.style['--primary-color'], '#ff7733');
      assert.strictEqual(fallbackElement.style['--accent-color'], '#f25c92');
      assert.strictEqual(fallbackElement.style['--background-color'], '#0d0d0d');
      assert.strictEqual(fallbackElement.style.opacity, '0.8');
    });

    test('should use default intensity when not specified', () => {
      const container = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        accent: '#e83e8c',
        background: '#ffffff',
      };

      const fallbackElement = createCSSFallback(container as any, themeColors);

      assert.strictEqual(fallbackElement.style.opacity, '0.3'); // Default intensity
    });
  });

  describe('Static Fallback System', () => {
    test('should validate static fallback CSS structure', () => {
      assert.strictEqual(typeof staticFallback, 'string');
      assert.strictEqual(staticFallback.includes('.shader-static-fallback'), true);
      assert.strictEqual(staticFallback.includes('radial-gradient'), true);
      assert.strictEqual(staticFallback.includes('.dark .shader-static-fallback'), true);
    });

    test('should create static fallback element with minimal styling', () => {
      const container = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        background: '#ffffff',
      };

      const fallbackElement = createStaticFallback(container as any, themeColors, 0.2);

      assert.strictEqual(fallbackElement.className, 'shader-static-fallback');
      assert.strictEqual(fallbackElement.style['--primary-color'], '#ff6600');
      assert.strictEqual(fallbackElement.style['--background-color'], '#ffffff');
      assert.strictEqual(fallbackElement.style.opacity, '0.2');
      assert.strictEqual(container.children.includes(fallbackElement), true);
    });

    test('should inject static fallback styles only once', () => {
      const container1 = mockDocument.createElement('div');
      const container2 = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        background: '#ffffff',
      };

      createStaticFallback(container1 as any, themeColors);
      createStaticFallback(container2 as any, themeColors);

      // Should only create one style element
      const styleElements = mockDocument.head.children.filter(
        child => child.getAttribute('id') === 'shader-static-fallback-styles'
      );
      assert.strictEqual(styleElements.length <= 1, true);
    });

    test('should use default intensity for static fallback', () => {
      const container = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        background: '#ffffff',
      };

      const fallbackElement = createStaticFallback(container as any, themeColors);

      assert.strictEqual(fallbackElement.style.opacity, '0.1'); // Default intensity
    });

    test('should handle dark theme colors in static fallback', () => {
      const container = mockDocument.createElement('div');
      const darkThemeColors = {
        primary: '#ff7733',
        background: '#0d0d0d',
      };

      const fallbackElement = createStaticFallback(container as any, darkThemeColors, 0.15);

      assert.strictEqual(fallbackElement.style['--primary-color'], '#ff7733');
      assert.strictEqual(fallbackElement.style['--background-color'], '#0d0d0d');
      assert.strictEqual(fallbackElement.style.opacity, '0.15');
    });
  });

  describe('Fallback Performance and Compatibility', () => {
    test('should have reasonable shader source lengths', () => {
      // Shaders should not be excessively long to avoid compilation issues
      assert.strictEqual(fallbackVertexShader.length < 500, true);
      assert.strictEqual(minimalFallbackFragmentShader.length < 2000, true);
      assert.strictEqual(reducedFallbackFragmentShader.length < 5000, true);
    });

    test('should have reasonable CSS lengths', () => {
      // CSS should not be excessively long
      assert.strictEqual(cssOnlyFallback.length < 10000, true);
      assert.strictEqual(staticFallback.length < 2000, true);
    });

    test('should avoid complex mathematical operations in minimal shader', () => {
      // Minimal shader should avoid expensive operations
      const expensiveOps = ['pow(', 'exp(', 'log(', 'sqrt(', 'atan(', 'asin(', 'acos('];
      
      expensiveOps.forEach(op => {
        const count = (minimalFallbackFragmentShader.match(new RegExp(op, 'g')) || []).length;
        assert.strictEqual(count <= 2, true); // Allow minimal usage
      });
    });

    test('should limit loop iterations in reduced shader', () => {
      const loopMatches = reducedFallbackFragmentShader.match(/for\s*\([^)]*;\s*[^;]*<\s*(\d+)/g);
      
      if (loopMatches) {
        loopMatches.forEach(match => {
          const iterations = parseInt(match.match(/(\d+)$/)?.[1] || '0');
          assert.strictEqual(iterations <= 50, true); // Reasonable limit for fallback
        });
      }
    });

    test('should use efficient blending in CSS fallbacks', () => {
      // CSS should use efficient properties
      assert.strictEqual(cssOnlyFallback.includes('mix-blend-mode'), true);
      assert.strictEqual(cssOnlyFallback.includes('transform'), true);
    });

    test('should provide graceful animation fallbacks', () => {
      // Should handle reduced motion preferences
      assert.strictEqual(cssOnlyFallback.includes('animation: none'), true);
      assert.strictEqual(cssOnlyFallback.includes('prefers-reduced-motion'), true);
    });

    test('should maintain visual consistency across fallback levels', () => {
      // All fallbacks should use similar color variables
      const colorVariables = ['--primary-color', '--accent-color', '--background-color'];
      
      colorVariables.forEach(variable => {
        if (cssOnlyFallback.includes(variable)) {
          assert.strictEqual(cssOnlyFallback.includes(`var(${variable}`), true);
        }
      });
    });

    test('should handle edge cases in fallback selection', () => {
      const edgeCases = [
        { webglSupported: true, errorSeverity: 'critical' as const },
        { webglSupported: false, errorSeverity: 'low' as const },
        { webglSupported: true, errorSeverity: 'medium' as const, capabilities: undefined },
      ];

      edgeCases.forEach(({ webglSupported, errorSeverity, capabilities }) => {
        const fallback = getFallbackShader(webglSupported, errorSeverity, capabilities);
        
        assert.strictEqual(typeof fallback.level, 'string');
        assert.strictEqual(typeof fallback.description, 'string');
        assert.strictEqual(['minimal', 'reduced', 'css', 'static'].includes(fallback.level), true);
      });
    });

    test('should provide meaningful descriptions for each fallback level', () => {
      const testCases = [
        { webglSupported: false, errorSeverity: 'critical' as const, expectedLevel: 'css' },
        { webglSupported: true, errorSeverity: 'high' as const, expectedLevel: 'minimal' },
        { webglSupported: true, errorSeverity: 'medium' as const, expectedLevel: 'reduced' },
        { webglSupported: true, errorSeverity: 'low' as const, expectedLevel: 'reduced' },
      ];

      testCases.forEach(({ webglSupported, errorSeverity, expectedLevel }) => {
        const fallback = getFallbackShader(webglSupported, errorSeverity);
        
        assert.strictEqual(fallback.level, expectedLevel);
        assert.strictEqual(fallback.description.length > 10, true);
        assert.strictEqual(fallback.description.includes(expectedLevel === 'css' ? 'CSS' : 'shader'), true);
      });
    });
  });

  describe('Integration and Error Handling', () => {
    test('should handle malformed theme colors gracefully', () => {
      const container = mockDocument.createElement('div');
      const malformedColors = {
        primary: '', // Empty string
        accent: 'invalid-color',
        background: null as any, // Null value
      };

      assert.doesNotThrow(() => {
        createCSSFallback(container as any, malformedColors);
      });
    });

    test('should handle missing container gracefully', () => {
      const themeColors = {
        primary: '#ff6600',
        accent: '#e83e8c',
        background: '#ffffff',
      };

      assert.doesNotThrow(() => {
        createCSSFallback(null as any, themeColors);
      });
    });

    test('should handle extreme intensity values', () => {
      const container = mockDocument.createElement('div');
      const themeColors = {
        primary: '#ff6600',
        accent: '#e83e8c',
        background: '#ffffff',
      };

      const extremeValues = [-1, 0, 0.5, 1, 2, 100];

      extremeValues.forEach(intensity => {
        assert.doesNotThrow(() => {
          createCSSFallback(container as any, themeColors, intensity);
        });
      });
    });

    test('should handle shader validation with empty or null input', () => {
      const edgeCases = ['', null as any, undefined as any];

      edgeCases.forEach(shader => {
        assert.doesNotThrow(() => {
          validateShaderCompatibility(shader || '', 1);
        });
      });
    });

    test('should handle fallback selection with invalid parameters', () => {
      const invalidCases = [
        { webglSupported: null as any, errorSeverity: 'medium' as const },
        { webglSupported: true, errorSeverity: 'invalid' as any },
        { webglSupported: true, errorSeverity: 'medium' as const, capabilities: null as any },
      ];

      invalidCases.forEach(({ webglSupported, errorSeverity, capabilities }) => {
        assert.doesNotThrow(() => {
          getFallbackShader(webglSupported, errorSeverity, capabilities);
        });
      });
    });

    test('should maintain consistent fallback behavior across multiple calls', () => {
      const params = { webglSupported: true, errorSeverity: 'medium' as const };
      
      const fallback1 = getFallbackShader(params.webglSupported, params.errorSeverity);
      const fallback2 = getFallbackShader(params.webglSupported, params.errorSeverity);

      assert.strictEqual(fallback1.level, fallback2.level);
      assert.strictEqual(fallback1.vertex, fallback2.vertex);
      assert.strictEqual(fallback1.fragment, fallback2.fragment);
      assert.strictEqual(fallback1.description, fallback2.description);
    });
  });
});