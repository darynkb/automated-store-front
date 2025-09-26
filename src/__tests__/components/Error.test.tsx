import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Error, ErrorMessage, WarningMessage, InfoMessage, ErrorBoundary } from '@/components/shared/Error';

describe('Error Component', () => {
  it('renders with required message', () => {
    render(<Error message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders with title and message', () => {
    render(<Error title="Error Title" message="Error message" />);
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(<Error variant="error" message="Error" />);
    expect(document.querySelector('.bg-error-50')).toBeInTheDocument();

    rerender(<Error variant="warning" message="Warning" />);
    expect(document.querySelector('.bg-warning-50')).toBeInTheDocument();

    rerender(<Error variant="info" message="Info" />);
    expect(document.querySelector('.bg-blue-50')).toBeInTheDocument();
  });

  it('shows details when provided', () => {
    render(<Error message="Error" details="Detailed error information" />);
    expect(screen.getByText('Show details')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Show details'));
    expect(screen.getByText('Detailed error information')).toBeInTheDocument();
  });

  it('handles dismiss functionality', () => {
    const handleDismiss = jest.fn();
    render(<Error message="Error" dismissible onDismiss={handleDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('handles retry functionality', () => {
    const handleRetry = jest.fn();
    render(<Error message="Error" onRetry={handleRetry} retryLabel="Retry Now" />);
    
    const retryButton = screen.getByText('Retry Now');
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Error message="Error" className="custom-error" />);
    expect(document.querySelector('.custom-error')).toBeInTheDocument();
  });
});

describe('Error Convenience Components', () => {
  it('ErrorMessage renders error variant', () => {
    render(<ErrorMessage message="Error message" />);
    expect(document.querySelector('.bg-error-50')).toBeInTheDocument();
  });

  it('WarningMessage renders warning variant', () => {
    render(<WarningMessage message="Warning message" />);
    expect(document.querySelector('.bg-warning-50')).toBeInTheDocument();
  });

  it('InfoMessage renders info variant', () => {
    render(<InfoMessage message="Info message" />);
    expect(document.querySelector('.bg-blue-50')).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const handleError = jest.fn();
    render(
      <ErrorBoundary onError={handleError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(handleError).toHaveBeenCalled();
  });
});