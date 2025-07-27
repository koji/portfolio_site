import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import GoToTopButton from '../GoToTopButton';

// Mock scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

// Mock pageYOffset
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true,
});

// Mock document properties
Object.defineProperty(document.documentElement, 'scrollHeight', {
  value: 2000,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 800,
  writable: true,
});

describe('GoToTopButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when scroll position is below threshold', () => {
    render(<GoToTopButton showAfter={300} />);
    
    // Button should not be visible initially (scroll position is 0)
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render when scroll position is above threshold', async () => {
    render(<GoToTopButton showAfter={300} />);
    
    // Simulate scrolling past threshold
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });
    
    // Trigger scroll event
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  it('should scroll to top when clicked', async () => {
    render(<GoToTopButton showAfter={300} />);
    
    // Simulate scrolling past threshold
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    // Click the button
    fireEvent.click(screen.getByRole('button'));
    
    // Should call scrollTo with smooth behavior
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should scroll to top without smooth behavior when disabled', async () => {
    render(<GoToTopButton showAfter={300} smoothScroll={false} />);
    
    // Simulate scrolling past threshold
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    // Click the button
    fireEvent.click(screen.getByRole('button'));
    
    // Should call scrollTo without smooth behavior
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should handle keyboard navigation', async () => {
    render(<GoToTopButton showAfter={300} />);
    
    // Simulate scrolling past threshold
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    const button = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    
    // Reset mock
    mockScrollTo.mockClear();
    
    // Test Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should have proper accessibility attributes', async () => {
    render(<GoToTopButton showAfter={300} />);
    
    // Simulate scrolling past threshold
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('should update scroll progress correctly', async () => {
    render(<GoToTopButton showAfter={300} showScrollProgress={true} />);
    
    // Simulate scrolling to 50% of the page
    const scrollTop = 600; // 50% of (2000 - 800)
    Object.defineProperty(window, 'pageYOffset', {
      value: scrollTop,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', expect.stringContaining('50%'));
    });
  });

  it('should apply custom className', async () => {
    const customClass = 'custom-go-to-top';
    render(<GoToTopButton showAfter={300} className={customClass} />);
    
    // Simulate scrolling past threshold
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    });
    
    fireEvent.scroll(window);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass(customClass);
    });
  });

  it('should handle rapid scroll events efficiently', async () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    
    render(<GoToTopButton showAfter={300} />);
    
    // Simulate rapid scroll events
    for (let i = 0; i < 10; i++) {
      Object.defineProperty(window, 'pageYOffset', {
        value: 400 + i,
        writable: true,
      });
      fireEvent.scroll(window);
    }
    
    // Should use requestAnimationFrame for throttling
    expect(requestAnimationFrameSpy).toHaveBeenCalled();
    
    requestAnimationFrameSpy.mockRestore();
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<GoToTopButton showAfter={300} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});