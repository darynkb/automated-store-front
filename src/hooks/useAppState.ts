'use client';

import { useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { DeviceInfo, ScanState, PickupState, DisplayState, SystemState } from '@/types';

/**
 * Custom hook for accessing and updating application state
 */
export function useAppState() {
  const { state, dispatch } = useAppContext();

  // Device state actions
  const setDeviceInfo = useCallback((deviceInfo: DeviceInfo) => {
    dispatch({ type: 'SET_DEVICE_INFO', payload: deviceInfo });
  }, [dispatch]);

  // Scan state actions
  const setScanState = useCallback((scanState: Partial<ScanState>) => {
    dispatch({ type: 'SET_SCAN_STATE', payload: scanState });
  }, [dispatch]);

  const resetScanState = useCallback(() => {
    dispatch({ type: 'RESET_SCAN_STATE' });
  }, [dispatch]);

  const startScanning = useCallback(() => {
    dispatch({ type: 'SET_SCAN_STATE', payload: { isScanning: true, error: null } });
  }, [dispatch]);

  const stopScanning = useCallback(() => {
    dispatch({ type: 'SET_SCAN_STATE', payload: { isScanning: false } });
  }, [dispatch]);

  const setScanResult = useCallback((result: string | null) => {
    dispatch({ type: 'SET_SCAN_STATE', payload: { scanResult: result, isScanning: false } });
  }, [dispatch]);

  const setScanError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_SCAN_STATE', payload: { error, isScanning: false } });
  }, [dispatch]);

  const setCameraPermission = useCallback((permission: 'granted' | 'denied' | 'pending' | 'not-requested') => {
    dispatch({ type: 'SET_SCAN_STATE', payload: { cameraPermission: permission } });
  }, [dispatch]);

  // Pickup state actions
  const setPickupState = useCallback((pickupState: Partial<PickupState>) => {
    dispatch({ type: 'SET_PICKUP_STATE', payload: pickupState });
  }, [dispatch]);

  const resetPickupState = useCallback(() => {
    dispatch({ type: 'RESET_PICKUP_STATE' });
  }, [dispatch]);

  const startPickup = useCallback((pickupId: string) => {
    dispatch({ 
      type: 'SET_PICKUP_STATE', 
      payload: { 
        status: 'processing', 
        pickupId, 
        progress: 0,
        message: 'Initiating pickup process...'
      } 
    });
  }, [dispatch]);

  const updatePickupProgress = useCallback((progress: number, message: string) => {
    dispatch({ 
      type: 'SET_PICKUP_STATE', 
      payload: { progress, message } 
    });
  }, [dispatch]);

  const completePickup = useCallback((message: string = 'Pickup completed successfully!') => {
    dispatch({ 
      type: 'SET_PICKUP_STATE', 
      payload: { 
        status: 'success', 
        progress: 100,
        message
      } 
    });
  }, [dispatch]);

  const failPickup = useCallback((message: string = 'Pickup failed. Please try again.') => {
    dispatch({ 
      type: 'SET_PICKUP_STATE', 
      payload: { 
        status: 'error', 
        message
      } 
    });
  }, [dispatch]);

  // Display state actions
  const setDisplayState = useCallback((displayState: Partial<DisplayState>) => {
    dispatch({ type: 'SET_DISPLAY_STATE', payload: displayState });
  }, [dispatch]);

  const updateQRCode = useCallback((qrCode: string) => {
    dispatch({ 
      type: 'SET_DISPLAY_STATE', 
      payload: { qrCode, lastUpdate: new Date() } 
    });
  }, [dispatch]);

  const updateSystemStatus = useCallback((systemStatus: 'online' | 'offline' | 'maintenance') => {
    dispatch({ 
      type: 'SET_DISPLAY_STATE', 
      payload: { systemStatus, lastUpdate: new Date() } 
    });
  }, [dispatch]);

  // System state actions
  const setSystemState = useCallback((systemState: Partial<SystemState>) => {
    dispatch({ type: 'SET_SYSTEM_STATE', payload: systemState });
  }, [dispatch]);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  return {
    // State
    state,
    
    // Device actions
    setDeviceInfo,
    
    // Scan actions
    setScanState,
    resetScanState,
    startScanning,
    stopScanning,
    setScanResult,
    setScanError,
    setCameraPermission,
    
    // Pickup actions
    setPickupState,
    resetPickupState,
    startPickup,
    updatePickupProgress,
    completePickup,
    failPickup,
    
    // Display actions
    setDisplayState,
    updateQRCode,
    updateSystemStatus,
    
    // System actions
    setSystemState,
    setLoading,
    setError,
    clearError,
    resetState,
  };
}