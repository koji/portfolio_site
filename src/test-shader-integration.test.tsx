import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Index } from './pages/index';

describe('Enhanced Shader Integration', () => {
  it('should render the enhanced shader background in the portfolio layout', () => {
    render(<Index />);
    
    // Check that the shader background is present
    const shaderBackground = screen.getByTestId('enhanced-shader-background');
    expect(shaderBackground).toBeInTheDocument();
    
    // Verify proper styling for background positioning
    expect(shaderBackground).toHaveClass('fixed', 'inset-0', 'pointer-events-none');
    expect(shaderBackground).toHaveStyle({ zIndex: '-1' });
    
    // Check accessibility attributes
    expect(shaderBackground).toHaveAttribute('aria-hidden', 'true');
    expect(shaderBackground).toHaveAttribute('aria-label');
  });

  it('should not interfere with navigation and content', () => {
    render(<Index />);
    
    // Check that main content is present and accessible
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
    
    // Check that main content sections are present
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    
    // Verify the shader is behind content (z-index -1)
    const shaderBackground = screen.getByTestId('enhanced-shader-background');
    const computedStyle = window.getComputedStyle(shaderBackground);
    expect(computedStyle.zIndex).toBe('-1');
  });

  it('should have proper theme integration', () => {
    render(<Index />);
    
    const shaderBackground = screen.getByTestId('enhanced-shader-background');
    
    // Check that shader has proper data attributes for theme integration
    expect(shaderBackground).toHaveAttribute('data-intensity');
    expect(shaderBackground).toHaveAttribute('data-interaction-enabled');
    expect(shaderBackground).toHaveAttribute('data-using-fallback');
  });

  it('should maintain content readability', () => {
    render(<Index />);
    
    // Check that text content is still readable (text might be split across elements)
    const kojiText = screen.getByText('Koji');
    expect(kojiText).toBeInTheDocument();
    expect(kojiText).toBeVisible();
    
    // Check that navigation links are accessible
    const homeLink = screen.getByRole('button', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toBeVisible();
  });
});