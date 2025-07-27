/**
 * Comprehensive Test Runner for Enhanced Shader Background
 * 
 * This script runs all performance and compatibility tests and generates reports
 */

import { AutomatedTestRunner, TestReportGenerator } from './crossBrowserTesting';

/**
 * Main test runner function
 */
export async function runComprehensiveTests(): Promise<void> {
  console.log('🚀 Starting Enhanced Shader Background Test Suite...\n');
  
  try {
    const testRunner = new AutomatedTestRunner();
    
    console.log('📊 Running compatibility and performance tests...');
    const results = await testRunner.runAllTests();
    
    // Log results to console
    console.log('\n📋 Test Results Summary:');
    console.log('========================');
    console.log(`Browser: ${results.compatibility.browser.name} ${results.compatibility.browser.version}`);
    console.log(`Platform: ${results.compatibility.browser.platform}`);
    console.log(`Mobile: ${results.compatibility.browser.isMobile ? 'Yes' : 'No'}`);
    console.log(`WebGL Support: ${results.compatibility.browser.supportsWebGL ? 'Yes' : 'No'}`);
    console.log(`WebGL2 Support: ${results.compatibility.browser.supportsWebGL2 ? 'Yes' : 'No'}`);
    
    console.log('\n🔧 Compatibility Tests:');
    console.log(`Overall Status: ${results.compatibility.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`WebGL Support: ${results.compatibility.webglSupport ? '✅' : '❌'}`);
    console.log(`Shader Compilation: ${results.compatibility.shaderCompilation ? '✅' : '❌'}`);
    console.log(`Uniform Support: ${results.compatibility.uniformSupport ? '✅' : '❌'}`);
    console.log(`Context Creation: ${results.compatibility.contextCreation ? '✅' : '❌'}`);
    console.log(`Texture Support: ${results.compatibility.textureSupport ? '✅' : '❌'}`);
    
    console.log('\n⚡ Performance Tests:');
    console.log(`Overall Status: ${results.performance.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Average Frame Rate: ${results.performance.averageFrameRate.toFixed(1)} FPS`);
    console.log(`Min Frame Rate: ${results.performance.minFrameRate.toFixed(1)} FPS`);
    console.log(`Max Frame Rate: ${results.performance.maxFrameRate.toFixed(1)} FPS`);
    console.log(`Frame Drops: ${results.performance.frameDrops}`);
    console.log(`Memory Usage: ${results.performance.memoryUsage.toFixed(1)} MB`);
    console.log(`Average Render Time: ${results.performance.renderTime.toFixed(2)} ms`);
    
    console.log('\n📈 Overall Assessment:');
    console.log(`Compatibility Score: ${results.summary.compatibilityScore}/100`);
    console.log(`Performance Score: ${results.summary.performanceScore}/100`);
    console.log(`Recommendation: ${results.summary.recommendation}`);
    
    if (results.summary.criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues:');
      results.summary.criticalIssues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
    }
    
    if (results.summary.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      results.summary.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }
    
    if (results.summary.optimizationSuggestions.length > 0) {
      console.log('\n💡 Optimization Suggestions:');
      results.summary.optimizationSuggestions.forEach(suggestion => {
        console.log(`  • ${suggestion}`);
      });
    }
    
    // Generate reports
    console.log('\n📄 Generating test reports...');
    
    const htmlReport = TestReportGenerator.generateHTMLReport(results);
    const jsonReport = TestReportGenerator.generateJSONReport(results);
    
    // In a real implementation, you would save these to files
    console.log('HTML Report generated (would be saved to test-report.html)');
    console.log('JSON Report generated (would be saved to test-report.json)');
    
    // Store reports in sessionStorage for demo purposes
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shader-test-html-report', htmlReport);
      sessionStorage.setItem('shader-test-json-report', jsonReport);
      console.log('Reports stored in sessionStorage for inspection');
    }
    
    console.log('\n✅ Test suite completed successfully!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    throw error;
  }
}

/**
 * Quick performance check function
 */
export function quickPerformanceCheck(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('🔍 Running quick performance check...');
    
    let frameCount = 0;
    let totalFrameTime = 0;
    const maxFrames = 60; // Test for 1 second at 60fps
    let lastTimestamp = 0;
    
    const testFrame = (timestamp: number) => {
      if (lastTimestamp > 0) {
        const frameTime = timestamp - lastTimestamp;
        totalFrameTime += frameTime;
        frameCount++;
      }
      
      lastTimestamp = timestamp;
      
      if (frameCount < maxFrames) {
        requestAnimationFrame(testFrame);
      } else {
        const averageFrameTime = totalFrameTime / frameCount;
        const averageFrameRate = 1000 / averageFrameTime;
        
        console.log(`Average Frame Rate: ${averageFrameRate.toFixed(1)} FPS`);
        
        const isAcceptable = averageFrameRate >= 30;
        console.log(`Performance: ${isAcceptable ? '✅ Acceptable' : '❌ Poor'}`);
        
        resolve(isAcceptable);
      }
    };
    
    requestAnimationFrame(testFrame);
  });
}

/**
 * Browser compatibility check function
 */
export function checkBrowserCompatibility(): {
  compatible: boolean;
  issues: string[];
  recommendations: string[];
} {
  console.log('🌐 Checking browser compatibility...');
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check WebGL support
  if (!window.WebGLRenderingContext) {
    issues.push('WebGL is not supported');
    recommendations.push('Use a modern browser that supports WebGL');
  }
  
  // Check for required APIs
  if (!window.requestAnimationFrame) {
    issues.push('requestAnimationFrame is not supported');
    recommendations.push('Update your browser to a more recent version');
  }
  
  if (!window.performance || !window.performance.now) {
    issues.push('High-resolution timing is not supported');
    recommendations.push('Some performance optimizations may not work');
  }
  
  // Check for WebGL context creation
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      issues.push('WebGL context creation failed');
      recommendations.push('Check if WebGL is enabled in browser settings');
    } else {
      // Check for required extensions
      const requiredExtensions = ['OES_texture_float', 'WEBGL_debug_renderer_info'];
      requiredExtensions.forEach(ext => {
        if (!gl.getExtension(ext)) {
          recommendations.push(`Consider enabling ${ext} extension for better performance`);
        }
      });
    }
    canvas.remove();
  } catch (error) {
    issues.push('WebGL context creation threw an error');
    recommendations.push('WebGL may be disabled or unavailable');
  }
  
  const compatible = issues.length === 0;
  
  console.log(`Compatibility: ${compatible ? '✅ Compatible' : '❌ Issues Found'}`);
  if (issues.length > 0) {
    console.log('Issues:', issues);
  }
  if (recommendations.length > 0) {
    console.log('Recommendations:', recommendations);
  }
  
  return { compatible, issues, recommendations };
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private intervalId?: number;
  private measurements: number[] = [];
  
  start(): void {
    console.log('🧠 Starting memory monitoring...');
    
    this.intervalId = window.setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        this.measurements.push(usedMB);
        
        if (this.measurements.length > 60) { // Keep last 60 measurements
          this.measurements.shift();
        }
      }
    }, 1000);
  }
  
  stop(): { average: number; peak: number; current: number } {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    
    const average = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
    const peak = Math.max(...this.measurements);
    const current = this.measurements[this.measurements.length - 1] || 0;
    
    console.log(`Memory Usage - Average: ${average.toFixed(1)}MB, Peak: ${peak.toFixed(1)}MB, Current: ${current.toFixed(1)}MB`);
    
    return { average, peak, current };
  }
}

/**
 * Export test utilities for use in other modules
 */
export const TestUtils = {
  runComprehensiveTests,
  quickPerformanceCheck,
  checkBrowserCompatibility,
  MemoryMonitor,
};

// Auto-run tests in development mode
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Add a global function to run tests from browser console
  (window as any).runShaderTests = runComprehensiveTests;
  (window as any).quickShaderCheck = quickPerformanceCheck;
  (window as any).checkShaderCompatibility = checkBrowserCompatibility;
  
  console.log('🔧 Shader test utilities available:');
  console.log('  • runShaderTests() - Run comprehensive test suite');
  console.log('  • quickShaderCheck() - Quick performance check');
  console.log('  • checkShaderCompatibility() - Browser compatibility check');
}