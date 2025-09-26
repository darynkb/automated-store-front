import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { CheckCircle, Check, X } from 'lucide-react';

const successVariants = cva(
  'rounded-lg border p-4 animate-fade-in',
  {
    variants: {
      variant: {
        success: 'bg-success-50 border-success-200 text-success-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        minimal: 'bg-transparent border-transparent text-success-600',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-base',
        lg: 'p-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'success',
      size: 'md',
    },
  }
);

export interface SuccessProps extends VariantProps<typeof successVariants> {
  className?: string;
  title?: string;
  message: string;
  details?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const Success: React.FC<SuccessProps> = ({
  variant,
  size,
  className,
  title,
  message,
  details,
  dismissible = false,
  onDismiss,
  icon,
  autoHide = false,
  autoHideDelay = 5000,
}) => {
  React.useEffect(() => {
    if (autoHide && onDismiss) {
      const timer = setTimeout(onDismiss, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, onDismiss]);

  const defaultIcon = <CheckCircle className="h-5 w-5" />;

  return (
    <div className={clsx(successVariants({ variant, size }), className)}>
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
            <p className="text-sm opacity-75">
              {details}
            </p>
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

// Animated checkmark component for success states
export const AnimatedCheckmark: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  return (
    <div className={clsx('relative', sizeClasses[size], className)}>
      <svg
        className="w-full h-full text-success-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="animate-[drawCircle_0.5s_ease-in-out_forwards]"
          style={{
            strokeDasharray: '63',
            strokeDashoffset: '63',
          }}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4"
          className="animate-[drawCheck_0.3s_ease-in-out_0.5s_forwards]"
          style={{
            strokeDasharray: '10',
            strokeDashoffset: '10',
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Success toast notification
export const SuccessToast: React.FC<{
  message: string;
  visible: boolean;
  onClose: () => void;
}> = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <Success
        message={message}
        dismissible
        onDismiss={onClose}
        autoHide
        className="shadow-strong min-w-80"
        icon={<Check className="h-5 w-5" />}
      />
    </div>
  );
};