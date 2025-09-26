'use client';

interface PickupProgressIndicatorProps {
  progress: number;
  status: 'scanning' | 'processing' | 'success' | 'error';
  message?: string;
}

export function PickupProgressIndicator({ 
  progress, 
  status, 
  message 
}: PickupProgressIndicatorProps) {
  const getProgressColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'processing':
        return 'text-indigo-600';
      default:
        return 'text-gray-400';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-200';
      case 'error':
        return 'text-red-200';
      case 'processing':
        return 'text-gray-200';
      default:
        return 'text-gray-200';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress */}
      <div className="relative mb-4">
        <div className="w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={getBackgroundColor()}
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className={`${getProgressColor()} transition-all duration-500 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          {/* Progress text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getProgressColor()}`}>
              {status === 'success' ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : status === 'error' ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                `${progress}%`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <p className="text-center text-gray-600 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}