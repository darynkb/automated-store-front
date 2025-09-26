'use client';

import { useCallback } from 'react';
import { useAppState } from './useAppState';

/**
 * Custom hook specifically for pickup state management
 */
export function usePickupState() {
  const {
    state,
    setPickupState,
    resetPickupState,
    startPickup,
    updatePickupProgress,
    completePickup,
    failPickup,
  } = useAppState();

  const { pickup } = state;

  // Derived state
  const isIdle = pickup.status === 'idle';
  const isProcessing = pickup.status === 'processing';
  const isSuccess = pickup.status === 'success';
  const isError = pickup.status === 'error';
  const isActive = isProcessing || pickup.status === 'scanning';

  // API integration actions
  const startPickupProcess = useCallback(async (scanResult: string) => {
    try {
      // First, validate the scan result with the API
      const scanResponse = await fetch('/api/scan/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode: scanResult }),
      });

      const scanData = await scanResponse.json();

      if (!scanData.success) {
        throw new Error(scanData.error?.message || 'Invalid QR code');
      }

      // Start the pickup process
      const pickupResponse = await fetch('/api/pickup/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scanId: scanData.data.scanId }),
      });

      const pickupData = await pickupResponse.json();

      if (!pickupData.success) {
        throw new Error(pickupData.error?.message || 'Failed to start pickup');
      }

      // Start the pickup with the returned pickup ID
      startPickup(pickupData.data.pickupId);

      // Simulate pickup process with progress updates
      await simulatePickupProgress();

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during pickup';
      failPickup(message);
    }
  }, [startPickup, failPickup]);

  const simulatePickupProgress = useCallback(async () => {
    const steps = [
      { progress: 15, message: 'Validating QR code...', delay: 800 },
      { progress: 30, message: 'Checking inventory...', delay: 1200 },
      { progress: 50, message: 'Locating your items...', delay: 1800 },
      { progress: 70, message: 'Preparing for pickup...', delay: 1500 },
      { progress: 85, message: 'Finalizing order...', delay: 1000 },
      { progress: 100, message: 'Pickup ready!', delay: 500 },
    ];

    try {
      for (const step of steps) {
        // Check if pickup was cancelled during processing
        if (pickup.status === 'idle') {
          return;
        }

        await new Promise(resolve => setTimeout(resolve, step.delay));
        updatePickupProgress(step.progress, step.message);
      }

      // Wait a moment before showing completion
      setTimeout(() => {
        // Final check if pickup wasn't cancelled
        if (pickup.status !== 'idle') {
          completePickup('Your items are ready for pickup! Please collect them from the designated area.');
        }
      }, 1000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during pickup. Please try again or contact support.';
      failPickup(message);
    }
  }, [pickup.status, updatePickupProgress, completePickup, failPickup]);

  const completePickupProcess = useCallback(async () => {
    try {
      if (!pickup.pickupId) {
        throw new Error('No pickup ID available');
      }

      const response = await fetch('/api/pickup/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pickupId: pickup.pickupId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to complete pickup');
      }

      completePickup('Pickup completed successfully! Thank you for using our automated store.');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete pickup';
      failPickup(message);
    }
  }, [pickup.pickupId, completePickup, failPickup]);

  const retryPickup = useCallback(() => {
    if (pickup.pickupId) {
      simulatePickupProgress();
    }
  }, [pickup.pickupId, simulatePickupProgress]);

  const cancelPickup = useCallback(() => {
    resetPickupState();
  }, [resetPickupState]);

  const checkPickupStatus = useCallback(async (pickupId: string) => {
    try {
      const response = await fetch(`/api/pickup/status?pickupId=${pickupId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to check pickup status');
      }

      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to check pickup status';
      console.error('Pickup status check failed:', message);
      return null;
    }
  }, []);

  const refreshPickupStatus = useCallback(async () => {
    if (!pickup.pickupId) return;

    const status = await checkPickupStatus(pickup.pickupId);
    if (status) {
      // Update local state based on API response
      updatePickupProgress(status.progress || pickup.progress, status.message || pickup.message);
      
      if (status.status === 'completed' && pickup.status !== 'success') {
        completePickup(status.message || 'Pickup completed successfully!');
      } else if (status.status === 'failed' && pickup.status !== 'error') {
        failPickup(status.message || 'Pickup failed');
      }
    }
  }, [pickup.pickupId, pickup.progress, pickup.message, pickup.status, checkPickupStatus, updatePickupProgress, completePickup, failPickup]);

  return {
    // State
    pickup,
    isIdle,
    isProcessing,
    isSuccess,
    isError,
    isActive,
    
    // Actions
    setPickupState,
    resetPickupState,
    startPickup, // Direct pickup start (from useAppState)
    startPickupProcess, // Full pickup process with API calls
    updatePickupProgress,
    completePickup, // Direct completion (from useAppState)
    completePickupProcess, // Full completion process with API calls
    setPickupError: failPickup,
    failPickup, // Alias for backward compatibility
    retryPickup,
    cancelPickup,
    checkPickupStatus,
    refreshPickupStatus,
  };
}