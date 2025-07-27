/**
 * Comprehensive error handling and fallback systems for enhanced shader background
 * Implements robust error detection, recovery mechanisms, and graceful degradation
 */

export interface ShaderError {
  type: 'compilation' | 'context_loss' | 'webgl_unavailable' | 'performance' | 'memory' | 'unknown';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  context?: any;
}

export interface FallbackState {
  level: 'none' | 'reduced' | 'minimal' | 'disabled';
  reason: string;
  timestamp: number;
  previousLevel?: string;
}

export interface RecoveryOptions {
  maxRetries: number;
  retryDelay: number;
  fallbackDelay: number;
  enableLogging: boolean;
  onError?: (error: ShaderError) => void;
  onRecovery?: (success: boolean) => void;
  onFallback?: (state: FallbackState) => void;
}

export interface WebGLCapabilities {
  supported: boolean;
  version: number;
  maxTextureSize: number;
  maxVertexAttribs: number;
  maxFragmentUniforms: number;
  extensions: string[];
  renderer: string;
  vendor: string;
  contextLossExtension?: WEBGL_lose_context;
}

export interface ShaderCompilationResult {
  success: boolean;
  shader?: WebGLShader;
  program?: WebGLProgram;
  error?: string;
  warnings: string[];
  fallbackUsed: boolean;
}

/**
 * Default recovery options
 */
export const DEFAULT_RECOVERY_OPTIONS: RecoveryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  fallbackDelay: 5000,
  enableLogging: true,
};

/**
 * Error logging and tracking system
 */
export class ShaderErrorLogger {
  private errors: ShaderError[] = [];
  private maxErrors = 100;
  private enableConsoleLogging: boolean;

  constructor(enableConsoleLogging = true) {
    this.enableConsoleLogging = enableConsoleLogging;
  }

  /**
   * Logs a shader error with context
   */
  logError(
    type: ShaderError['type'],
    message: string,
    severity: ShaderError['severity'] = 'medium',
    context?: any
  ): ShaderError {
    const error: ShaderError = {
      type,
      message,
      timestamp: Date.now(),
      severity,
      recoverable: this.isRecoverable(type, severity),
      context,
    };

    this.errors.push(error);

    // Maintain error history limit
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Console logging for development
    if (this.enableConsoleLogging) {
      const logMethod = severity === 'critical' ? 'error' : severity === 'high' ? 'warn' : 'log';
      console[logMethod](`[ShaderError:${type}] ${message}`, context);
    }

    return error;
  }

  /**
   * Determines if an error type is recoverable
   */
  private isRecoverable(type: ShaderError['type'], severity: ShaderError['severity']): boolean {
    if (severity === 'critical') return false;
    
    switch (type) {
      case 'compilation':
        return true; // Can fallback to simpler shader
      case 'context_loss':
        return true; // WebGL context can be restored
      case 'performance':
        return true; // Can reduce quality
      case 'memory':
        return true; // Can reduce memory usage
      case 'webgl_unavailable':
        return false; // Cannot recover from no WebGL support
      default:
        return severity !== 'high';
    }
  }

  /**
   * Gets recent errors of a specific type
   */
  getRecentErrors(type?: ShaderError['type'], maxAge = 60000): ShaderError[] {
    const cutoff = Date.now() - maxAge;
    return this.errors.filter(error => 
      error.timestamp > cutoff && (!type || error.type === type)
    );
  }

  /**
   * Checks if error rate is too high
   */
  isErrorRateTooHigh(type?: ShaderError['type'], timeWindow = 30000, maxErrors = 5): boolean {
    const recentErrors = this.getRecentErrors(type, timeWindow);
    return recentErrors.length >= maxErrors;
  }

  /**
   * Clears error history
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Gets error statistics
   */
  getErrorStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    
    this.errors.forEach(error => {
      const key = `${error.type}_${error.severity}`;
      stats[key] = (stats[key] || 0) + 1;
    });

    return stats;
  }
}

/**
 * WebGL capability detection and validation
 */
export class WebGLCapabilityDetector {
  private capabilities: WebGLCapabilities | null = null;
  private canvas: HTMLCanvasElement | null = null;

  /**
   * Detects WebGL capabilities and support
   */
  detectCapabilities(): WebGLCapabilities {
    if (this.capabilities) {
      return this.capabilities;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = 1;
    this.canvas.height = 1;

    const capabilities: WebGLCapabilities = {
      supported: false,
      version: 0,
      maxTextureSize: 0,
      maxVertexAttribs: 0,
      maxFragmentUniforms: 0,
      extensions: [],
      renderer: 'unknown',
      vendor: 'unknown',
    };

    try {
      // Try WebGL 2.0 first
      let gl = this.canvas.getContext('webgl2') as WebGL2RenderingContext;
      if (gl) {
        capabilities.version = 2;
      } else {
        // Fallback to WebGL 1.0
        gl = this.canvas.getContext('webgl') as WebGLRenderingContext;
        if (gl) {
          capabilities.version = 1;
        }
      }

      if (gl) {
        capabilities.supported = true;
        capabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        capabilities.maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        capabilities.maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

        // Get renderer info
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          capabilities.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
          capabilities.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown';
        }

        // Get supported extensions
        capabilities.extensions = gl.getSupportedExtensions() || [];

        // Get context loss extension for testing
        capabilities.contextLossExtension = gl.getExtension('WEBGL_lose_context') || undefined;
      }
    } catch (error) {
      console.warn('WebGL capability detection failed:', error);
    }

    this.capabilities = capabilities;
    return capabilities;
  }

  /**
   * Checks if device supports required WebGL features
   */
  supportsRequiredFeatures(): boolean {
    const caps = this.detectCapabilities();
    
    if (!caps.supported) return false;
    
    // Minimum requirements for enhanced shader
    return (
      caps.maxTextureSize >= 1024 &&
      caps.maxVertexAttribs >= 8 &&
      caps.maxFragmentUniforms >= 16
    );
  }

  /**
   * Gets recommended quality level based on capabilities
   */
  getRecommendedQuality(): 'low' | 'medium' | 'high' {
    const caps = this.detectCapabilities();
    
    if (!caps.supported) return 'low';
    
    // High-end: WebGL 2.0 with good specs
    if (caps.version >= 2 && caps.maxTextureSize >= 4096) {
      return 'high';
    }
    
    // Medium: WebGL 1.0 with decent specs
    if (caps.maxTextureSize >= 2048 && caps.maxFragmentUniforms >= 32) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Simulates context loss for testing
   */
  simulateContextLoss(): boolean {
    const caps = this.detectCapabilities();
    if (caps.contextLossExtension) {
      caps.contextLossExtension.loseContext();
      return true;
    }
    return false;
  }

  /**
   * Restores context after simulated loss
   */
  restoreContext(): boolean {
    const caps = this.detectCapabilities();
    if (caps.contextLossExtension) {
      caps.contextLossExtension.restoreContext();
      return true;
    }
    return false;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }
    this.capabilities = null;
  }
}

/**
 * Shader compilation with error handling and fallbacks
 */
export class ShaderCompiler {
  private logger: ShaderErrorLogger;
  private gl: WebGLRenderingContext | null = null;

  constructor(logger: ShaderErrorLogger) {
    this.logger = logger;
  }

  /**
   * Compiles shader with comprehensive error handling
   */
  compileShader(
    gl: WebGLRenderingContext,
    source: string,
    type: number,
    fallbackSource?: string
  ): ShaderCompilationResult {
    this.gl = gl;

    const result: ShaderCompilationResult = {
      success: false,
      warnings: [],
      fallbackUsed: false,
    };

    try {
      // Try primary shader first
      const primaryResult = this.attemptCompilation(gl, source, type);
      
      if (primaryResult.success) {
        return { ...result, ...primaryResult };
      }

      // Log compilation error
      this.logger.logError(
        'compilation',
        `Primary shader compilation failed: ${primaryResult.error}`,
        'medium',
        { source: source.substring(0, 200) + '...' }
      );

      // Try fallback shader if available
      if (fallbackSource) {
        const fallbackResult = this.attemptCompilation(gl, fallbackSource, type);
        
        if (fallbackResult.success) {
          this.logger.logError(
            'compilation',
            'Using fallback shader due to primary compilation failure',
            'low'
          );
          
          return {
            ...result,
            ...fallbackResult,
            fallbackUsed: true,
            warnings: [...result.warnings, 'Primary shader failed, using fallback'],
          };
        }

        this.logger.logError(
          'compilation',
          `Fallback shader compilation also failed: ${fallbackResult.error}`,
          'high'
        );
      }

      // Both primary and fallback failed
      this.logger.logError(
        'compilation',
        'All shader compilation attempts failed',
        'critical'
      );

      return result;

    } catch (error) {
      this.logger.logError(
        'compilation',
        `Shader compilation threw exception: ${error}`,
        'critical',
        { error }
      );
      
      return result;
    }
  }

  /**
   * Attempts to compile a single shader
   */
  private attemptCompilation(
    gl: WebGLRenderingContext,
    source: string,
    type: number
  ): { success: boolean; shader?: WebGLShader; error?: string } {
    const shader = gl.createShader(type);
    
    if (!shader) {
      return {
        success: false,
        error: 'Failed to create shader object',
      };
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader) || 'Unknown compilation error';
      gl.deleteShader(shader);
      
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      shader,
    };
  }

  /**
   * Links shader program with error handling
   */
  linkProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): ShaderCompilationResult {
    const result: ShaderCompilationResult = {
      success: false,
      warnings: [],
      fallbackUsed: false,
    };

    try {
      const program = gl.createProgram();
      
      if (!program) {
        this.logger.logError(
          'compilation',
          'Failed to create shader program',
          'critical'
        );
        return result;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program) || 'Unknown linking error';
        gl.deleteProgram(program);
        
        this.logger.logError(
          'compilation',
          `Shader program linking failed: ${error}`,
          'high'
        );
        
        return result;
      }

      // Validate program
      gl.validateProgram(program);
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        const warning = gl.getProgramInfoLog(program) || 'Program validation warning';
        result.warnings.push(`Program validation: ${warning}`);
      }

      return {
        ...result,
        success: true,
        program,
      };

    } catch (error) {
      this.logger.logError(
        'compilation',
        `Shader program linking threw exception: ${error}`,
        'critical',
        { error }
      );
      
      return result;
    }
  }

  /**
   * Validates shader source for common issues
   */
  validateShaderSource(source: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for common syntax issues
    if (!source.includes('void main()')) {
      issues.push('Missing main() function');
    }

    if (source.includes('gl_FragColor') && source.includes('#version 300 es')) {
      issues.push('Using gl_FragColor in WebGL 2.0 context (use out variables)');
    }

    if (!source.includes('precision') && source.includes('float')) {
      issues.push('Missing precision qualifier for float');
    }

    // Check for potentially problematic constructs
    if (source.includes('for') && source.match(/for\s*\([^)]*;\s*[^;]*<\s*\d{3,}/)) {
      issues.push('Large loop detected - may cause performance issues');
    }

    if (source.split('\n').length > 500) {
      issues.push('Shader source is very large - may cause compilation issues');
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

/**
 * WebGL context loss recovery manager
 */
export class ContextLossRecoveryManager {
  private logger: ShaderErrorLogger;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private isContextLost = false;
  private recoveryCallbacks: Array<() => void> = [];
  private stateSnapshot: any = null;

  constructor(logger: ShaderErrorLogger) {
    this.logger = logger;
  }

  /**
   * Initializes context loss handling for a canvas
   */
  initialize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): void {
    this.canvas = canvas;
    this.gl = gl;

    // Add context loss event listeners
    canvas.addEventListener('webglcontextlost', this.handleContextLost.bind(this));
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored.bind(this));
  }

  /**
   * Handles WebGL context loss
   */
  private handleContextLost(event: Event): void {
    event.preventDefault(); // Prevent default context loss behavior
    
    this.isContextLost = true;
    
    this.logger.logError(
      'context_loss',
      'WebGL context lost - attempting recovery',
      'high',
      { timestamp: Date.now() }
    );

    // Take snapshot of current state for recovery
    this.captureStateSnapshot();
  }

  /**
   * Handles WebGL context restoration
   */
  private handleContextRestored(event: Event): void {
    this.isContextLost = false;
    
    this.logger.logError(
      'context_loss',
      'WebGL context restored - rebuilding resources',
      'medium',
      { timestamp: Date.now() }
    );

    // Attempt to restore state
    this.restoreState();

    // Notify recovery callbacks
    this.recoveryCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        this.logger.logError(
          'context_loss',
          `Recovery callback failed: ${error}`,
          'medium',
          { error }
        );
      }
    });
  }

  /**
   * Captures comprehensive WebGL state for recovery
   */
  private captureStateSnapshot(): void {
    if (!this.gl) return;

    try {
      this.stateSnapshot = {
        viewport: this.gl.getParameter(this.gl.VIEWPORT),
        clearColor: this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE),
        blendEnabled: this.gl.isEnabled(this.gl.BLEND),
        blendSrcRGB: this.gl.getParameter(this.gl.BLEND_SRC_RGB),
        blendDstRGB: this.gl.getParameter(this.gl.BLEND_DST_RGB),
        blendSrcAlpha: this.gl.getParameter(this.gl.BLEND_SRC_ALPHA),
        blendDstAlpha: this.gl.getParameter(this.gl.BLEND_DST_ALPHA),
        depthTestEnabled: this.gl.isEnabled(this.gl.DEPTH_TEST),
        depthFunc: this.gl.getParameter(this.gl.DEPTH_FUNC),
        cullFaceEnabled: this.gl.isEnabled(this.gl.CULL_FACE),
        cullFaceMode: this.gl.getParameter(this.gl.CULL_FACE_MODE),
        frontFace: this.gl.getParameter(this.gl.FRONT_FACE),
        scissorTestEnabled: this.gl.isEnabled(this.gl.SCISSOR_TEST),
        scissorBox: this.gl.getParameter(this.gl.SCISSOR_BOX),
        activeTexture: this.gl.getParameter(this.gl.ACTIVE_TEXTURE),
        timestamp: Date.now(),
      };

      this.logger.logError(
        'context_loss',
        'Comprehensive WebGL state captured for recovery',
        'low',
        { stateKeys: Object.keys(this.stateSnapshot) }
      );
    } catch (error) {
      this.logger.logError(
        'context_loss',
        `Failed to capture state snapshot: ${error}`,
        'medium',
        { error }
      );
    }
  }

  /**
   * Restores comprehensive WebGL state after context recovery
   */
  private restoreState(): void {
    if (!this.gl || !this.stateSnapshot) return;

    try {
      // Restore viewport
      if (this.stateSnapshot.viewport) {
        const [x, y, width, height] = this.stateSnapshot.viewport;
        this.gl.viewport(x, y, width, height);
      }

      // Restore clear color
      if (this.stateSnapshot.clearColor) {
        const [r, g, b, a] = this.stateSnapshot.clearColor;
        this.gl.clearColor(r, g, b, a);
      }

      // Restore blend state
      if (this.stateSnapshot.blendEnabled) {
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFuncSeparate(
          this.stateSnapshot.blendSrcRGB,
          this.stateSnapshot.blendDstRGB,
          this.stateSnapshot.blendSrcAlpha,
          this.stateSnapshot.blendDstAlpha
        );
      } else {
        this.gl.disable(this.gl.BLEND);
      }

      // Restore depth test state
      if (this.stateSnapshot.depthTestEnabled) {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.stateSnapshot.depthFunc);
      } else {
        this.gl.disable(this.gl.DEPTH_TEST);
      }

      // Restore cull face state
      if (this.stateSnapshot.cullFaceEnabled) {
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.stateSnapshot.cullFaceMode);
        this.gl.frontFace(this.stateSnapshot.frontFace);
      } else {
        this.gl.disable(this.gl.CULL_FACE);
      }

      // Restore scissor test state
      if (this.stateSnapshot.scissorTestEnabled) {
        this.gl.enable(this.gl.SCISSOR_TEST);
        const [x, y, width, height] = this.stateSnapshot.scissorBox;
        this.gl.scissor(x, y, width, height);
      } else {
        this.gl.disable(this.gl.SCISSOR_TEST);
      }

      // Restore active texture
      if (this.stateSnapshot.activeTexture !== undefined) {
        this.gl.activeTexture(this.stateSnapshot.activeTexture);
      }

      this.logger.logError(
        'context_loss',
        'WebGL state successfully restored after context recovery',
        'low',
        { restoredAt: Date.now() }
      );

    } catch (error) {
      this.logger.logError(
        'context_loss',
        `Failed to restore comprehensive state: ${error}`,
        'medium',
        { error, availableState: Object.keys(this.stateSnapshot || {}) }
      );
    }
  }

  /**
   * Registers a callback for context recovery
   */
  onRecovery(callback: () => void): void {
    this.recoveryCallbacks.push(callback);
  }

  /**
   * Removes a recovery callback
   */
  removeRecoveryCallback(callback: () => void): void {
    const index = this.recoveryCallbacks.indexOf(callback);
    if (index > -1) {
      this.recoveryCallbacks.splice(index, 1);
    }
  }

  /**
   * Checks if context is currently lost
   */
  isContextCurrentlyLost(): boolean {
    return this.isContextLost || (this.gl?.isContextLost() ?? true);
  }

  /**
   * Forces context loss for testing
   */
  forceContextLoss(): boolean {
    if (!this.gl) return false;

    const loseContext = this.gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
      return true;
    }
    return false;
  }

  /**
   * Forces context restoration for testing
   */
  forceContextRestore(): boolean {
    if (!this.gl) return false;

    const loseContext = this.gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.restoreContext();
      return true;
    }
    return false;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', this.handleContextLost.bind(this));
      this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored.bind(this));
    }
    
    this.canvas = null;
    this.gl = null;
    this.recoveryCallbacks = [];
    this.stateSnapshot = null;
  }
}

/**
 * Graceful degradation manager for unsupported devices
 */
export class GracefulDegradationManager {
  private logger: ShaderErrorLogger;
  private currentFallbackLevel: FallbackState['level'] = 'none';
  private fallbackHistory: FallbackState[] = [];

  constructor(logger: ShaderErrorLogger) {
    this.logger = logger;
  }

  /**
   * Determines appropriate fallback level with enhanced device analysis
   */
  determineFallbackLevel(
    capabilities: WebGLCapabilities,
    errorHistory: ShaderError[]
  ): FallbackState['level'] {
    // Critical errors force complete disable
    const criticalErrors = errorHistory.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      return 'disabled';
    }

    // No WebGL support
    if (!capabilities.supported) {
      return 'disabled';
    }

    // Enhanced device capability analysis
    const deviceScore = this.calculateDeviceCapabilityScore(capabilities);
    const errorScore = this.calculateErrorScore(errorHistory);
    const combinedScore = deviceScore - errorScore;

    this.logger.logError(
      'performance',
      `Device capability analysis: device=${deviceScore.toFixed(2)}, errors=${errorScore.toFixed(2)}, combined=${combinedScore.toFixed(2)}`,
      'low'
    );

    // Determine fallback level based on combined score
    if (combinedScore < 0.2) {
      return 'disabled';
    } else if (combinedScore < 0.4) {
      return 'minimal';
    } else if (combinedScore < 0.7) {
      return 'reduced';
    } else {
      return 'none';
    }
  }

  /**
   * Calculates a device capability score (0.0 to 1.0)
   */
  private calculateDeviceCapabilityScore(capabilities: WebGLCapabilities): number {
    let score = 0.0;

    // WebGL version score (0.0 to 0.3)
    if (capabilities.version >= 2) {
      score += 0.3;
    } else if (capabilities.version >= 1) {
      score += 0.2;
    }

    // Texture size score (0.0 to 0.2)
    if (capabilities.maxTextureSize >= 4096) {
      score += 0.2;
    } else if (capabilities.maxTextureSize >= 2048) {
      score += 0.15;
    } else if (capabilities.maxTextureSize >= 1024) {
      score += 0.1;
    } else if (capabilities.maxTextureSize >= 512) {
      score += 0.05;
    }

    // Fragment uniform score (0.0 to 0.2)
    if (capabilities.maxFragmentUniforms >= 64) {
      score += 0.2;
    } else if (capabilities.maxFragmentUniforms >= 32) {
      score += 0.15;
    } else if (capabilities.maxFragmentUniforms >= 16) {
      score += 0.1;
    } else if (capabilities.maxFragmentUniforms >= 8) {
      score += 0.05;
    }

    // Vertex attributes score (0.0 to 0.1)
    if (capabilities.maxVertexAttribs >= 16) {
      score += 0.1;
    } else if (capabilities.maxVertexAttribs >= 8) {
      score += 0.05;
    }

    // Extension support score (0.0 to 0.1)
    const importantExtensions = [
      'OES_texture_float',
      'OES_texture_half_float',
      'WEBGL_depth_texture',
      'OES_standard_derivatives',
    ];
    const supportedImportantExtensions = importantExtensions.filter(ext => 
      capabilities.extensions.includes(ext)
    );
    score += (supportedImportantExtensions.length / importantExtensions.length) * 0.1;

    // Hardware detection score (0.0 to 0.1)
    const renderer = capabilities.renderer.toLowerCase();
    if (renderer.includes('nvidia') || renderer.includes('amd') || renderer.includes('radeon')) {
      score += 0.1; // Dedicated GPU
    } else if (renderer.includes('intel')) {
      score += 0.05; // Integrated GPU
    }

    return Math.min(1.0, score);
  }

  /**
   * Calculates an error impact score (0.0 to 1.0, higher is worse)
   */
  private calculateErrorScore(errorHistory: ShaderError[]): number {
    if (errorHistory.length === 0) return 0.0;

    let score = 0.0;
    const now = Date.now();

    // Recent high-severity errors (0.0 to 0.4)
    const recentHighErrors = errorHistory.filter(e => 
      now - e.timestamp < 60000 && e.severity === 'high'
    );
    score += Math.min(0.4, recentHighErrors.length * 0.1);

    // Recent medium-severity errors (0.0 to 0.3)
    const recentMediumErrors = errorHistory.filter(e => 
      now - e.timestamp < 120000 && e.severity === 'medium'
    );
    score += Math.min(0.3, recentMediumErrors.length * 0.05);

    // Error frequency score (0.0 to 0.2)
    const recentErrors = errorHistory.filter(e => now - e.timestamp < 300000); // 5 minutes
    const errorRate = recentErrors.length / 300; // Errors per second
    score += Math.min(0.2, errorRate * 100); // Scale to reasonable range

    // Error diversity score (0.0 to 0.1)
    const uniqueErrorTypes = new Set(errorHistory.map(e => e.type)).size;
    score += Math.min(0.1, uniqueErrorTypes * 0.02);

    return Math.min(1.0, score);
  }

  /**
   * Applies fallback configuration
   */
  applyFallback(level: FallbackState['level'], reason: string): FallbackState {
    const previousLevel = this.currentFallbackLevel;
    this.currentFallbackLevel = level;

    const fallbackState: FallbackState = {
      level,
      reason,
      timestamp: Date.now(),
      previousLevel,
    };

    this.fallbackHistory.push(fallbackState);

    // Limit history size
    if (this.fallbackHistory.length > 20) {
      this.fallbackHistory.shift();
    }

    this.logger.logError(
      'performance',
      `Applied fallback level: ${level} (${reason})`,
      level === 'disabled' ? 'high' : 'medium',
      { fallbackState }
    );

    return fallbackState;
  }

  /**
   * Gets fallback configuration for current level
   */
  getFallbackConfig(): {
    particleCount: number;
    animationSpeed: number;
    interactionEnabled: boolean;
    renderScale: number;
    complexEffects: boolean;
    useSimpleShader: boolean;
  } {
    switch (this.currentFallbackLevel) {
      case 'disabled':
        return {
          particleCount: 0,
          animationSpeed: 0,
          interactionEnabled: false,
          renderScale: 0,
          complexEffects: false,
          useSimpleShader: false,
        };

      case 'minimal':
        return {
          particleCount: 10,
          animationSpeed: 0.3,
          interactionEnabled: false,
          renderScale: 0.5,
          complexEffects: false,
          useSimpleShader: true,
        };

      case 'reduced':
        return {
          particleCount: 30,
          animationSpeed: 0.6,
          interactionEnabled: false,
          renderScale: 0.7,
          complexEffects: false,
          useSimpleShader: false,
        };

      case 'none':
      default:
        return {
          particleCount: 100,
          animationSpeed: 1.0,
          interactionEnabled: true,
          renderScale: 1.0,
          complexEffects: true,
          useSimpleShader: false,
        };
    }
  }

  /**
   * Checks if fallback can be reduced (improved)
   */
  canReduceFallback(): boolean {
    const recentErrors = this.fallbackHistory.filter(f => 
      Date.now() - f.timestamp < 300000 // 5 minutes
    );

    // Don't improve if recent fallbacks were applied
    return recentErrors.length === 0 && this.currentFallbackLevel !== 'none';
  }

  /**
   * Gets current fallback level
   */
  getCurrentLevel(): FallbackState['level'] {
    return this.currentFallbackLevel;
  }

  /**
   * Gets fallback history
   */
  getFallbackHistory(): FallbackState[] {
    return [...this.fallbackHistory];
  }

  /**
   * Resets fallback to no degradation
   */
  reset(): void {
    this.currentFallbackLevel = 'none';
    this.fallbackHistory = [];
  }
}

/**
 * Performance monitoring for dynamic quality adjustment
 */
export class PerformanceMonitor {
  private frameRates: number[] = [];
  private lastFrameTime = 0;
  private frameCount = 0;
  private performanceCallbacks: Array<(fps: number, memoryUsage?: number) => void> = [];
  private monitoringInterval: number | null = null;
  private isMonitoring = false;

  /**
   * Starts performance monitoring
   */
  startMonitoring(intervalMs = 1000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    
    this.monitoringInterval = window.setInterval(() => {
      this.updatePerformanceMetrics();
    }, intervalMs);
  }

  /**
   * Stops performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Records a frame for FPS calculation
   */
  recordFrame(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      this.frameRates.push(fps);
      
      // Keep only recent frame rates (last 60 frames)
      if (this.frameRates.length > 60) {
        this.frameRates.shift();
      }
      
      this.frameCount++;
    }
    
    this.lastFrameTime = currentTime;
  }

  /**
   * Updates performance metrics and calls callbacks
   */
  private updatePerformanceMetrics(): void {
    const fps = this.getAverageFPS();
    const memoryUsage = this.getMemoryUsage();
    
    this.performanceCallbacks.forEach(callback => {
      try {
        callback(fps, memoryUsage);
      } catch (error) {
        console.warn('Performance callback error:', error);
      }
    });
  }

  /**
   * Gets average FPS from recent frames
   */
  getAverageFPS(): number {
    if (this.frameRates.length === 0) return 0;
    
    const sum = this.frameRates.reduce((a, b) => a + b, 0);
    return sum / this.frameRates.length;
  }

  /**
   * Gets current memory usage if available
   */
  getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return undefined;
  }

  /**
   * Checks if performance is degraded below threshold
   */
  isPerformanceDegraded(targetFPS: number): boolean {
    const avgFPS = this.getAverageFPS();
    return avgFPS > 0 && avgFPS < targetFPS * 0.8; // 20% tolerance
  }

  /**
   * Registers a performance update callback
   */
  onPerformanceUpdate(callback: (fps: number, memoryUsage?: number) => void): void {
    this.performanceCallbacks.push(callback);
  }

  /**
   * Removes a performance update callback
   */
  removePerformanceCallback(callback: (fps: number, memoryUsage?: number) => void): void {
    const index = this.performanceCallbacks.indexOf(callback);
    if (index > -1) {
      this.performanceCallbacks.splice(index, 1);
    }
  }

  /**
   * Gets performance statistics
   */
  getPerformanceStats(): {
    fps: number;
    frameCount: number;
    memoryUsage?: number;
    isMonitoring: boolean;
  } {
    return {
      fps: this.getAverageFPS(),
      frameCount: this.frameCount,
      memoryUsage: this.getMemoryUsage(),
      isMonitoring: this.isMonitoring,
    };
  }

  /**
   * Resets performance statistics
   */
  reset(): void {
    this.frameRates = [];
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopMonitoring();
    this.performanceCallbacks = [];
    this.reset();
  }
}

/**
 * Advanced error recovery scenarios
 */
export class ErrorRecoveryScenarios {
  private logger: ShaderErrorLogger;
  private performanceMonitor: PerformanceMonitor;
  private recoveryAttempts: Map<string, number> = new Map();
  private maxRecoveryAttempts = 3;
  private circuitBreakerState: Map<string, { isOpen: boolean; lastFailure: number; failureCount: number }> = new Map();
  private circuitBreakerTimeout = 30000; // 30 seconds
  private circuitBreakerThreshold = 5; // failures before opening circuit

  constructor(logger: ShaderErrorLogger, performanceMonitor: PerformanceMonitor) {
    this.logger = logger;
    this.performanceMonitor = performanceMonitor;
  }

  /**
   * Handles shader compilation failure with progressive fallback
   */
  async handleShaderCompilationFailure(
    gl: WebGLRenderingContext,
    primaryShader: string,
    fallbackShaders: string[],
    shaderType: number
  ): Promise<{ shader: WebGLShader | null; level: string }> {
    const scenarioKey = 'shader_compilation';
    const attempts = this.recoveryAttempts.get(scenarioKey) || 0;

    if (attempts >= this.maxRecoveryAttempts) {
      this.logger.logError(
        'compilation',
        'Maximum shader compilation recovery attempts exceeded',
        'critical'
      );
      return { shader: null, level: 'failed' };
    }

    this.recoveryAttempts.set(scenarioKey, attempts + 1);

    // Try fallback shaders in order
    for (let i = 0; i < fallbackShaders.length; i++) {
      try {
        const shader = gl.createShader(shaderType);
        if (!shader) continue;

        gl.shaderSource(shader, fallbackShaders[i]);
        gl.compileShader(shader);

        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          this.logger.logError(
            'compilation',
            `Shader compilation recovered using fallback level ${i + 1}`,
            'low'
          );
          
          // Reset recovery attempts on success
          this.recoveryAttempts.delete(scenarioKey);
          return { shader, level: `fallback_${i + 1}` };
        }

        gl.deleteShader(shader);
      } catch (error) {
        this.logger.logError(
          'compilation',
          `Fallback shader ${i + 1} compilation failed: ${error}`,
          'medium'
        );
      }
    }

    return { shader: null, level: 'failed' };
  }

  /**
   * Handles memory pressure with progressive quality reduction
   */
  handleMemoryPressure(currentConfig: any): any {
    const memoryUsage = this.performanceMonitor.getMemoryUsage();
    
    if (memoryUsage === undefined || memoryUsage < 0.7) {
      return currentConfig; // No action needed
    }

    this.logger.logError(
      'memory',
      `High memory usage detected: ${(memoryUsage * 100).toFixed(1)}%`,
      memoryUsage > 0.9 ? 'high' : 'medium'
    );

    // Progressive quality reduction based on memory pressure
    const reductionFactor = Math.min(0.5, (memoryUsage - 0.7) / 0.3);
    
    return {
      ...currentConfig,
      particleCount: Math.floor(currentConfig.particleCount * (1 - reductionFactor)),
      renderScale: Math.max(0.5, currentConfig.renderScale * (1 - reductionFactor * 0.5)),
      complexEffects: memoryUsage < 0.85,
      animationSpeed: Math.max(0.3, currentConfig.animationSpeed * (1 - reductionFactor * 0.3)),
    };
  }

  /**
   * Handles performance degradation with adaptive quality
   */
  handlePerformanceDegradation(currentConfig: any, targetFPS = 30): any {
    const avgFPS = this.performanceMonitor.getAverageFPS();
    
    if (avgFPS >= targetFPS) {
      return currentConfig; // Performance is acceptable
    }

    const performanceRatio = avgFPS / targetFPS;
    const scenarioKey = 'performance_degradation';
    const attempts = this.recoveryAttempts.get(scenarioKey) || 0;

    this.logger.logError(
      'performance',
      `Performance degradation detected: ${avgFPS.toFixed(1)} FPS (target: ${targetFPS})`,
      avgFPS < targetFPS * 0.5 ? 'high' : 'medium'
    );

    this.recoveryAttempts.set(scenarioKey, attempts + 1);

    // Adaptive quality reduction based on performance ratio
    const qualityReduction = Math.max(0.1, 1 - performanceRatio);
    
    return {
      ...currentConfig,
      particleCount: Math.floor(currentConfig.particleCount * performanceRatio),
      renderScale: Math.max(0.3, currentConfig.renderScale * (0.7 + performanceRatio * 0.3)),
      animationSpeed: Math.max(0.2, currentConfig.animationSpeed * (0.5 + performanceRatio * 0.5)),
      interactionEnabled: avgFPS > targetFPS * 0.7 ? currentConfig.interactionEnabled : false,
      complexEffects: avgFPS > targetFPS * 0.8,
    };
  }

  /**
   * Handles cascading failures with circuit breaker pattern
   */
  handleCascadingFailures(errorTypes: string[]): { shouldDisable: boolean; reason: string } {
    const recentErrors = this.logger.getRecentErrors(undefined, 300000); // 5 minutes
    const criticalErrors = recentErrors.filter(e => e.severity === 'critical');
    const highErrors = recentErrors.filter(e => e.severity === 'high');

    // Circuit breaker: too many critical errors
    if (criticalErrors.length >= 2) {
      return {
        shouldDisable: true,
        reason: 'Multiple critical errors detected - circuit breaker activated',
      };
    }

    // High error rate across multiple systems
    const errorsByType = errorTypes.reduce((acc, type) => {
      acc[type] = recentErrors.filter(e => e.type === type).length;
      return acc;
    }, {} as { [key: string]: number });

    const totalHighSeverityErrors = Object.values(errorsByType).reduce((sum, count) => sum + count, 0);
    
    if (totalHighSeverityErrors >= 8) {
      return {
        shouldDisable: true,
        reason: `High error rate detected across systems: ${JSON.stringify(errorsByType)}`,
      };
    }

    // Check for error rate escalation
    const errorRateIncreasing = this.isErrorRateIncreasing(recentErrors);
    if (errorRateIncreasing && highErrors.length >= 5) {
      return {
        shouldDisable: true,
        reason: 'Escalating error rate detected - preventing system instability',
      };
    }

    return { shouldDisable: false, reason: 'Error levels within acceptable thresholds' };
  }

  /**
   * Handles intermittent errors with exponential backoff
   */
  async handleIntermittentErrors(
    errorKey: string,
    retryFunction: () => Promise<boolean>,
    maxRetries = 3
  ): Promise<boolean> {
    const attempts = this.recoveryAttempts.get(errorKey) || 0;
    
    if (attempts >= maxRetries) {
      this.logger.logError(
        'unknown',
        `Maximum retry attempts exceeded for ${errorKey}`,
        'high'
      );
      return false;
    }

    try {
      const success = await retryFunction();
      
      if (success) {
        // Reset attempts on success
        this.recoveryAttempts.delete(errorKey);
        this.logger.logError(
          'unknown',
          `Recovery successful for ${errorKey} after ${attempts + 1} attempts`,
          'low'
        );
        return true;
      }

      // Increment attempts and apply exponential backoff
      this.recoveryAttempts.set(errorKey, attempts + 1);
      const backoffDelay = Math.min(1000 * Math.pow(2, attempts), 10000); // Max 10 seconds
      
      this.logger.logError(
        'unknown',
        `Retry ${attempts + 1} failed for ${errorKey}, backing off ${backoffDelay}ms`,
        'medium'
      );

      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      return this.handleIntermittentErrors(errorKey, retryFunction, maxRetries);

    } catch (error) {
      this.recoveryAttempts.set(errorKey, attempts + 1);
      this.logger.logError(
        'unknown',
        `Exception during retry for ${errorKey}: ${error}`,
        'high'
      );
      return false;
    }
  }

  /**
   * Checks if error rate is increasing over time
   */
  private isErrorRateIncreasing(recentErrors: ShaderError[]): boolean {
    if (recentErrors.length < 4) return false;

    const now = Date.now();
    const timeWindows = [60000, 120000, 180000]; // 1, 2, 3 minutes
    
    const errorCounts = timeWindows.map(window => 
      recentErrors.filter(e => now - e.timestamp < window).length
    );

    // Check if error count is increasing in each successive time window
    return errorCounts[0] > errorCounts[1] * 0.5 && errorCounts[1] > errorCounts[2] * 0.5;
  }

  /**
   * Gets recovery attempt statistics
   */
  getRecoveryStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.recoveryAttempts.forEach((attempts, key) => {
      stats[key] = attempts;
    });
    return stats;
  }

  /**
   * Resets recovery attempts for a specific scenario
   */
  resetRecoveryAttempts(scenarioKey?: string): void {
    if (scenarioKey) {
      this.recoveryAttempts.delete(scenarioKey);
    } else {
      this.recoveryAttempts.clear();
    }
  }
}

/**
 * Main shader error handler that coordinates all error handling components
 */
export class ShaderErrorHandler {
  private logger: ShaderErrorLogger;
  private capabilityDetector: WebGLCapabilityDetector;
  private compiler: ShaderCompiler;
  private contextRecovery: ContextLossRecoveryManager;
  private degradationManager: GracefulDegradationManager;
  private performanceMonitor: PerformanceMonitor;
  private recoveryScenarios: ErrorRecoveryScenarios;
  private options: RecoveryOptions;

  constructor(options: Partial<RecoveryOptions> = {}) {
    this.options = { ...DEFAULT_RECOVERY_OPTIONS, ...options };
    
    // Initialize all components
    this.logger = new ShaderErrorLogger(this.options.enableLogging);
    this.capabilityDetector = new WebGLCapabilityDetector();
    this.compiler = new ShaderCompiler(this.logger);
    this.contextRecovery = new ContextLossRecoveryManager(this.logger);
    this.degradationManager = new GracefulDegradationManager(this.logger);
    this.performanceMonitor = new PerformanceMonitor();
    this.recoveryScenarios = new ErrorRecoveryScenarios(this.logger, this.performanceMonitor);

    // Set up callbacks
    if (this.options.onError) {
      this.setupErrorCallback(this.options.onError);
    }
    if (this.options.onRecovery) {
      this.setupRecoveryCallback(this.options.onRecovery);
    }
    if (this.options.onFallback) {
      this.setupFallbackCallback(this.options.onFallback);
    }
  }

  /**
   * Initializes error handling for a WebGL context
   */
  initialize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): void {
    this.contextRecovery.initialize(canvas, gl);
    
    // Set up context recovery callback
    this.contextRecovery.onRecovery(() => {
      if (this.options.onRecovery) {
        this.options.onRecovery(true);
      }
    });
  }

  /**
   * Starts performance monitoring
   */
  startMonitoring(): void {
    this.performanceMonitor.startMonitoring();
  }

  /**
   * Records a frame for performance monitoring
   */
  recordFrame(): void {
    this.performanceMonitor.recordFrame();
  }

  /**
   * Checks current system state and applies appropriate fallbacks
   */
  checkAndApplyFallbacks(): FallbackState {
    const capabilities = this.capabilityDetector.detectCapabilities();
    const recentErrors = this.logger.getRecentErrors(undefined, 300000); // 5 minutes
    
    const fallbackLevel = this.degradationManager.determineFallbackLevel(capabilities, recentErrors);
    const reason = this.determineFallbackReason(capabilities, recentErrors, fallbackLevel);
    
    return this.degradationManager.applyFallback(fallbackLevel, reason);
  }

  /**
   * Checks for cascading failures that require immediate shutdown
   */
  checkCascadingFailures(): { shouldDisable: boolean; reason: string } {
    return this.recoveryScenarios.handleCascadingFailures([
      'compilation', 'context_loss', 'webgl_unavailable', 'performance', 'memory'
    ]);
  }

  /**
   * Gets comprehensive error statistics
   */
  getErrorStatistics(): {
    errorStats: { [key: string]: number };
    recoveryStats: { [key: string]: number };
    performanceStats: { fps: number; memoryUsage?: number };
    fallbackHistory: FallbackState[];
  } {
    return {
      errorStats: this.logger.getErrorStats(),
      recoveryStats: this.recoveryScenarios.getRecoveryStats(),
      performanceStats: {
        fps: this.performanceMonitor.getAverageFPS(),
        memoryUsage: this.performanceMonitor.getMemoryUsage(),
      },
      fallbackHistory: this.degradationManager.getFallbackHistory(),
    };
  }

  /**
   * Gets access to individual error handling components
   */
  getComponents() {
    return {
      logger: this.logger,
      capabilityDetector: this.capabilityDetector,
      compiler: this.compiler,
      contextRecovery: this.contextRecovery,
      degradationManager: this.degradationManager,
      performanceMonitor: this.performanceMonitor,
      recoveryScenarios: this.recoveryScenarios,
    };
  }

  /**
   * Cleanup all resources
   */
  cleanup(): void {
    this.performanceMonitor.cleanup();
    this.contextRecovery.cleanup();
    this.capabilityDetector.cleanup();
    this.logger.clearErrors();
    this.recoveryScenarios.resetRecoveryAttempts();
  }

  /**
   * Sets up error callback handling
   */
  private setupErrorCallback(callback: (error: ShaderError) => void): void {
    // This would be called by the logger when errors occur
    // Implementation depends on how the logger is integrated
  }

  /**
   * Sets up recovery callback handling
   */
  private setupRecoveryCallback(callback: (success: boolean) => void): void {
    this.performanceMonitor.onPerformanceUpdate((fps) => {
      const wasPerformancePoor = fps < 30;
      const isPerformanceGood = fps >= 45;
      
      if (wasPerformancePoor && isPerformanceGood) {
        callback(true); // Recovery detected
      }
    });
  }

  /**
   * Sets up fallback callback handling
   */
  private setupFallbackCallback(callback: (state: FallbackState) => void): void {
    // This would be called when fallbacks are applied
    // Implementation depends on integration needs
  }

  /**
   * Determines the reason for applying a specific fallback level
   */
  private determineFallbackReason(
    capabilities: WebGLCapabilities,
    errors: ShaderError[],
    level: FallbackState['level']
  ): string {
    if (!capabilities.supported) {
      return 'WebGL not supported on this device';
    }

    const criticalErrors = errors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      return `Critical errors detected: ${criticalErrors.map(e => e.type).join(', ')}`;
    }

    const highErrors = errors.filter(e => e.severity === 'high');
    if (highErrors.length >= 3) {
      return `High error rate: ${highErrors.length} high-severity errors in recent history`;
    }

    if (capabilities.maxTextureSize < 1024) {
      return `Limited hardware capabilities: max texture size ${capabilities.maxTextureSize}`;
    }

    if (level === 'reduced') {
      return 'Preventive quality reduction based on error history and device capabilities';
    }

    return 'Applied as precautionary measure';
  }

  /**
   * Handles cascading failures with circuit breaker pattern
   */
  handleCascadingFailures(errorTypes: string[]): { shouldDisable: boolean; reason: string } {
    const recentErrors = this.logger.getRecentErrors(undefined, 30000); // Last 30 seconds
    const criticalErrors = recentErrors.filter(e => e.severity === 'critical');
    const highErrors = recentErrors.filter(e => e.severity === 'high');

    // Circuit breaker conditions
    if (criticalErrors.length >= 2) {
      return {
        shouldDisable: true,
        reason: 'Multiple critical errors detected - circuit breaker activated',
      };
    }

    if (highErrors.length >= 5) {
      return {
        shouldDisable: true,
        reason: 'High error rate detected - circuit breaker activated',
      };
    }

    if (errorTypes.length >= 3 && recentErrors.length >= 8) {
      return {
        shouldDisable: true,
        reason: 'Multiple error types with high frequency - circuit breaker activated',
      };
    }

    return { shouldDisable: false, reason: '' };
  }

  /**
   * Handles intermittent errors with exponential backoff
   */
  async handleIntermittentErrors(errorType: string, retryFunction: () => Promise<boolean>): Promise<boolean> {
    const scenarioKey = `intermittent_${errorType}`;
    const attempts = this.recoveryAttempts.get(scenarioKey) || 0;

    if (attempts >= this.maxRecoveryAttempts) {
      this.logger.logError(
        errorType as any,
        `Maximum intermittent error recovery attempts exceeded for ${errorType}`,
        'high'
      );
      return false;
    }

    // Exponential backoff: 100ms, 200ms, 400ms
    const backoffDelay = Math.pow(2, attempts) * 100;
    
    this.logger.logError(
      errorType as any,
      `Attempting recovery for intermittent ${errorType} error (attempt ${attempts + 1})`,
      'medium'
    );

    await new Promise(resolve => setTimeout(resolve, backoffDelay));

    try {
      const success = await retryFunction();
      
      if (success) {
        this.recoveryAttempts.delete(scenarioKey);
        this.logger.logError(
          errorType as any,
          `Successfully recovered from intermittent ${errorType} error`,
          'low'
        );
        return true;
      } else {
        this.recoveryAttempts.set(scenarioKey, attempts + 1);
        return false;
      }
    } catch (error) {
      this.recoveryAttempts.set(scenarioKey, attempts + 1);
      this.logger.logError(
        errorType as any,
        `Recovery attempt failed for ${errorType}: ${error}`,
        'medium'
      );
      return false;
    }
  }

  /**
   * Circuit breaker pattern for preventing cascading failures
   */
  private checkCircuitBreaker(scenarioKey: string): boolean {
    const circuit = this.circuitBreakerState.get(scenarioKey);
    
    if (!circuit) {
      this.circuitBreakerState.set(scenarioKey, {
        isOpen: false,
        lastFailure: 0,
        failureCount: 0,
      });
      return false; // Circuit is closed (allow operation)
    }

    // Check if circuit should be reset (timeout expired)
    if (circuit.isOpen && Date.now() - circuit.lastFailure > this.circuitBreakerTimeout) {
      circuit.isOpen = false;
      circuit.failureCount = 0;
      this.logger.logError(
        'performance',
        `Circuit breaker reset for scenario: ${scenarioKey}`,
        'low'
      );
    }

    return circuit.isOpen;
  }

  /**
   * Records a failure for circuit breaker tracking
   */
  private recordCircuitBreakerFailure(scenarioKey: string): void {
    const circuit = this.circuitBreakerState.get(scenarioKey) || {
      isOpen: false,
      lastFailure: 0,
      failureCount: 0,
    };

    circuit.failureCount++;
    circuit.lastFailure = Date.now();

    if (circuit.failureCount >= this.circuitBreakerThreshold) {
      circuit.isOpen = true;
      this.logger.logError(
        'performance',
        `Circuit breaker opened for scenario: ${scenarioKey} after ${circuit.failureCount} failures`,
        'high'
      );
    }

    this.circuitBreakerState.set(scenarioKey, circuit);
  }

  /**
   * Records a success for circuit breaker tracking
   */
  private recordCircuitBreakerSuccess(scenarioKey: string): void {
    const circuit = this.circuitBreakerState.get(scenarioKey);
    if (circuit) {
      circuit.failureCount = Math.max(0, circuit.failureCount - 1);
      this.circuitBreakerState.set(scenarioKey, circuit);
    }
  }

  /**
   * Enhanced shader compilation failure handling with circuit breaker
   */
  async handleShaderCompilationFailureWithCircuitBreaker(
    gl: WebGLRenderingContext,
    primaryShader: string,
    fallbackShaders: string[],
    shaderType: number
  ): Promise<{ shader: WebGLShader | null; level: string; circuitOpen: boolean }> {
    const scenarioKey = 'shader_compilation';
    
    // Check circuit breaker
    if (this.checkCircuitBreaker(scenarioKey)) {
      this.logger.logError(
        'compilation',
        'Shader compilation blocked by circuit breaker',
        'high'
      );
      return { shader: null, level: 'circuit_breaker_open', circuitOpen: true };
    }

    try {
      const result = await this.handleShaderCompilationFailure(
        gl,
        primaryShader,
        fallbackShaders,
        shaderType
      );

      if (result.shader) {
        this.recordCircuitBreakerSuccess(scenarioKey);
      } else {
        this.recordCircuitBreakerFailure(scenarioKey);
      }

      return { ...result, circuitOpen: false };
    } catch (error) {
      this.recordCircuitBreakerFailure(scenarioKey);
      this.logger.logError(
        'compilation',
        `Shader compilation failed with exception: ${error}`,
        'critical'
      );
      return { shader: null, level: 'failed', circuitOpen: false };
    }
  }

  /**
   * Enhanced memory pressure handling with predictive scaling
   */
  handleMemoryPressureWithPrediction(currentConfig: any): any {
    const memoryUsage = this.performanceMonitor.getMemoryUsage();
    
    if (memoryUsage === undefined) {
      return currentConfig; // No memory info available
    }

    // Predictive scaling based on memory trend
    const memoryTrend = this.calculateMemoryTrend();
    const predictedMemoryUsage = memoryUsage + memoryTrend * 0.1; // Predict 100ms ahead

    this.logger.logError(
      'memory',
      `Memory usage: ${(memoryUsage * 100).toFixed(1)}%, predicted: ${(predictedMemoryUsage * 100).toFixed(1)}%`,
      memoryUsage > 0.8 ? 'high' : 'medium'
    );

    // Use predicted memory usage for more proactive scaling
    const effectiveMemoryUsage = Math.max(memoryUsage, predictedMemoryUsage);

    if (effectiveMemoryUsage < 0.6) {
      return currentConfig; // Memory usage is acceptable
    }

    // Progressive quality reduction based on memory pressure
    const memoryPressure = (effectiveMemoryUsage - 0.6) / 0.4; // 0.0 to 1.0 scale
    const reductionFactor = Math.min(0.7, memoryPressure);
    
    return {
      ...currentConfig,
      particleCount: Math.floor(currentConfig.particleCount * (1 - reductionFactor)),
      renderScale: Math.max(0.3, currentConfig.renderScale * (1 - reductionFactor * 0.5)),
      complexEffects: effectiveMemoryUsage < 0.8,
      animationSpeed: Math.max(0.2, currentConfig.animationSpeed * (1 - reductionFactor * 0.3)),
      interactionEnabled: effectiveMemoryUsage < 0.75 ? currentConfig.interactionEnabled : false,
    };
  }

  /**
   * Calculates memory usage trend for predictive scaling
   */
  private calculateMemoryTrend(): number {
    // This would ideally track memory usage over time
    // For now, return a simple heuristic based on current usage
    const memoryUsage = this.performanceMonitor.getMemoryUsage();
    if (memoryUsage === undefined) return 0;

    // Simple trend calculation - in a real implementation, 
    // this would track memory usage over multiple samples
    return memoryUsage > 0.7 ? 0.01 : -0.005; // Trending up if high usage
  }

  /**
   * Enhanced performance degradation handling with adaptive thresholds
   */
  handlePerformanceDegradationWithAdaptiveThresholds(
    currentConfig: any, 
    targetFPS = 30
  ): any {
    const avgFPS = this.performanceMonitor.getAverageFPS();
    
    if (avgFPS >= targetFPS) {
      return currentConfig; // Performance is acceptable
    }

    // Adaptive threshold based on device capabilities
    const adaptiveTargetFPS = this.calculateAdaptiveTargetFPS(targetFPS);
    const performanceRatio = avgFPS / adaptiveTargetFPS;
    
    this.logger.logError(
      'performance',
      `Performance degradation: ${avgFPS.toFixed(1)} FPS (adaptive target: ${adaptiveTargetFPS.toFixed(1)})`,
      avgFPS < adaptiveTargetFPS * 0.5 ? 'high' : 'medium'
    );

    // More aggressive quality reduction for severe performance issues
    const severityMultiplier = avgFPS < adaptiveTargetFPS * 0.5 ? 1.5 : 1.0;
    const qualityReduction = Math.min(0.8, (1 - performanceRatio) * severityMultiplier);
    
    return {
      ...currentConfig,
      particleCount: Math.floor(currentConfig.particleCount * (1 - qualityReduction)),
      renderScale: Math.max(0.2, currentConfig.renderScale * (1 - qualityReduction * 0.6)),
      animationSpeed: Math.max(0.1, currentConfig.animationSpeed * (1 - qualityReduction * 0.4)),
      interactionEnabled: avgFPS > adaptiveTargetFPS * 0.6 ? currentConfig.interactionEnabled : false,
      complexEffects: avgFPS > adaptiveTargetFPS * 0.7,
    };
  }

  /**
   * Calculates adaptive target FPS based on device capabilities
   */
  private calculateAdaptiveTargetFPS(baseFPS: number): number {
    // Adjust target FPS based on device characteristics
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Lower target FPS for less capable devices
    let adaptiveFPS = baseFPS;
    
    if (hardwareConcurrency <= 2) {
      adaptiveFPS *= 0.7; // Reduce target for low-core devices
    }
    
    if (devicePixelRatio > 2) {
      adaptiveFPS *= 0.8; // Reduce target for high-DPI displays
    }
    
    return Math.max(15, adaptiveFPS); // Minimum 15 FPS target
  }

  /**
   * Enhanced cascading failure detection with pattern analysis
   */
  handleCascadingFailuresWithPatternAnalysis(errorTypes: string[]): { 
    shouldDisable: boolean; 
    reason: string; 
    pattern: string;
    confidence: number;
  } {
    const recentErrors = this.logger.getRecentErrors(undefined, 60000); // Last minute
    
    // Analyze error patterns
    const errorPattern = this.analyzeErrorPattern(recentErrors);
    const confidence = this.calculatePatternConfidence(errorPattern, recentErrors);
    
    // Check for critical error types
    const criticalTypes = ['webgl_unavailable', 'compilation'];
    const hasCriticalErrors = errorTypes.some(type => criticalTypes.includes(type));
    
    // Check error rate
    const errorRate = recentErrors.length / 60; // Errors per second
    const highErrorRate = errorRate > 0.5;
    
    // Check for error diversity (many different error types)
    const uniqueErrorTypes = new Set(recentErrors.map(e => e.type)).size;
    const highErrorDiversity = uniqueErrorTypes >= 4;
    
    if (hasCriticalErrors) {
      return {
        shouldDisable: true,
        reason: 'Critical errors detected - circuit breaker activated',
        pattern: errorPattern,
        confidence,
      };
    }
    
    if (highErrorRate && highErrorDiversity) {
      return {
        shouldDisable: true,
        reason: `High error rate (${errorRate.toFixed(2)}/s) with diverse error types`,
        pattern: errorPattern,
        confidence,
      };
    }
    
    if (confidence > 0.8 && errorPattern.includes('escalating')) {
      return {
        shouldDisable: true,
        reason: 'Escalating error pattern detected with high confidence',
        pattern: errorPattern,
        confidence,
      };
    }
    
    return {
      shouldDisable: false,
      reason: 'Error levels within acceptable thresholds',
      pattern: errorPattern,
      confidence,
    };
  }

  /**
   * Analyzes error patterns to detect trends
   */
  private analyzeErrorPattern(errors: ShaderError[]): string {
    if (errors.length === 0) return 'no_errors';
    
    // Sort errors by timestamp
    const sortedErrors = errors.sort((a, b) => a.timestamp - b.timestamp);
    
    // Check for escalating severity
    let escalating = true;
    let lastSeverityLevel = 0;
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    
    for (const error of sortedErrors) {
      const currentLevel = severityLevels[error.severity];
      if (currentLevel < lastSeverityLevel) {
        escalating = false;
        break;
      }
      lastSeverityLevel = currentLevel;
    }
    
    // Check for repeating patterns
    const errorTypeSequence = sortedErrors.map(e => e.type).join(',');
    const hasRepeatingPattern = this.detectRepeatingPattern(errorTypeSequence);
    
    // Check for burst patterns
    const timeGaps = [];
    for (let i = 1; i < sortedErrors.length; i++) {
      timeGaps.push(sortedErrors[i].timestamp - sortedErrors[i - 1].timestamp);
    }
    const avgGap = timeGaps.reduce((a, b) => a + b, 0) / timeGaps.length;
    const isBurst = avgGap < 1000; // Less than 1 second between errors
    
    let pattern = '';
    if (escalating) pattern += 'escalating,';
    if (hasRepeatingPattern) pattern += 'repeating,';
    if (isBurst) pattern += 'burst,';
    
    return pattern || 'random';
  }

  /**
   * Detects repeating patterns in error sequences
   */
  private detectRepeatingPattern(sequence: string): boolean {
    const parts = sequence.split(',');
    if (parts.length < 4) return false;
    
    // Look for repeating subsequences
    for (let len = 2; len <= parts.length / 2; len++) {
      const pattern = parts.slice(0, len).join(',');
      const repetitions = Math.floor(parts.length / len);
      
      let matches = 0;
      for (let i = 0; i < repetitions; i++) {
        const subsequence = parts.slice(i * len, (i + 1) * len).join(',');
        if (subsequence === pattern) matches++;
      }
      
      if (matches >= 2) return true; // Found at least 2 repetitions
    }
    
    return false;
  }

  /**
   * Calculates confidence level for pattern analysis
   */
  private calculatePatternConfidence(pattern: string, errors: ShaderError[]): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence with more data points
    confidence += Math.min(0.3, errors.length * 0.02);
    
    // Higher confidence for clear patterns
    if (pattern.includes('escalating')) confidence += 0.2;
    if (pattern.includes('repeating')) confidence += 0.15;
    if (pattern.includes('burst')) confidence += 0.1;
    
    // Lower confidence for random patterns
    if (pattern === 'random') confidence -= 0.2;
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  /**
   * Resets recovery attempts for a scenario
   */
  resetRecoveryAttempts(scenarioKey?: string): void {
    if (scenarioKey) {
      this.recoveryAttempts.delete(scenarioKey);
      this.circuitBreakerState.delete(scenarioKey);
    } else {
      this.recoveryAttempts.clear();
      this.circuitBreakerState.clear();
    }
  }

  /**
   * Gets recovery statistics including circuit breaker states
   */
  getRecoveryStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.recoveryAttempts.forEach((attempts, scenario) => {
      stats[scenario] = attempts;
    });
    
    // Add circuit breaker information
    this.circuitBreakerState.forEach((state, scenario) => {
      stats[`${scenario}_circuit_failures`] = state.failureCount;
      stats[`${scenario}_circuit_open`] = state.isOpen ? 1 : 0;
    });
    
    return stats;
  }
}

