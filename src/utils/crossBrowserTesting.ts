/**
 * Cross-Browser Testing Utilities for Enhanced Shader Background
 * 
 * This module provides comprehensive testing utilities for validating
 * shader performance and compatibility across different browsers and devices.
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
}

export interface PerformanceTestResult {
  browser: BrowserInfo;
  averageFrameRate: number;
  minFrameRate: number;
  maxFrameRate: number;
  frameDrops: number;
  memoryUsage: number;
  renderTime: number;
  loadTime: number;
  testDuration: number;
  passed: boolean;
  issues: string[];
}

export interface CompatibilityTestResult {
  browser: BrowserInfo;
  webglSupport: boolean;
  shaderCompilation: boolean;
  uniformSupport: boolean;
  extensionSupport: { [key: string]: boolean };
  contextCreation: boolean;
  textureSupport: boolean;
  passed: boolean;
  issues: string[];
}

/**
 * Browser Detection Utility
 */
export class BrowserDetector {
  /**
   * Detect current browser information
   */
  public static detectBrowser(): BrowserInfo {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    let name = 'Unknown';
    let version = 'Unknown';
    let engine = 'Unknown';
    
    // Chrome
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      name = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      engine = 'Blink';
    }
    // Edge
    else if (userAgent.includes('Edg')) {
      name = 'Edge';
      const match = userAgent.match(/Edg\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      engine = 'Blink';
    }
    // Firefox
    else if (userAgent.includes('Firefox')) {
      name = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      engine = 'Gecko';
    }
    // Safari
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      name = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      engine = 'WebKit';
    }
    // Opera
    else if (userAgent.includes('OPR')) {
      name = 'Opera';
      const match = userAgent.match(/OPR\/(\d+)/);
      version = match ? match[1] : 'Unknown';
      engine = 'Blink';
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    return {
      name,
      version,
      engine,
      platform,
      isMobile,
      supportsWebGL: this.checkWebGLSupport(),
      supportsWebGL2: this.checkWebGL2Support(),
    };
  }

  private static checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      canvas.remove();
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  private static checkWebGL2Support(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      canvas.remove();
      return !!gl;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Performance Testing Suite
 */
export class PerformanceTester {
  private frameRates: number[] = [];
  private startTime = 0;
  private testDuration = 0;
  private memoryStart = 0;
  private renderTimes: number[] = [];

  /**
   * Start performance test
   */
  public startTest(): void {
    this.frameRates = [];
    this.renderTimes = [];
    this.startTime = performance.now();
    
    if ('memory' in performance) {
      this.memoryStart = (performance as any).memory.usedJSHeapSize;
    }
  }

  /**
   * Record frame performance
   */
  public recordFrame(frameRate: number, renderTime: number): void {
    this.frameRates.push(frameRate);
    this.renderTimes.push(renderTime);
  }

  /**
   * End test and get results
   */
  public endTest(): PerformanceTestResult {
    this.testDuration = performance.now() - this.startTime;
    
    const averageFrameRate = this.frameRates.reduce((a, b) => a + b, 0) / this.frameRates.length;
    const minFrameRate = Math.min(...this.frameRates);
    const maxFrameRate = Math.max(...this.frameRates);
    const frameDrops = this.frameRates.filter(fr => fr < 30).length;
    
    const averageRenderTime = this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
    
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memoryEnd = (performance as any).memory.usedJSHeapSize;
      memoryUsage = (memoryEnd - this.memoryStart) / (1024 * 1024); // MB
    }

    const issues: string[] = [];
    
    // Performance criteria
    if (averageFrameRate < 30) {
      issues.push('Average frame rate below 30 FPS');
    }
    
    if (frameDrops > this.frameRates.length * 0.1) {
      issues.push('More than 10% of frames dropped below 30 FPS');
    }
    
    if (memoryUsage > 100) {
      issues.push('Memory usage increased by more than 100MB');
    }
    
    if (averageRenderTime > 16.67) {
      issues.push('Average render time exceeds 16.67ms (60 FPS target)');
    }

    const passed = issues.length === 0;

    return {
      browser: BrowserDetector.detectBrowser(),
      averageFrameRate,
      minFrameRate,
      maxFrameRate,
      frameDrops,
      memoryUsage,
      renderTime: averageRenderTime,
      loadTime: this.testDuration,
      testDuration: this.testDuration,
      passed,
      issues,
    };
  }
}

/**
 * Compatibility Testing Suite
 */
export class CompatibilityTester {
  /**
   * Run comprehensive compatibility tests
   */
  public static runCompatibilityTests(): CompatibilityTestResult {
    const browser = BrowserDetector.detectBrowser();
    const issues: string[] = [];
    
    // Test WebGL support
    const webglSupport = this.testWebGLSupport();
    if (!webglSupport) {
      issues.push('WebGL not supported');
    }

    // Test shader compilation
    const shaderCompilation = this.testShaderCompilation();
    if (!shaderCompilation) {
      issues.push('Shader compilation failed');
    }

    // Test uniform support
    const uniformSupport = this.testUniformSupport();
    if (!uniformSupport) {
      issues.push('Insufficient uniform support');
    }

    // Test extensions
    const extensionSupport = this.testExtensionSupport();
    
    // Test context creation
    const contextCreation = this.testContextCreation();
    if (!contextCreation) {
      issues.push('WebGL context creation failed');
    }

    // Test texture support
    const textureSupport = this.testTextureSupport();
    if (!textureSupport) {
      issues.push('Required texture formats not supported');
    }

    const passed = issues.length === 0;

    return {
      browser,
      webglSupport,
      shaderCompilation,
      uniformSupport,
      extensionSupport,
      contextCreation,
      textureSupport,
      passed,
      issues,
    };
  }

  private static testWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      canvas.remove();
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  private static testShaderCompilation(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return false;

      // Test vertex shader
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      if (!vertexShader) return false;

      gl.shaderSource(vertexShader, `
        attribute vec4 position;
        void main() {
          gl_Position = position;
        }
      `);
      gl.compileShader(vertexShader);
      
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        canvas.remove();
        return false;
      }

      // Test fragment shader
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!fragmentShader) return false;

      gl.shaderSource(fragmentShader, `
        precision mediump float;
        uniform float time;
        uniform vec2 resolution;
        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          gl_FragColor = vec4(uv, sin(time), 1.0);
        }
      `);
      gl.compileShader(fragmentShader);
      
      const success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
      canvas.remove();
      return success;
    } catch (error) {
      return false;
    }
  }

  private static testUniformSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return false;

      const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
      const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
      
      canvas.remove();
      
      // Check if we have enough uniforms for our shader
      return maxVertexUniforms >= 16 && maxFragmentUniforms >= 32;
    } catch (error) {
      return false;
    }
  }

  private static testExtensionSupport(): { [key: string]: boolean } {
    const extensions: { [key: string]: boolean } = {};
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return extensions;

      const requiredExtensions = [
        'OES_texture_float',
        'OES_texture_half_float',
        'WEBGL_debug_renderer_info',
        'EXT_texture_filter_anisotropic',
        'WEBGL_lose_context',
      ];

      requiredExtensions.forEach(ext => {
        extensions[ext] = !!gl.getExtension(ext);
      });

      canvas.remove();
    } catch (error) {
      // Return empty extensions object on error
    }

    return extensions;
  }

  private static testContextCreation(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      });
      
      const success = !!gl;
      canvas.remove();
      return success;
    } catch (error) {
      return false;
    }
  }

  private static testTextureSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return false;

      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      
      canvas.remove();
      
      // Check minimum requirements
      return maxTextureSize >= 1024 && maxTextureUnits >= 8;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Automated Test Runner
 */
export class AutomatedTestRunner {
  private performanceTester: PerformanceTester;
  private testResults: (PerformanceTestResult | CompatibilityTestResult)[] = [];

  constructor() {
    this.performanceTester = new PerformanceTester();
  }

  /**
   * Run all tests
   */
  public async runAllTests(): Promise<{
    compatibility: CompatibilityTestResult;
    performance: PerformanceTestResult;
    summary: TestSummary;
  }> {
    console.log('Starting cross-browser compatibility tests...');
    
    // Run compatibility tests
    const compatibility = CompatibilityTester.runCompatibilityTests();
    console.log('Compatibility test results:', compatibility);

    // Run performance tests if compatibility passes
    let performance: PerformanceTestResult;
    
    if (compatibility.passed) {
      console.log('Starting performance tests...');
      performance = await this.runPerformanceTest();
      console.log('Performance test results:', performance);
    } else {
      // Create dummy performance result if compatibility failed
      performance = {
        browser: compatibility.browser,
        averageFrameRate: 0,
        minFrameRate: 0,
        maxFrameRate: 0,
        frameDrops: 0,
        memoryUsage: 0,
        renderTime: 0,
        loadTime: 0,
        testDuration: 0,
        passed: false,
        issues: ['Compatibility tests failed'],
      };
    }

    const summary = this.generateSummary(compatibility, performance);
    
    return {
      compatibility,
      performance,
      summary,
    };
  }

  private async runPerformanceTest(): Promise<PerformanceTestResult> {
    return new Promise((resolve) => {
      this.performanceTester.startTest();
      
      let frameCount = 0;
      const maxFrames = 300; // Test for 5 seconds at 60fps
      
      const testFrame = (timestamp: number) => {
        const frameRate = 1000 / (timestamp - (this.lastTimestamp || timestamp));
        const renderStart = performance.now();
        
        // Simulate shader rendering work
        this.simulateShaderWork();
        
        const renderTime = performance.now() - renderStart;
        this.performanceTester.recordFrame(frameRate, renderTime);
        
        this.lastTimestamp = timestamp;
        frameCount++;
        
        if (frameCount < maxFrames) {
          requestAnimationFrame(testFrame);
        } else {
          resolve(this.performanceTester.endTest());
        }
      };
      
      requestAnimationFrame(testFrame);
    });
  }

  private lastTimestamp = 0;

  private simulateShaderWork(): void {
    // Simulate some computational work similar to shader processing
    const iterations = 1000;
    let result = 0;
    
    for (let i = 0; i < iterations; i++) {
      result += Math.sin(i * 0.01) * Math.cos(i * 0.02);
    }
    
    // Prevent optimization
    if (result > 1000000) {
      console.log('Unexpected result:', result);
    }
  }

  private generateSummary(
    compatibility: CompatibilityTestResult,
    performance: PerformanceTestResult
  ): TestSummary {
    const allIssues = [...compatibility.issues, ...performance.issues];
    const overallPassed = compatibility.passed && performance.passed;
    
    let recommendation = 'Excellent';
    if (!overallPassed) {
      recommendation = 'Not Recommended';
    } else if (performance.averageFrameRate < 45) {
      recommendation = 'Acceptable with Reduced Quality';
    } else if (performance.averageFrameRate < 55) {
      recommendation = 'Good';
    }

    return {
      browser: compatibility.browser,
      overallPassed,
      compatibilityScore: this.calculateCompatibilityScore(compatibility),
      performanceScore: this.calculatePerformanceScore(performance),
      recommendation,
      criticalIssues: allIssues.filter(issue => 
        issue.includes('not supported') || 
        issue.includes('failed') ||
        issue.includes('below 30 FPS')
      ),
      warnings: allIssues.filter(issue => 
        !issue.includes('not supported') && 
        !issue.includes('failed') &&
        !issue.includes('below 30 FPS')
      ),
      optimizationSuggestions: this.generateOptimizationSuggestions(compatibility, performance),
    };
  }

  private calculateCompatibilityScore(result: CompatibilityTestResult): number {
    let score = 0;
    
    if (result.webglSupport) score += 30;
    if (result.shaderCompilation) score += 25;
    if (result.uniformSupport) score += 20;
    if (result.contextCreation) score += 15;
    if (result.textureSupport) score += 10;
    
    return score;
  }

  private calculatePerformanceScore(result: PerformanceTestResult): number {
    if (result.averageFrameRate >= 60) return 100;
    if (result.averageFrameRate >= 45) return 80;
    if (result.averageFrameRate >= 30) return 60;
    if (result.averageFrameRate >= 20) return 40;
    return 20;
  }

  private generateOptimizationSuggestions(
    compatibility: CompatibilityTestResult,
    performance: PerformanceTestResult
  ): string[] {
    const suggestions: string[] = [];
    
    if (performance.averageFrameRate < 45) {
      suggestions.push('Reduce particle count to improve frame rate');
      suggestions.push('Lower render scale to 0.8 or below');
      suggestions.push('Disable advanced effects');
    }
    
    if (performance.memoryUsage > 50) {
      suggestions.push('Implement more aggressive memory management');
    }
    
    if (!compatibility.extensionSupport['OES_texture_float']) {
      suggestions.push('Use alternative texture formats for better compatibility');
    }
    
    if (compatibility.browser.isMobile) {
      suggestions.push('Use mobile-optimized settings');
      suggestions.push('Disable mouse interactions');
      suggestions.push('Reduce animation complexity');
    }
    
    return suggestions;
  }
}

export interface TestSummary {
  browser: BrowserInfo;
  overallPassed: boolean;
  compatibilityScore: number;
  performanceScore: number;
  recommendation: string;
  criticalIssues: string[];
  warnings: string[];
  optimizationSuggestions: string[];
}

/**
 * Test Report Generator
 */
export class TestReportGenerator {
  /**
   * Generate HTML test report
   */
  public static generateHTMLReport(results: {
    compatibility: CompatibilityTestResult;
    performance: PerformanceTestResult;
    summary: TestSummary;
  }): string {
    const { compatibility, performance, summary } = results;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Shader Background - Cross-Browser Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .status.passed { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status.failed { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
        .metric { display: flex; justify-content: space-between; margin: 5px 0; }
        .score { font-weight: bold; }
        .issues { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
        .suggestions { background: #e2f3ff; padding: 10px; border-radius: 4px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Enhanced Shader Background</h1>
            <h2>Cross-Browser Test Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
            <h3>Browser Information</h3>
            <table>
                <tr><td>Browser</td><td>${compatibility.browser.name} ${compatibility.browser.version}</td></tr>
                <tr><td>Engine</td><td>${compatibility.browser.engine}</td></tr>
                <tr><td>Platform</td><td>${compatibility.browser.platform}</td></tr>
                <tr><td>Mobile</td><td>${compatibility.browser.isMobile ? 'Yes' : 'No'}</td></tr>
                <tr><td>WebGL Support</td><td>${compatibility.browser.supportsWebGL ? 'Yes' : 'No'}</td></tr>
                <tr><td>WebGL2 Support</td><td>${compatibility.browser.supportsWebGL2 ? 'Yes' : 'No'}</td></tr>
            </table>
        </div>

        <div class="section">
            <h3>Overall Results</h3>
            <div class="status ${summary.overallPassed ? 'passed' : 'failed'}">
                Status: ${summary.overallPassed ? 'PASSED' : 'FAILED'}
            </div>
            <div class="metric">
                <span>Compatibility Score:</span>
                <span class="score">${summary.compatibilityScore}/100</span>
            </div>
            <div class="metric">
                <span>Performance Score:</span>
                <span class="score">${summary.performanceScore}/100</span>
            </div>
            <div class="metric">
                <span>Recommendation:</span>
                <span class="score">${summary.recommendation}</span>
            </div>
        </div>

        <div class="section">
            <h3>Compatibility Tests</h3>
            <table>
                <tr><th>Test</th><th>Result</th></tr>
                <tr><td>WebGL Support</td><td>${compatibility.webglSupport ? '✓ Pass' : '✗ Fail'}</td></tr>
                <tr><td>Shader Compilation</td><td>${compatibility.shaderCompilation ? '✓ Pass' : '✗ Fail'}</td></tr>
                <tr><td>Uniform Support</td><td>${compatibility.uniformSupport ? '✓ Pass' : '✗ Fail'}</td></tr>
                <tr><td>Context Creation</td><td>${compatibility.contextCreation ? '✓ Pass' : '✗ Fail'}</td></tr>
                <tr><td>Texture Support</td><td>${compatibility.textureSupport ? '✓ Pass' : '✗ Fail'}</td></tr>
            </table>
        </div>

        <div class="section">
            <h3>Performance Tests</h3>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>Average Frame Rate</td><td>${performance.averageFrameRate.toFixed(1)} FPS</td></tr>
                <tr><td>Min Frame Rate</td><td>${performance.minFrameRate.toFixed(1)} FPS</td></tr>
                <tr><td>Max Frame Rate</td><td>${performance.maxFrameRate.toFixed(1)} FPS</td></tr>
                <tr><td>Frame Drops</td><td>${performance.frameDrops}</td></tr>
                <tr><td>Memory Usage</td><td>${performance.memoryUsage.toFixed(1)} MB</td></tr>
                <tr><td>Average Render Time</td><td>${performance.renderTime.toFixed(2)} ms</td></tr>
                <tr><td>Test Duration</td><td>${(performance.testDuration / 1000).toFixed(1)} seconds</td></tr>
            </table>
        </div>

        ${summary.criticalIssues.length > 0 ? `
        <div class="section">
            <h3>Critical Issues</h3>
            <div class="issues">
                <ul>
                    ${summary.criticalIssues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}

        ${summary.warnings.length > 0 ? `
        <div class="section">
            <h3>Warnings</h3>
            <div class="issues">
                <ul>
                    ${summary.warnings.map(warning => `<li>${warning}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}

        ${summary.optimizationSuggestions.length > 0 ? `
        <div class="section">
            <h3>Optimization Suggestions</h3>
            <div class="suggestions">
                <ul>
                    ${summary.optimizationSuggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate JSON test report
   */
  public static generateJSONReport(results: {
    compatibility: CompatibilityTestResult;
    performance: PerformanceTestResult;
    summary: TestSummary;
  }): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      ...results,
    }, null, 2);
  }
}