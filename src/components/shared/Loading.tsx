import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const loadingVariants = cva('flex items-center justify-center', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    },
    variant: {
      spinner: '',
      dots: '',
      pulse: '',
      bars: '',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'spinner',
  },
});

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string;
  message?: string;
  overlay?: boolean;
}

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    className={clsx('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const DotsIcon = ({ className }: { className?: string }) => (
  <div className={clsx('flex space-x-1', className)}>
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const PulseIcon = ({ className }: { className?: string }) => (
  <div className={clsx('bg-current rounded-full animate-pulse-slow', className)} />
);

const BarsIcon = ({ className }: { className?: string }) => (
  <div className={clsx('flex items-end space-x-1', className)}>
    <div className="w-1 bg-current rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
    <div className="w-1 bg-current rounded-full animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
    <div className="w-1 bg-current rounded-full animate-pulse" style={{ height: '80%', animationDelay: '300ms' }} />
    <div className="w-1 bg-current rounded-full animate-pulse" style={{ height: '40%', animationDelay: '450ms' }} />
  </div>
);

export const Loading: React.FC<LoadingProps> = ({
  size,
  variant,
  className,
  message,
  overlay = false,
}) => {
  const renderIcon = () => {
    const iconClassName = loadingVariants({ size });
    
    switch (variant) {
      case 'dots':
        return <DotsIcon className={iconClassName} />;
      case 'pulse':
        return <PulseIcon className={iconClassName} />;
      case 'bars':
        return <BarsIcon className={iconClassName} />;
      default:
        return <SpinnerIcon className={iconClassName} />;
    }
  };

  const content = (
    <div className={clsx('flex flex-col items-center space-y-2', className)}>
      <div className="text-primary-600">
        {renderIcon()}
      </div>
      {message && (
        <p className="text-sm text-gray-600 text-center animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        {content}
      </div>
    );
  }

  return content;
};

// Convenience components for common use cases
export const LoadingSpinner: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="spinner" />
);

export const LoadingDots: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading {...props} variant="dots" />
);

export const LoadingOverlay: React.FC<Omit<LoadingProps, 'overlay'>> = (props) => (
  <Loading {...props} overlay={true} />
);