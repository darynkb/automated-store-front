'use client';

import { useCallback, useEffect } from 'react';
import { useAppState } from './useAppState';

/**
 * Custom hook specifically for system state management
 */
export function useSystemState() {
  const {
    state,
    setSystemState,
    setLoading,
    setError,
    clearError,
    updateSystemStatus,
  } = useAppState();

  const { system, display } = state;

  // Derived state
  const isOnline = system.status === 'online';
  const isOffline = system.status === 'offline';
  const isMaintenance = system.status === 'maintenance';
  const hasError = !!system.error;
  const isLoading = system.isLoading;

  // System health check
  const checkSystemHealth = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      // Simulate API call to check system health
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful health check
      const healthStatus = {
        status: 'online' as const,
        lastUpdate: new Date(),
        error: null,
        isLoading: false,
      };

      setSystemState(healthStatus);
      updateSystemStatus('online');
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'System health check failed';
      setError(errorMessage);
      setSystemState({
        status: 'offline',
        lastUpdate: new Date(),
        isLoading: false,
      });
      updateSystemStatus('offline');
      
      return false;
    }
  }, [setLoading, clearError, setSystemState, updateSystemStatus, setError]);

  // Auto health check on mount
  useEffect(() => {
    checkSystemHealth();
  }, [checkSystemHealth]);

  // Periodic health check
  const startHealthMonitoring = useCallback((intervalMs: number = 30000) => {
    const interval = setInterval(() => {
      if (!isLoading) {
        checkSystemHealth();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [checkSystemHealth, isLoading]);

  // Manual system status update
  const setMaintenanceMode = useCallback((message?: string) => {
    setSystemState({
      status: 'maintenance',
      lastUpdate: new Date(),
      error: message || 'System is under maintenance',
    });
    updateSystemStatus('maintenance');
  }, [setSystemState, updateSystemStatus]);

  const setOnlineMode = useCallback(() => {
    setSystemState({
      status: 'online',
      lastUpdate: new Date(),
      error: null,
    });
    updateSystemStatus('online');
  }, [setSystemState, updateSystemStatus]);

  const setOfflineMode = useCallback((reason?: string) => {
    setSystemState({
      status: 'offline',
      lastUpdate: new Date(),
      error: reason || 'System is offline',
    });
    updateSystemStatus('offline');
  }, [setSystemState, updateSystemStatus]);

  // Error handling
  const handleError = useCallback((error: string | Error, shouldGoOffline: boolean = false) => {
    const errorMessage = error instanceof Error ? error.message : error;
    setError(errorMessage);
    
    if (shouldGoOffline) {
      setOfflineMode(errorMessage);
    }
  }, [setError, setOfflineMode]);

  const retryOperation = useCallback(async (operation: () => Promise<void>) => {
    setLoading(true);
    clearError();
    
    try {
      await operation();
      if (system.status === 'offline') {
        setOnlineMode();
      }
    } catch (error) {
      handleError(error as Error, true);
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, system.status, setOnlineMode, handleError]);

  return {
    // State
    system,
    display: display.systemStatus,
    isOnline,
    isOffline,
    isMaintenance,
    hasError,
    isLoading,
    
    // Actions
    setSystemState,
    setLoading,
    setError,
    clearError,
    checkSystemHealth,
    startHealthMonitoring,
    setMaintenanceMode,
    setOnlineMode,
    setOfflineMode,
    handleError,
    retryOperation,
  };
}