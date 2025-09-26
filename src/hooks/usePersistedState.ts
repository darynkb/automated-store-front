'use client';

import { useEffect, useCallback } from 'react';
import { useAppState } from './useAppState';
import { useStatePersistence } from '@/lib/state-persistence';

/**
 * Custom hook that adds persistence to app state
 */
export function usePersistedState() {
  const { state, setDeviceInfo, setPickupState, setDisplayState, setSystemState } = useAppState();
  const persistence = useStatePersistence();

  // Load persisted state on mount
  useEffect(() => {
    const loadPersistedState = () => {
      try {
        // Load individual state parts
        const deviceInfo = persistence.loadDeviceInfo();
        if (deviceInfo) {
          setDeviceInfo(deviceInfo);
        }

        const pickupState = persistence.loadPickupState();
        if (pickupState) {
          setPickupState(pickupState);
        }

        const displayState = persistence.loadDisplayState();
        if (displayState) {
          setDisplayState(displayState);
        }

        const systemState = persistence.loadSystemState();
        if (systemState) {
          setSystemState(systemState);
        }
      } catch (error) {
        console.warn('Failed to load persisted state:', error);
      }
    };

    loadPersistedState();
  }, [persistence, setDeviceInfo, setPickupState, setDisplayState, setSystemState]);

  // Save state changes
  useEffect(() => {
    persistence.saveDeviceInfo(state.device);
  }, [state.device, persistence]);

  useEffect(() => {
    persistence.savePickupState(state.pickup);
  }, [state.pickup, persistence]);

  useEffect(() => {
    persistence.saveDisplayState(state.display);
  }, [state.display, persistence]);

  useEffect(() => {
    persistence.saveSystemState(state.system);
  }, [state.system, persistence]);

  // Manual save/load functions
  const saveState = useCallback(() => {
    return persistence.saveAppState(state);
  }, [persistence, state]);

  const loadState = useCallback(() => {
    const persistedState = persistence.loadAppState();
    if (persistedState) {
      if (persistedState.device) setDeviceInfo(persistedState.device);
      if (persistedState.pickup) setPickupState(persistedState.pickup);
      if (persistedState.display) setDisplayState(persistedState.display);
      if (persistedState.system) setSystemState(persistedState.system);
    }
    return persistedState;
  }, [persistence, setDeviceInfo, setPickupState, setDisplayState, setSystemState]);

  const clearPersistedState = useCallback(() => {
    return persistence.clearAppState();
  }, [persistence]);

  const getStorageInfo = useCallback(() => {
    return persistence.getStorageInfo();
  }, [persistence]);

  return {
    saveState,
    loadState,
    clearPersistedState,
    getStorageInfo,
  };
}