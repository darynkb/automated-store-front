import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { AlertTriangle, XCircle, AlertCircle, X } from 'lucide-react';
import { Button } from './Button';

const errorVariants = cva(
  'rounded-lg border p-4 animate-fade-in',
  {
    variants: {
      variant: {
        error: 'bg-error-50 border-error-200 text-error-800',
        warning: 'bg-warning-50 border-warning-200 text-warning-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-base',
        lg: 'p-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'error',
      size: 'md',
    },
  }
);

export interface ErrorProps extends VariantProps<typeof errorVariants> {
  className?: string;
  title?: string;
  message: string;
  details?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;


}

const getDefaultIcon = (variant: 'error' | 'warning' | 'info' | null | undefined) => {
  switch (variant) {
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />;
    case 'info':
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <XCircle className="h-5 w-5" />;
  }
};

export const Error: React.FC<ErrorProps> = ({
  variant,
  size,
  className,
  title,
  message,
  details,
  dismissible = false,
  onDismiss,
  onRetry,
  retryLabel = 'Try Again',
  icon,
}) => {
  const defaultIcon = getDefaultIcon(variant);

  return (
    <div className={clsx(errorVariants({ variant, size }), className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icon || defaultIcon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="mb-2">
            {message}
          </p>
          {details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm opacity-75 hover:opacity-100">
                Show details
              </summary>
              <pre className="mt-2 text-xs bg-black/5 p-2 rounded overflow-auto">
                {details}
              </pre>
            </details>
          )}
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
              >
                {retryLabel}
              </Button>
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Convenience components for common error types
export const ErrorMessage: React.FC<Omit<ErrorProps, 'variant'>> = (props) => (
  <Error {...props} variant="error" />
);

export const WarningMessage: React.FC<Omit<ErrorProps, 'variant'>> = (props) => (
  <Error {...props} variant="warning" />
);

export const InfoMessage: React.FC<Omit<ErrorProps, 'variant'>> = (props) => (
  <Error {...props} variant="info" />
);

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      return (
        <Error
          title="Something went wrong"
          message="An unexpected error occurred. Please try again."
          details={this.state.error.message}
          onRetry={this.retry}
          dismissible={false}
        />
      );
    }

    return this.props.children;
  }
}