import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading, LoadingSpinner, LoadingDots, LoadingOverlay } from '@/components/shared/Loading';

describe('Loading Component', () => {
  it('renders spinner variant by default', () => {
    render(<Loading />);
    const spinner = document.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with message', () => {
    render(<Loading message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(<Loading variant="dots" />);
    expect(document.querySelector('.flex.space-x-1')).toBeInTheDocument();

    rerender(<Loading variant="pulse" />);
    expect(document.querySelector('.animate-pulse-slow')).toBeInTheDocument();

    rerender(<Loading variant="bars" />);
    expect(document.querySelector('.flex.items-end.space-x-1')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Loading size="sm" />);
    expect(document.querySelector('.h-4.w-4')).toBeInTheDocument();

    rerender(<Loading size="lg" />);
    expect(document.querySelector('.h-12.w-12')).toBeInTheDocument();
  });

  it('renders overlay variant', () => {
    render(<Loading overlay message="Loading..." />);
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('bg-white/80', 'backdrop-blur-sm');
  });

  it('applies custom className', () => {
    render(<Loading className="custom-loading" />);
    expect(document.querySelector('.custom-loading')).toBeInTheDocument();
  });
});

describe('Loading Convenience Components', () => {
  it('LoadingSpinner renders spinner variant', () => {
    render(<LoadingSpinner />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('LoadingDots renders dots variant', () => {
    render(<LoadingDots />);
    expect(document.querySelector('.flex.space-x-1')).toBeInTheDocument();
  });

  it('LoadingOverlay renders with overlay', () => {
    render(<LoadingOverlay message="Loading..." />);
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });
});