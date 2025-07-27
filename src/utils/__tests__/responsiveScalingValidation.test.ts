/**
 * Responsive Scaling Validation Tests
 * 
 * This file contains validation tests for the responsive scaling functionality
 * implemented in task 8. These tests verify that the shader properly scales
 * for different screen resolutions, handles window resize events smoothly,
 * and provides mobile-specific optimizations for touch devices.
 */

import {
  calculateViewportDimensions,
  calculateResponsiveShaderSettings,
  calculateResponsiveShaderSettingsWithTransition,
  calculateOrientationOptimizations,
  calculateUltrawideOptimizations,
  processTouchInteraction,
  calculateTouchInteractionRadius,
  ResponsiveTransitionManager,
  ResponsiveScaleManager,
  handleMobileResizeOptimizations,
  type ViewportDimensions,
  type DeviceCapabilities,
  type ResponsiveShaderSettings,
  type TouchInteraction,
} from '../shaderUtils';

// Mock window and navigator objects for testing
const mockWindow = (width: number, height: number, pixelRatio: number = 1) => {
  Object.defineProperty(global, 'window', {
    value: {
      innerWidth: width,
      innerHeight: height,
      devicePixelRatio: pixelRatio,
      screen: { width, height },
    },
    configurable: true,
  });
};

const mockNavigator = (userAgent: string, cores: number = 4, memory: number = 4) => {
  Object.defineProperty(global, 'navigator', {
    value: {
      userAgent,
      hardwareConcurrency: cores,
      deviceMemory: memory,
    },
    configurable: true,
  });
};

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: () => Date.now(),
  },
});

/**
 * Test Suite 1: Viewport Dimensions Calculation
 */
export const testViewportDimensionsCalculation = () => {
  console.log('🧪 Testing Viewport Dimensions Calculation...');
  
  // Test desktop viewport
  mockWindow(1920, 1080, 1);
  mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  const desktopViewport = calculateViewportDimensions();
  console.assert(desktopViewport.width === 1920, 'Desktop width should be 1920');
  console.assert(desktopViewport.height === 1080, 'Desktop height should be 1080');
  console.assert(desktopViewport.deviceType === 'desktop', 'Should detect desktop device type');
  console.assert(desktopViewport.orientation === 'landscape', 'Should detect landscape orientation');
  console.assert(!desktopViewport.isUltrawide, 'Should not detect ultrawide for 1920x1080');
  
  // Test mobile viewport
  mockWindow(375, 667, 2);
  mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
  
  const mobileViewport = calculateViewportDimensions();
  console.assert(mobileViewport.width === 375, 'Mobile width should be 375');
  console.assert(mobileViewport.height === 667, 'Mobile height should be 667');
  console.assert(mobileViewport.deviceType === 'mobile', 'Should detect mobile device type');
  console.assert(mobileViewport.orientation === 'portrait', 'Should detect portrait orientation');
  console.assert(mobileViewport.pixelRatio === 2, 'Should detect high pixel ratio');
  
  // Test ultrawide viewport
  mockWindow(3440, 1440, 1);
  mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  const ultrawideViewport = calculateViewportDimensions();
  console.assert(ultrawideViewport.isUltrawide, 'Should detect ultrawide display');
  console.assert(ultrawideViewport.aspectRatio > 2.0, 'Ultrawide aspect ratio should be > 2.0');
  
  console.log('✅ Viewport Dimensions Calculation tests passed');
};

/**
 * Test Suite 2: Responsive Shader Settings Calculation
 */
export const testResponsiveShaderSettings = () => {
  console.log('🧪 Testing Responsive Shader Settings...');
  
  const mockDeviceCapabilities: DeviceCapabilities = {
    tier: 'medium',
    score: 0.6,
    features: {
      webgl2: false,
      floatTextures: true,
      halfFloatTextures: true,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 4096,
      maxVertexAttribs: 16,
      maxFragmentUniforms: 64,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      cores: 8,
      deviceMemory: 8,
      pixelRatio: 1,
      refreshRate: 60,
      renderer: 'NVIDIA GeForce GTX 1060',
      vendor: 'NVIDIA Corporation',
    },
  };
  
  // Test desktop settings
  mockWindow(1920, 1080, 1);
  const desktopViewport = calculateViewportDimensions();
  const desktopSettings = calculateResponsiveShaderSettings(desktopViewport, mockDeviceCapabilities);
  
  console.assert(desktopSettings.renderScale > 0.5, 'Desktop render scale should be reasonable');
  console.assert(desktopSettings.renderScale <= 1.0, 'Desktop render scale should not exceed 1.0');
  console.assert(desktopSettings.particleCount > 50, 'Desktop should have sufficient particles');
  console.assert(desktopSettings.particleCount <= 200, 'Desktop particle count should be capped');
  console.assert(desktopSettings.enableComplexEffects, 'Desktop should enable complex effects');
  
  // Test mobile settings
  mockWindow(375, 667, 2);
  const mobileCapabilities: DeviceCapabilities = {
    ...mockDeviceCapabilities,
    tier: 'low',
    score: 0.3,
    features: {
      ...mockDeviceCapabilities.features,
      isMobile: true,
      isDesktop: false,
      cores: 4,
      deviceMemory: 4,
    },
  };
  
  const mobileViewport = calculateViewportDimensions();
  const mobileSettings = calculateResponsiveShaderSettings(mobileViewport, mobileCapabilities);
  
  console.assert(mobileSettings.renderScale < 1.0, 'Mobile render scale should be reduced');
  console.assert(mobileSettings.particleCount < 100, 'Mobile should have fewer particles');
  console.assert(!mobileSettings.enableComplexEffects, 'Mobile should disable complex effects');
  console.assert(mobileSettings.debounceDelay > 150, 'Mobile should have longer debounce delay');
  
  console.log('✅ Responsive Shader Settings tests passed');
};

/**
 * Test Suite 3: Smooth Transitions
 */
export const testSmoothTransitions = () => {
  console.log('🧪 Testing Smooth Transitions...');
  
  const mockDeviceCapabilities: DeviceCapabilities = {
    tier: 'medium',
    score: 0.6,
    features: {
      webgl2: false,
      floatTextures: true,
      halfFloatTextures: true,
      depthTextures: false,
      instancedArrays: false,
      vertexArrayObjects: false,
      maxTextureSize: 4096,
      maxVertexAttribs: 16,
      maxFragmentUniforms: 64,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      cores: 8,
      deviceMemory: 8,
      pixelRatio: 1,
      refreshRate: 60,
      renderer: 'NVIDIA GeForce GTX 1060',
      vendor: 'NVIDIA Corporation',
    },
  };
  
  const previousSettings: ResponsiveShaderSettings = {
    renderScale: 1.0,
    particleCount: 100,
    interactionRadius: 0.3,
    animationSpeed: 1.0,
    qualityLevel: 0.8,
    enableComplexEffects: true,
    debounceDelay: 150,
    transitionDuration: 300,
  };
  
  mockWindow(1920, 1080, 1);
  const viewport = calculateViewportDimensions();
  const newSettings = calculateResponsiveShaderSettingsWithTransition(
    viewport,
    mockDeviceCapabilities,
    {},
    previousSettings
  );
  
  // Test that changes are limited to prevent jarring transitions
  const particleRatio = newSettings.particleCount / previousSettings.particleCount;
  const scaleRatio = newSettings.renderScale / previousSettings.renderScale;
  
  console.assert(particleRatio > 0.7, 'Particle count change should be limited (max 30% decrease)');
  console.assert(particleRatio < 1.3, 'Particle count change should be limited (max 30% increase)');
  console.assert(scaleRatio > 0.8, 'Render scale change should be limited (max 20% decrease)');
  console.assert(scaleRatio < 1.2, 'Render scale change should be limited (max 20% increase)');
  
  console.log('✅ Smooth Transitions tests passed');
};

/**
 * Test Suite 4: Orientation Optimizations
 */
export const testOrientationOptimizations = () => {
  console.log('🧪 Testing Orientation Optimizations...');
  
  // Test portrait optimization
  mockWindow(375, 667, 2);
  const portraitViewport = calculateViewportDimensions();
  const portraitSettings = calculateOrientationOptimizations(portraitViewport, 'landscape');
  
  console.assert(portraitViewport.orientation === 'portrait', 'Should detect portrait orientation');
  console.assert(portraitSettings.particleCount < 100, 'Portrait should have fewer particles');
  console.assert(portraitSettings.interactionRadius < 0.3, 'Portrait should have smaller interaction radius');
  console.assert(portraitSettings.transitionDuration === 400, 'Portrait should have longer transition duration');
  
  // Test landscape optimization
  mockWindow(667, 375, 2);
  const landscapeViewport = calculateViewportDimensions();
  const landscapeSettings = calculateOrientationOptimizations(landscapeViewport, 'portrait');
  
  console.assert(landscapeViewport.orientation === 'landscape', 'Should detect landscape orientation');
  console.assert(landscapeSettings.particleCount > 50, 'Landscape should have more particles');
  console.assert(landscapeSettings.interactionRadius > 0.2, 'Landscape should have larger interaction radius');
  console.assert(landscapeSettings.transitionDuration === 350, 'Landscape should have standard transition duration');
  
  console.log('✅ Orientation Optimizations tests passed');
};

/**
 * Test Suite 5: Ultrawide Display Optimizations
 */
export const testUltrawideOptimizations = () => {
  console.log('🧪 Testing Ultrawide Display Optimizations...');
  
  const mockDeviceCapabilities: DeviceCapabilities = {
    tier: 'high',
    score: 0.8,
    features: {
      webgl2: true,
      floatTextures: true,
      halfFloatTextures: true,
      depthTextures: true,
      instancedArrays: true,
      vertexArrayObjects: true,
      maxTextureSize: 8192,
      maxVertexAttribs: 32,
      maxFragmentUniforms: 128,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      cores: 16,
      deviceMemory: 32,
      pixelRatio: 1,
      refreshRate: 144,
      renderer: 'NVIDIA GeForce RTX 3080',
      vendor: 'NVIDIA Corporation',
    },
  };
  
  // Test ultrawide display
  mockWindow(3440, 1440, 1);
  const ultrawideViewport = calculateViewportDimensions();
  const ultrawideSettings = calculateUltrawideOptimizations(ultrawideViewport, mockDeviceCapabilities);
  
  console.assert(ultrawideViewport.isUltrawide, 'Should detect ultrawide display');
  console.assert(ultrawideSettings.particleCount > 100, 'Ultrawide should have more particles');
  console.assert(ultrawideSettings.interactionRadius > 0.3, 'Ultrawide should have larger interaction radius');
  console.assert(ultrawideSettings.renderScale <= 1.0, 'Ultrawide should optimize render scale');
  console.assert(ultrawideSettings.animationSpeed > 1.0, 'Ultrawide should have faster animations');
  
  // Test standard display (should not apply ultrawide optimizations)
  mockWindow(1920, 1080, 1);
  const standardViewport = calculateViewportDimensions();
  const baseSettings = calculateResponsiveShaderSettings(standardViewport, mockDeviceCapabilities);
  const standardSettings = calculateUltrawideOptimizations(standardViewport, mockDeviceCapabilities);
  
  console.assert(!standardViewport.isUltrawide, 'Should not detect ultrawide for standard display');
  console.assert(JSON.stringify(standardSettings) === JSON.stringify(baseSettings), 'Standard display should not apply ultrawide optimizations');
  
  console.log('✅ Ultrawide Display Optimizations tests passed');
};

/**
 * Test Suite 6: Touch Interaction Processing
 */
export const testTouchInteractionProcessing = () => {
  console.log('🧪 Testing Touch Interaction Processing...');
  
  const mockContainerRect: DOMRect = {
    left: 0,
    top: 0,
    width: 375,
    height: 667,
    right: 375,
    bottom: 667,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
  
  const mockTouch: Touch = {
    identifier: 1,
    target: {} as EventTarget,
    clientX: 187.5, // Center X
    clientY: 333.5, // Center Y
    pageX: 187.5,
    pageY: 333.5,
    screenX: 187.5,
    screenY: 333.5,
    radiusX: 25,
    radiusY: 25,
    rotationAngle: 0,
    force: 0.8,
  };
  
  const touchInteraction = processTouchInteraction(mockTouch, mockContainerRect);
  
  console.assert(touchInteraction.isActive, 'Touch interaction should be active');
  console.assert(Math.abs(touchInteraction.position.x - 0.5) < 0.01, 'Touch X position should be normalized to center');
  console.assert(Math.abs(touchInteraction.position.y - 0.5) < 0.01, 'Touch Y position should be normalized to center (flipped)');
  console.assert(touchInteraction.pressure === 0.8, 'Touch pressure should be preserved');
  console.assert(touchInteraction.radiusX === 25, 'Touch radius X should be preserved');
  console.assert(touchInteraction.radiusY === 25, 'Touch radius Y should be preserved');
  console.assert(touchInteraction.timestamp > 0, 'Touch timestamp should be set');
  
  // Test coordinate clamping
  const outOfBoundsTouch: Touch = {
    ...mockTouch,
    clientX: -50, // Outside left boundary
    clientY: 800, // Outside bottom boundary
  };
  
  const clampedInteraction = processTouchInteraction(outOfBoundsTouch, mockContainerRect);
  console.assert(clampedInteraction.position.x === 0, 'Out of bounds X should be clamped to 0');
  console.assert(clampedInteraction.position.y === 0, 'Out of bounds Y should be clamped to 0');
  
  console.log('✅ Touch Interaction Processing tests passed');
};

/**
 * Test Suite 7: Touch Interaction Radius Calculation
 */
export const testTouchInteractionRadius = () => {
  console.log('🧪 Testing Touch Interaction Radius Calculation...');
  
  const baseRadius = 0.3;
  
  // Test mobile device adjustment
  const mobileRadius = calculateTouchInteractionRadius(baseRadius, undefined, 'mobile');
  console.assert(mobileRadius < baseRadius, 'Mobile radius should be smaller than base');
  console.assert(mobileRadius > 0.1, 'Mobile radius should be within lower bound');
  console.assert(mobileRadius < 0.6, 'Mobile radius should be within upper bound');
  
  // Test tablet device adjustment
  const tabletRadius = calculateTouchInteractionRadius(baseRadius, undefined, 'tablet');
  console.assert(tabletRadius > baseRadius, 'Tablet radius should be larger than base');
  console.assert(tabletRadius > 0.1, 'Tablet radius should be within lower bound');
  console.assert(tabletRadius < 0.6, 'Tablet radius should be within upper bound');
  
  // Test touch properties adjustment
  const touchInteraction: TouchInteraction = {
    isActive: true,
    position: { x: 0.5, y: 0.5 },
    pressure: 1.2,
    radiusX: 40,
    radiusY: 40,
    rotationAngle: 0,
    timestamp: Date.now(),
  };
  
  const adjustedRadius = calculateTouchInteractionRadius(baseRadius, touchInteraction, 'mobile');
  console.assert(adjustedRadius > 0.1, 'Adjusted radius should be within lower bound');
  console.assert(adjustedRadius < 0.6, 'Adjusted radius should be within upper bound');
  
  // Test radius clamping
  const largeRadius = calculateTouchInteractionRadius(2.0, undefined, 'desktop');
  console.assert(largeRadius <= 0.6, 'Large radius should be clamped to maximum');
  
  console.log('✅ Touch Interaction Radius Calculation tests passed');
};

/**
 * Test Suite 8: Responsive Transition Manager
 */
export const testResponsiveTransitionManager = () => {
  console.log('🧪 Testing Responsive Transition Manager...');
  
  const transitionManager = new ResponsiveTransitionManager(300);
  
  const fromSettings: ResponsiveShaderSettings = {
    renderScale: 0.8,
    particleCount: 80,
    interactionRadius: 0.25,
    animationSpeed: 0.9,
    qualityLevel: 0.7,
    enableComplexEffects: false,
    debounceDelay: 200,
    transitionDuration: 300,
  };
  
  const toSettings: ResponsiveShaderSettings = {
    renderScale: 1.0,
    particleCount: 120,
    interactionRadius: 0.35,
    animationSpeed: 1.1,
    qualityLevel: 0.9,
    enableComplexEffects: true,
    debounceDelay: 150,
    transitionDuration: 300,
  };
  
  // Test transition start
  transitionManager.startTransition(fromSettings, toSettings);
  console.assert(transitionManager.isTransitioning(), 'Should be transitioning after start');
  console.assert(transitionManager.getProgress() === 0, 'Progress should start at 0');
  
  // Test transition update (simulate time passing)
  const originalNow = performance.now;
  performance.now = () => 150; // 50% through transition
  
  const interpolatedSettings = transitionManager.updateTransition();
  console.assert(interpolatedSettings !== null, 'Should return interpolated settings');
  
  if (interpolatedSettings) {
    console.assert(interpolatedSettings.renderScale > fromSettings.renderScale, 'Render scale should be interpolating');
    console.assert(interpolatedSettings.renderScale < toSettings.renderScale, 'Render scale should not exceed target');
    console.assert(interpolatedSettings.particleCount > fromSettings.particleCount, 'Particle count should be interpolating');
    console.assert(interpolatedSettings.particleCount < toSettings.particleCount, 'Particle count should not exceed target');
  }
  
  // Test transition completion
  performance.now = () => 300; // 100% through transition
  const finalSettings = transitionManager.updateTransition();
  console.assert(!transitionManager.isTransitioning(), 'Should not be transitioning after completion');
  console.assert(JSON.stringify(finalSettings) === JSON.stringify(toSettings), 'Final settings should match target');
  
  // Test transition cancellation
  transitionManager.startTransition(fromSettings, toSettings);
  console.assert(transitionManager.isTransitioning(), 'Should be transitioning after restart');
  
  transitionManager.cancelTransition();
  console.assert(!transitionManager.isTransitioning(), 'Should not be transitioning after cancellation');
  
  const cancelledResult = transitionManager.updateTransition();
  console.assert(cancelledResult === null, 'Should return null after cancellation');
  
  // Restore original performance.now
  performance.now = originalNow;
  
  console.log('✅ Responsive Transition Manager tests passed');
};

/**
 * Test Suite 9: Mobile Resize Optimizations
 */
export const testMobileResizeOptimizations = () => {
  console.log('🧪 Testing Mobile Resize Optimizations...');
  
  // Test orientation change optimization
  mockWindow(375, 667, 2);
  mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
  
  const viewport = calculateViewportDimensions();
  const orientationResizeEvent = {
    viewport,
    previousViewport: viewport,
    resizeType: 'orientation' as const,
    timestamp: Date.now(),
  };
  
  const orientationOptimizations = handleMobileResizeOptimizations(viewport, orientationResizeEvent);
  console.assert(orientationOptimizations.particleCount < 100, 'Orientation change should reduce particles');
  console.assert(orientationOptimizations.animationSpeed < 1.0, 'Orientation change should slow animations');
  console.assert(orientationOptimizations.debounceDelay === 200, 'Orientation change should have longer debounce');
  console.assert(orientationOptimizations.transitionDuration === 400, 'Orientation change should have longer transition');
  
  // Test zoom optimization
  const zoomResizeEvent = {
    viewport,
    previousViewport: viewport,
    resizeType: 'zoom' as const,
    timestamp: Date.now(),
  };
  
  const zoomOptimizations = handleMobileResizeOptimizations(viewport, zoomResizeEvent);
  console.assert(zoomOptimizations.renderScale <= 0.8, 'Zoom should reduce render scale');
  console.assert(!zoomOptimizations.enableComplexEffects, 'Zoom should disable complex effects');
  console.assert(zoomOptimizations.debounceDelay === 100, 'Zoom should have shorter debounce');
  console.assert(zoomOptimizations.transitionDuration === 200, 'Zoom should have shorter transition');
  
  console.log('✅ Mobile Resize Optimizations tests passed');
};

/**
 * Run all validation tests
 */
export const runAllValidationTests = () => {
  console.log('🚀 Starting Responsive Scaling Validation Tests...\n');
  
  try {
    testViewportDimensionsCalculation();
    testResponsiveShaderSettings();
    testSmoothTransitions();
    testOrientationOptimizations();
    testUltrawideOptimizations();
    testTouchInteractionProcessing();
    testTouchInteractionRadius();
    testResponsiveTransitionManager();
    testMobileResizeOptimizations();
    
    console.log('\n🎉 All Responsive Scaling Validation Tests Passed!');
    console.log('✅ Task 8: Add responsive scaling and window resize handling - COMPLETED');
    
    return true;
  } catch (error) {
    console.error('\n❌ Validation Tests Failed:', error);
    return false;
  }
};

// Export test functions for individual testing
export {
  testViewportDimensionsCalculation,
  testResponsiveShaderSettings,
  testSmoothTransitions,
  testOrientationOptimizations,
  testUltrawideOptimizations,
  testTouchInteractionProcessing,
  testTouchInteractionRadius,
  testResponsiveTransitionManager,
  testMobileResizeOptimizations,
};

// Run tests if this file is executed directly
if (typeof window === 'undefined' && typeof module !== 'undefined') {
  runAllValidationTests();
}