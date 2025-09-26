'use client';

interface PickupStep {
  id: string;
  label: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface PickupStepsProps {
  currentProgress: number;
  status: 'scanning' | 'processing' | 'success' | 'error';
}

export function PickupSteps({ currentProgress, status }: PickupStepsProps) {
  const steps: PickupStep[] = [
    {
      id: 'validate',
      label: 'QR Code Validated',
      description: 'Verifying your scan',
      isCompleted: currentProgress > 0 || status === 'success',
      isActive: status === 'scanning' || (status === 'processing' && currentProgress <= 25),
    },
    {
      id: 'prepare',
      label: 'Preparing Items',
      description: 'Locating your products',
      isCompleted: currentProgress > 25 || status === 'success',
      isActive: status === 'processing' && currentProgress > 0 && currentProgress <= 50,
    },
    {
      id: 'process',
      label: 'Processing Order',
      description: 'Finalizing your pickup',
      isCompleted: currentProgress > 50 || status === 'success',
      isActive: status === 'processing' && currentProgress > 25 && currentProgress <= 75,
    },
    {
      id: 'ready',
      label: 'Ready for Pickup',
      description: 'Your items are ready',
      isCompleted: currentProgress >= 100 || status === 'success',
      isActive: status === 'processing' && currentProgress > 75,
    },
  ];

  const getStepIcon = (step: PickupStep) => {
    if (step.isCompleted) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }

    if (step.isActive) {
      return (
        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
      );
    }

    return (
      <span className="text-sm font-medium">
        {steps.findIndex(s => s.id === step.id) + 1}
      </span>
    );
  };

  const getStepStyles = (step: PickupStep) => {
    if (step.isCompleted) {
      return {
        container: 'text-green-600',
        circle: 'bg-green-100 border-green-200',
      };
    }

    if (step.isActive) {
      return {
        container: 'text-indigo-600',
        circle: 'bg-indigo-100 border-indigo-200',
      };
    }

    return {
      container: 'text-gray-400',
      circle: 'bg-gray-100 border-gray-200',
    };
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const styles = getStepStyles(step);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-3 top-8 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            {/* Step content */}
            <div className={`flex items-start space-x-3 ${styles.container}`}>
              {/* Step icon */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${styles.circle}`}>
                {getStepIcon(step)}
              </div>
              
              {/* Step details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}