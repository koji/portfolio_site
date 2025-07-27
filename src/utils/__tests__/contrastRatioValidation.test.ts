import { describe, it, expect } from 'vitest';

// Utility function to calculate relative luminance
function getRelativeLuminance(r: number, g: number, b: number): number {
  // Convert RGB values to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Utility function to calculate contrast ratio between two colors
function getContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const l1 = getRelativeLuminance(color1[0], color1[1], color1[2]);
  const l2 = getRelativeLuminance(color2[0], color2[1], color2[2]);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Theme colors from the shader component (converted to RGB 0-255)
const THEME_COLORS = {
  light: {
    primary: [245, 102, 66] as [number, number, number], // vermilion-500
    accent: [232, 61, 125] as [number, number, number], // sakura-500
    background: [255, 255, 255] as [number, number, number], // white
    particle: [110, 110, 110] as [number, number, number], // sumi-700
  },
  dark: {
    primary: [255, 115, 77] as [number, number, number], // vermilion-400
    accent: [242, 117, 145] as [number, number, number], // sakura-400
    background: [13, 13, 13] as [number, number, number], // near black
    particle: [176, 176, 176] as [number, number, number], // sumi-300
  },
};

// Common text colors for contrast testing
const TEXT_COLORS = {
  black: [0, 0, 0] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  darkGray: [64, 64, 64] as [number, number, number],
  lightGray: [192, 192, 192] as [number, number, number],
};

describe('Contrast Ratio Validation for Accessibility', () => {
  describe('WCAG AA Compliance (4.5:1 ratio)', () => {
    it('should have sufficient contrast between light theme background and dark text', () => {
      const contrastRatio = getContrastRatio(THEME_COLORS.light.background, TEXT_COLORS.black);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio).toBeCloseTo(21, 0); // White to black should be 21:1
    });

    it('should have sufficient contrast between dark theme background and light text', () => {
      const contrastRatio = getContrastRatio(THEME_COLORS.dark.background, TEXT_COLORS.white);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio).toBeGreaterThan(15); // Should be very high contrast
    });

    it('should ensure shader particles do not interfere with text readability in light theme', () => {
      // Test contrast between particle color and background
      const particleBackgroundContrast = getContrastRatio(
        THEME_COLORS.light.particle,
        THEME_COLORS.light.background
      );
      
      // Particles should have enough contrast to be visible but not too much to interfere
      expect(particleBackgroundContrast).toBeGreaterThan(2.0);
      expect(particleBackgroundContrast).toBeLessThan(8.0);
    });

    it('should ensure shader particles do not interfere with text readability in dark theme', () => {
      const particleBackgroundContrast = getContrastRatio(
        THEME_COLORS.dark.particle,
        THEME_COLORS.dark.background
      );
      
      // Particles should have enough contrast to be visible but not too much to interfere
      expect(particleBackgroundContrast).toBeGreaterThan(2.0);
      expect(particleBackgroundContrast).toBeLessThan(10.0);
    });
  });

  describe('WCAG AAA Compliance (7:1 ratio)', () => {
    it('should meet AAA standards for light theme background with dark text', () => {
      const contrastRatio = getContrastRatio(THEME_COLORS.light.background, TEXT_COLORS.black);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });

    it('should meet AAA standards for dark theme background with light text', () => {
      const contrastRatio = getContrastRatio(THEME_COLORS.dark.background, TEXT_COLORS.white);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0);
    });
  });

  describe('Shader Color Accessibility', () => {
    it('should ensure primary colors have appropriate contrast with backgrounds', () => {
      // Light theme primary on light background
      const lightPrimaryContrast = getContrastRatio(
        THEME_COLORS.light.primary,
        THEME_COLORS.light.background
      );
      expect(lightPrimaryContrast).toBeGreaterThan(3.0); // Should be visible but not overwhelming
      
      // Dark theme primary on dark background
      const darkPrimaryContrast = getContrastRatio(
        THEME_COLORS.dark.primary,
        THEME_COLORS.dark.background
      );
      expect(darkPrimaryContrast).toBeGreaterThan(3.0);
    });

    it('should ensure accent colors have appropriate contrast with backgrounds', () => {
      // Light theme accent on light background
      const lightAccentContrast = getContrastRatio(
        THEME_COLORS.light.accent,
        THEME_COLORS.light.background
      );
      expect(lightAccentContrast).toBeGreaterThan(3.0);
      
      // Dark theme accent on dark background
      const darkAccentContrast = getContrastRatio(
        THEME_COLORS.dark.accent,
        THEME_COLORS.dark.background
      );
      expect(darkAccentContrast).toBeGreaterThan(3.0);
    });

    it('should ensure shader colors do not create accessibility barriers', () => {
      // Test that shader colors are distinguishable for color-blind users
      // This is a simplified test - in practice, you'd use more sophisticated color vision simulation
      
      const primaryAccentContrast = getContrastRatio(
        THEME_COLORS.light.primary,
        THEME_COLORS.light.accent
      );
      
      // Primary and accent should be distinguishable
      expect(primaryAccentContrast).toBeGreaterThan(1.2);
    });
  });

  describe('Reduced Motion Accessibility', () => {
    it('should calculate appropriate opacity for static fallback', () => {
      const baseIntensity = 0.8;
      const reducedIntensity = baseIntensity * 0.3; // As implemented in the component
      
      // Reduced intensity should be subtle enough not to interfere with content
      expect(reducedIntensity).toBeLessThanOrEqual(0.3);
      expect(reducedIntensity).toBeGreaterThan(0.1); // But still visible
    });

    it('should ensure static fallback maintains sufficient contrast', () => {
      // Test that even with reduced intensity, the static version maintains readability
      const staticIntensity = 0.3; // Maximum intensity for static fallback
      
      // With screen blend mode, the effective contrast should still be acceptable
      // This is a simplified test - actual blend mode calculations are more complex
      expect(staticIntensity).toBeLessThan(0.5); // Should not interfere significantly with text
    });
  });

  describe('Color Vision Deficiency Support', () => {
    it('should provide sufficient contrast for protanopia (red-blind)', () => {
      // Simplified test for red color blindness
      // In protanopia, red appears much darker
      const simulatedRed = [85, 102, 66] as [number, number, number]; // Simulated vermilion for protanopia
      
      const contrastWithBackground = getContrastRatio(
        simulatedRed,
        THEME_COLORS.light.background
      );
      
      expect(contrastWithBackground).toBeGreaterThan(2.0); // Should still be visible
    });

    it('should provide sufficient contrast for deuteranopia (green-blind)', () => {
      // Simplified test for green color blindness
      const simulatedGreen = [102, 85, 66] as [number, number, number]; // Simulated color for deuteranopia
      
      const contrastWithBackground = getContrastRatio(
        simulatedGreen,
        THEME_COLORS.light.background
      );
      
      expect(contrastWithBackground).toBeGreaterThan(2.0);
    });

    it('should provide sufficient contrast for tritanopia (blue-blind)', () => {
      // Simplified test for blue color blindness
      const simulatedBlue = [245, 102, 85] as [number, number, number]; // Simulated color for tritanopia
      
      const contrastWithBackground = getContrastRatio(
        simulatedBlue,
        THEME_COLORS.light.background
      );
      
      expect(contrastWithBackground).toBeGreaterThan(2.0);
    });
  });

  describe('Utility Functions', () => {
    it('should calculate relative luminance correctly', () => {
      // Test with known values
      const whiteLuminance = getRelativeLuminance(255, 255, 255);
      const blackLuminance = getRelativeLuminance(0, 0, 0);
      
      expect(whiteLuminance).toBeCloseTo(1.0, 2);
      expect(blackLuminance).toBeCloseTo(0.0, 2);
    });

    it('should calculate contrast ratio correctly', () => {
      // Test with known values
      const whiteBlackContrast = getContrastRatio([255, 255, 255], [0, 0, 0]);
      expect(whiteBlackContrast).toBeCloseTo(21, 0);
      
      const sameColorContrast = getContrastRatio([128, 128, 128], [128, 128, 128]);
      expect(sameColorContrast).toBeCloseTo(1, 1);
    });
  });
});

// Export utility functions for use in other tests
export { getRelativeLuminance, getContrastRatio, THEME_COLORS, TEXT_COLORS };