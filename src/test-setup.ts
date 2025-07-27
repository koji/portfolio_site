import '@testing-library/jest-dom';

// Mock WebGL2RenderingContext for tests
global.WebGL2RenderingContext = class MockWebGL2RenderingContext {};

// Mock WebGL context for tests
const mockWebGLContext = {
  canvas: document.createElement('canvas'),
  drawingBufferWidth: 1920,
  drawingBufferHeight: 1080,
  getExtension: (name) => {
    const extensions = {
      'WEBGL_debug_renderer_info': {
        UNMASKED_VENDOR_WEBGL: 37445,
        UNMASKED_RENDERER_WEBGL: 37446,
      },
      'OES_texture_float': {},
      'OES_texture_half_float': {},
      'WEBGL_lose_context': {
        loseContext: () => {},
        restoreContext: () => {},
      },
    };
    return extensions[name] || null;
  },
  getParameter: (param) => {
    const params = {
      37445: 'Mock Vendor', // UNMASKED_VENDOR_WEBGL
      37446: 'Mock Renderer', // UNMASKED_RENDERER_WEBGL
      3379: 2048, // MAX_TEXTURE_SIZE
      36347: 256, // MAX_VERTEX_UNIFORM_VECTORS
      36348: 256, // MAX_FRAGMENT_UNIFORM_VECTORS
      34930: 16, // MAX_TEXTURE_IMAGE_UNITS
    };
    return params[param] || 1024;
  },
  getSupportedExtensions: () => [
    'OES_texture_float',
    'OES_texture_half_float',
    'WEBGL_debug_renderer_info',
    'WEBGL_lose_context',
  ],
  createShader: () => ({}),
  shaderSource: () => {},
  compileShader: () => {},
  getShaderParameter: () => true,
  createProgram: () => ({}),
  attachShader: () => {},
  linkProgram: () => {},
  getProgramParameter: () => true,
  useProgram: () => {},
  createBuffer: () => ({}),
  bindBuffer: () => {},
  bufferData: () => {},
  getAttribLocation: () => 0,
  enableVertexAttribArray: () => {},
  vertexAttribPointer: () => {},
  getUniformLocation: () => ({}),
  uniform1f: () => {},
  uniform2f: () => {},
  uniform3f: () => {},
  uniformMatrix4fv: () => {},
  clear: () => {},
  clearColor: () => {},
  enable: () => {},
  disable: () => {},
  blendFunc: () => {},
  drawArrays: () => {},
  viewport: () => {},
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  LINK_STATUS: 35714,
  COLOR_BUFFER_BIT: 16384,
  DEPTH_BUFFER_BIT: 256,
  BLEND: 3042,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
  ARRAY_BUFFER: 34962,
  STATIC_DRAW: 35044,
  FLOAT: 5126,
  TRIANGLES: 4,
};

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === 'webgl' || contextId === 'experimental-webgl' || contextId === 'webgl2') {
    return mockWebGLContext;
  }
  return null;
};

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock navigator properties
Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 4,
});

Object.defineProperty(navigator, 'deviceMemory', {
  writable: true,
  value: 8,
});

// Mock window.devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  writable: true,
  value: 1,
});