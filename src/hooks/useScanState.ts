'use client';

import { useCallback } from 'react';
import { useAppState } from './useAppState';

/**
 * Custom hook specifically for scan state management
 */
export function useScanState() {
  const {
    state,
    setScanState,
    resetScanState,
    startScanning,
    stopScanning,
    setScanResult,
    setScanError,
    setCameraPermission,
  } = useAppState();

  const { scan } = state;

  // Derived state
  const canScan = scan.cameraPermission === 'granted' && !scan.isScanning;
  const hasError = !!scan.error;
  const hasResult = !!scan.scanResult;

  // Complex actions
  const handleScanSuccess = useCallback((result: string) => {
    setScanResult(result);
    // You could add additional logic here like validation
  }, [setScanResult]);

  const handleScanError = useCallback((error: string) => {
    setScanError(error);
    stopScanning();
  }, [setScanError, stopScanning]);

  const requestCameraPermission = useCallback(async () => {
    try {
      setCameraPermission('pending');
      
      // Request camera permission
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        setCameraPermission('denied');
        setScanError('Media devices not available');
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission('granted');
      return true;
    } catch {
      setCameraPermission('denied');
      setScanError('Camera access denied. Please enable camera permissions to scan QR codes.');
      return false;
    }
  }, [setCameraPermission, setScanError]);

  const initializeScanner = useCallback(async () => {
    if (scan.cameraPermission === 'pending') {
      const granted = await requestCameraPermission();
      return granted;
    }
    return scan.cameraPermission === 'granted';
  }, [scan.cameraPermission, requestCameraPermission]);

  return {
    // State
    scan,
    canScan,
    hasError,
    hasResult,
    
    // Actions
    setScanState,
    resetScanState,
    startScanning,
    stopScanning,
    setScanResult,
    setScanError,
    setCameraPermission,
    handleScanSuccess,
    handleScanError,
    requestCameraPermission,
    initializeScanner,
  };
}