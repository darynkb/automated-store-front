import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { AppProvider, useAppState, useScanState, usePickupState, useSystemState } from '@/hooks';
import { AppState } from '@/types';

// Mock localStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
});

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode; initialState?: Partial<AppState> }> = ({ 
  children, 
  initialState 
}) => (
  <AppProvider initialState={initialState}>
    {children}
  </AppProvider>
);

describe('State Management System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AppProvider and useAppState', () => {
    it('should provide initial state', () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: TestWrapper,
      });

      expect(result.current.state.device.type).toBe('desktop');
      expect(result.current.state.scan.isScanning).toBe(false);
      expect(result.current.state.pickup.status).toBe('idle');
      expect(result.current.state.system.status).toBe('online');
    });

    it('should accept custom initial state', () => {
      const customInitialState: Partial<AppState> = {
        device: {
          type: 'mobile',
          userAgent: 'test-agent',
          screenWidth: 375,
          screenHeight: 667,
        },
      };

      const { result } = renderHook(() => useAppState(), {
        wrapper: ({ children }) => (
          <TestWrapper initialState={customInitialState}>
            {children}
          </TestWrapper>
        ),
      });

      expect(result.current.state.device.type).toBe('mobile');
      expect(result.current.state.device.screenWidth).toBe(375);
    });

    it('should update device info', () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: TestWrapper,
      });

      const newDeviceInfo = {
        type: 'mobile' as const,
        userAgent: 'mobile-agent',
        screenWidth: 414,
        screenHeight: 896,
      };

      act(() => {
        result.current.setDeviceInfo(newDeviceInfo);
      });

      expect(result.current.state.device).toEqual(newDeviceInfo);
    });

    it('should handle loading state', () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.state.system.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.state.system.isLoading).toBe(false);
    });

    it('should handle error state', () => {
      const { result } = renderHook(() => useAppState(), {
        wrapper: TestWrapper,
      });

      const errorMessage = 'Test error';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.state.system.error).toBe(errorMessage);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.state.system.error).toBe(null);
    });
  });

  describe('useScanState', () => {
    it('should manage scan state correctly', () => {
      const { result } = renderHook(() => useScanState(), {
        wrapper: TestWrapper,
      });

      expect(result.current.scan.isScanning).toBe(false);
      expect(result.current.canScan).toBe(false); // No camera permission yet

      act(() => {
        result.current.setCameraPermission('granted');
      });

      expect(result.current.canScan).toBe(true);

      act(() => {
        result.current.startScanning();
      });

      expect(result.current.scan.isScanning).toBe(true);
      expect(result.current.canScan).toBe(false); // Can't scan while already scanning

      act(() => {
        result.current.handleScanSuccess('test-qr-code');
      });

      expect(result.current.scan.scanResult).toBe('test-qr-code');
      expect(result.current.scan.isScanning).toBe(false);
      expect(result.current.hasResult).toBe(true);
    });

    it('should handle scan errors', () => {
      const { result } = renderHook(() => useScanState(), {
        wrapper: TestWrapper,
      });

      const errorMessage = 'Scan failed';

      act(() => {
        result.current.handleScanError(errorMessage);
      });

      expect(result.current.scan.error).toBe(errorMessage);
      expect(result.current.scan.isScanning).toBe(false);
      expect(result.current.hasError).toBe(true);
    });

    it('should reset scan state', () => {
      const { result } = renderHook(() => useScanState(), {
        wrapper: TestWrapper,
      });

      // Set some state
      act(() => {
        result.current.setCameraPermission('granted');
        result.current.setScanResult('test-result');
        result.current.setScanError('test-error');
      });

      // Reset
      act(() => {
        result.current.resetScanState();
      });

      expect(result.current.scan.scanResult).toBe(null);
      expect(result.current.scan.error).toBe(null);
      expect(result.current.scan.cameraPermission).toBe('pending');
    });
  });

  describe('usePickupState', () => {
    it('should manage pickup state correctly', () => {
      const { result } = renderHook(() => usePickupState(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isIdle).toBe(true);
      expect(result.current.isProcessing).toBe(false);

      act(() => {
        result.current.startPickup('test-pickup-id');
      });

      expect(result.current.isProcessing).toBe(true);
      expect(result.current.pickup.pickupId).toBe('test-pickup-id');
      expect(result.current.pickup.progress).toBe(0);

      act(() => {
        result.current.updatePickupProgress(50, 'Processing...');
      });

      expect(result.current.pickup.progress).toBe(50);
      expect(result.current.pickup.message).toBe('Processing...');

      act(() => {
        result.current.completePickup('Success!');
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.pickup.progress).toBe(100);
      expect(result.current.pickup.message).toBe('Success!');
    });

    it('should handle pickup failure', () => {
      const { result } = renderHook(() => usePickupState(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.failPickup('Pickup failed');
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.pickup.message).toBe('Pickup failed');
    });

    it('should cancel pickup', () => {
      const { result } = renderHook(() => usePickupState(), {
        wrapper: TestWrapper,
      });

      // Start pickup
      act(() => {
        result.current.startPickup('test-id');
      });

      expect(result.current.isProcessing).toBe(true);

      // Cancel
      act(() => {
        result.current.cancelPickup();
      });

      expect(result.current.isIdle).toBe(true);
      expect(result.current.pickup.pickupId).toBe(null);
    });
  });

  describe('useSystemState', () => {
    it('should manage system state correctly', () => {
      const { result } = renderHook(() => useSystemState(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isOnline).toBe(true);
      expect(result.current.isOffline).toBe(false);

      act(() => {
        result.current.setOfflineMode('Network error');
      });

      expect(result.current.isOffline).toBe(true);
      expect(result.current.system.error).toBe('Network error');

      act(() => {
        result.current.setOnlineMode();
      });

      expect(result.current.isOnline).toBe(true);
      expect(result.current.system.error).toBe(null);
    });

    it('should handle maintenance mode', () => {
      const { result } = renderHook(() => useSystemState(), {
        wrapper: TestWrapper,
      });

      act(() => {
        result.current.setMaintenanceMode('Scheduled maintenance');
      });

      expect(result.current.isMaintenance).toBe(true);
      expect(result.current.system.error).toBe('Scheduled maintenance');
    });

    it('should handle errors', () => {
      const { result } = renderHook(() => useSystemState(), {
        wrapper: TestWrapper,
      });

      const error = new Error('Test error');

      act(() => {
        result.current.handleError(error, true);
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.isOffline).toBe(true);
      expect(result.current.system.error).toBe('Test error');
    });
  });

  describe('Error handling', () => {
    it('should throw error when useAppContext is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppState());
      }).toThrow('useAppContext must be used within an AppProvider');

      consoleSpy.mockRestore();
    });
  });
});