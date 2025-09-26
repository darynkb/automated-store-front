'use client';

import { useEffect, useCallback } from 'react';
import { usePickupState } from '@/hooks/usePickupState';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import { PickupProgressIndicator } from './PickupProgressIndicator';
import { PickupSteps } from './PickupSteps';
import { PickupConfirmation } from './PickupConfirmation';

interface PickupFlowProps {
  scanResult: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function PickupFlow({ scanResult, onComplete, onCancel }: PickupFlowProps) {
  const {
    pickup,
    startPickupProcess,
    completePickupProcess,
    resetPickupState,
    setPickupError,
  } = usePickupState();

  // Start pickup process when component mounts
  useEffect(() => {
    if (scanResult && pickup.status === 'idle') {
      handleStartPickup();
    }
  }, [scanResult, pickup.status]);

  const handleStartPickup = useCallback(async () => {
    try {
      await startPickupProcess(scanResult);
    } catch (error) {
      setPickupError('Failed to start pickup process. Please try again.');
    }
  }, [scanResult, startPickupProcess, setPickupError]);

  const handleCompletePickup = useCallback(async () => {
    try {
      await completePickupProcess();
      onComplete?.();
    } catch (error) {
      setPickupError('Failed to complete pickup. Please try again.');
    }
  }, [completePickupProcess, onComplete, setPickupError]);

  const handleCancel = useCallback(() => {
    resetPickupState();
    onCancel?.();
  }, [resetPickupState, onCancel]);

  // Render different states
  if (pickup.status === 'error') {
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6">
        <Error 
          message={pickup.message || 'An error occurred during pickup'}
          onRetry={handleStartPickup}
        />
        <div className="mt-4">
          <Button
            onClick={handleCancel}
            variant="dark"
            className="w-full"
          >
            Cancel and Scan Again
          </Button>
        </div>
      </div>
    );
  }

  if (pickup.status === 'success') {
    const pickupDetails = {
      pickupId: pickup.pickupId || 'N/A',
      scanId: scanResult,
      completedAt: new Date(),
      estimatedTime: 45, // Mock processing time
      items: [
        { name: 'Sample Item 1', quantity: 2, price: 12.99 },
        { name: 'Sample Item 2', quantity: 1, price: 8.50 },
      ],
      totalAmount: 34.48,
    };

    return (
      <PickupConfirmation
        pickupDetails={pickupDetails}
        onStartNew={handleCancel}
        onViewReceipt={() => {
          // TODO: Implement receipt viewing
          console.log('View receipt clicked');
        }}
      />
    );
  }

  // Processing states (scanning, processing)
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {pickup.status === 'scanning' ? 'Processing Scan...' : 'Pickup in Progress'}
        </h3>

        {/* Progress indicator */}
        <div className="mb-6">
          <PickupProgressIndicator
            progress={pickup.progress}
            status={pickup.status === 'idle' ? 'scanning' : pickup.status}
            message={pickup.message || 'Processing your request...'}
          />
          
          {/* Loading animation for active processing */}
          {pickup.status === 'processing' && pickup.progress < 100 && (
            <div className="flex justify-center mt-4">
              <Loading size="sm" />
            </div>
          )}
        </div>

        {/* Status steps */}
        <div className="mb-6">
          <PickupSteps
            currentProgress={pickup.progress}
            status={pickup.status === 'idle' ? 'scanning' : pickup.status}
          />
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {pickup.status === 'processing' && pickup.progress >= 100 && (
            <Button
              onClick={handleCompletePickup}
              className="w-full"
            >
              Complete Pickup
            </Button>
          )}
          
          <Button
            onClick={handleCancel}
            variant="dark"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}