import React from 'react';
import { render, screen } from '@testing-library/react';
import { Index } from './pages/index';

// Integration test to verify shader background works with portfolio content
describe('Enhanced Shader Integration', () => {
  test('should render shader background with portfolio content', () => {
    render(<Index />);
    
    // Check that shader background is present
    const shaderBackground = screen.getByTestId('enhanced-shader-background');
    expect(shaderBackground).toBeInTheDocument();
    
    // Check that main content is present and accessible
    expect(screen.getByText(/Developer & Creator/)).toBeInTheDocument();
    
    // Check that navigation elements are present (using more specific selectors)
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('should have proper z-index layering', () => {
    render(<Index />);
    
    const shaderBackground = screen.getByTestId('enhanced-shader-background');
    const contentContainer = shaderBackground.parentElement?.querySelector('.relative.z-10');
    
    // Shader should have negative z-index
    expect(shaderBackground).toHaveStyle('z-index: -1');
    
    // Content should be above shader
    expect(contentContainer).toHaveClass('z-10');
  });

  test('should not interfere with content readability', () => {
    render(<Index />);
    
    const shaderBackground = screen.getByTestId('enhanced-shader-background');
    
    // Shader should be non-interactive
    expect(shaderBackground).toHaveClass('pointer-events-none');
    
    // Shader should be hidden from screen readers
    expect(shaderBackground).toHaveAttribute('aria-hidden', 'true');
  });
});