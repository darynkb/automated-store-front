import { StatePersistence } from '@/lib/state-persistence';
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

describe('StatePersistence', () => {
  let persistence: StatePersistence;

  beforeEach(() => {
    jest.clearAllMocks();
    persistence = new StatePersistence();
  });

  describe('Storage availability', () => {
    it('should detect when storage is available', () => {
      const info = persistence.getStorageInfo();
      expect(info.isAvailable).toBe(true);
      expect(info.type).toBe('localStorage');
    });
  });

  describe('State saving and loading', () => {
    const mockState: AppState = {
      device: {
        type: 'mobile',
        userAgent: 'test-agent',
        screenWidth: 375,
        screenHeight: 667,
      },
      scan: {
        isScanning: false,
        scanResult: null,
        error: null,
        cameraPermission: 'granted',
      },
      pickup: {
        status: 'idle',
        pickupId: null,
        progress: 0,
        message: '',
      },
      display: {
        qrCode: 'test-qr',
        storeInfo: {
          name: 'Test Store',
          location: 'Test Location',
          instructions: {
            en: 'Test instructions',
            kz: 'Test instructions KZ',
          },
          operatingHours: '24/7',
        },
        systemStatus: 'online',
        lastUpdate: new Date('2023-01-01'),
      },
      system: {
        status: 'online',
        lastUpdate: new Date('2023-01-01'),
        error: null,
        isLoading: false,
      },
    };

    it('should save and load app state', () => {
      mockStorage.setItem.mockReturnValue(undefined);
      mockStorage.getItem.mockReturnValue(JSON.stringify({
        device: mockState.device,
        pickup: mockState.pickup,
        display: mockState.display,
        system: mockState.system,
      }));

      const saved = persistence.saveAppState(mockState);
      expect(saved).toBe(true);
      expect(mockStorage.setItem).toHaveBeenCalled();

      const loaded = persistence.loadAppState();
      expect(loaded).toBeDefined();
      expect(loaded?.device).toEqual(mockState.device);
    });

    it('should save individual state parts', () => {
      mockStorage.setItem.mockReturnValue(undefined);

      const savedDevice = persistence.saveDeviceInfo(mockState.device);
      expect(savedDevice).toBe(true);

      const savedPickup = persistence.savePickupState(mockState.pickup);
      expect(savedPickup).toBe(true);

      expect(mockStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should load individual state parts', () => {
      mockStorage.getItem.mockReturnValue(JSON.stringify(mockState.device));

      const loaded = persistence.loadDeviceInfo();
      expect(loaded).toEqual(mockState.device);
    });

    it('should handle JSON parse errors gracefully', () => {
      mockStorage.getItem.mockReturnValue('invalid-json');

      const loaded = persistence.loadAppState();
      expect(loaded).toBe(null);
    });

    it('should clear stored state', () => {
      mockStorage.removeItem.mockReturnValue(undefined);

      const cleared = persistence.clearAppState();
      expect(cleared).toBe(true);
      expect(mockStorage.removeItem).toHaveBeenCalledTimes(6); // All storage keys
    });
  });

  describe('Configuration', () => {
    it('should respect configuration settings', () => {
      const customPersistence = new StatePersistence({
        persistScanState: true,
        persistPickupState: false,
      });

      mockStorage.setItem.mockReturnValue(undefined);

      const mockScanState = {
        isScanning: true,
        scanResult: 'test',
        error: null,
        cameraPermission: 'granted' as const,
      };

      const savedScan = customPersistence.saveScanState(mockScanState);
      expect(savedScan).toBe(true);

      const savedPickup = customPersistence.savePickupState({
        status: 'idle',
        pickupId: null,
        progress: 0,
        message: '',
      });
      expect(savedPickup).toBe(false); // Should not save due to config
    });
  });

  describe('Storage info', () => {
    it('should provide storage information', () => {
      mockStorage.getItem.mockImplementation((key) => {
        if (key.includes('device')) return JSON.stringify({ type: 'mobile' });
        return null;
      });

      const info = persistence.getStorageInfo();
      expect(info.isAvailable).toBe(true);
      expect(info.type).toBe('localStorage');
      expect(info.keys.length).toBeGreaterThan(0);
    });
  });
});