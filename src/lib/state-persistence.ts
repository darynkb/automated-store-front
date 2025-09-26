'use client';

import { AppState } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  APP_STATE: 'automated-store-app-state',
  DEVICE_INFO: 'automated-store-device-info',
  SCAN_STATE: 'automated-store-scan-state',
  PICKUP_STATE: 'automated-store-pickup-state',
  DISPLAY_STATE: 'automated-store-display-state',
  SYSTEM_STATE: 'automated-store-system-state',
} as const;

// Storage configuration
interface StorageConfig {
  persistScanState: boolean;
  persistPickupState: boolean;
  persistDisplayState: boolean;
  persistSystemState: boolean;
  persistDeviceInfo: boolean;
  storageType: 'localStorage' | 'sessionStorage';
}

const DEFAULT_CONFIG: StorageConfig = {
  persistScanState: false, // Don't persist scan state for security
  persistPickupState: true, // Persist pickup state to handle page refreshes
  persistDisplayState: true, // Persist display state
  persistSystemState: true, // Persist system state
  persistDeviceInfo: true, // Persist device info
  storageType: 'localStorage',
};

/**
 * Utility class for state persistence
 */
export class StatePersistence {
  private config: StorageConfig;
  private storage: Storage | null = null;

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Initialize storage if available
    if (typeof window !== 'undefined') {
      this.storage = this.config.storageType === 'localStorage' 
        ? window.localStorage 
        : window.sessionStorage;
    }
  }

  /**
   * Check if storage is available
   */
  private isStorageAvailable(): boolean {
    return this.storage !== null;
  }

  /**
   * Safely parse JSON from storage
   */
  private safeParseJSON<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('Failed to parse stored state:', error);
      return fallback;
    }
  }

  /**
   * Safely stringify and store data
   */
  private safeStore(key: string, data: unknown): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      this.storage!.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Failed to store state:', error);
      return false;
    }
  }

  /**
   * Save complete app state
   */
  saveAppState(state: AppState): boolean {
    if (!this.isStorageAvailable()) return false;

    const stateToSave: Partial<AppState> = {};

    // Only save configured parts of the state
    if (this.config.persistDeviceInfo) {
      stateToSave.device = state.device;
    }

    if (this.config.persistScanState) {
      stateToSave.scan = state.scan;
    }

    if (this.config.persistPickupState) {
      stateToSave.pickup = state.pickup;
    }

    if (this.config.persistDisplayState) {
      stateToSave.display = {
        ...state.display,
        lastUpdate: new Date(), // Update timestamp
      };
    }

    if (this.config.persistSystemState) {
      stateToSave.system = state.system;
    }

    return this.safeStore(STORAGE_KEYS.APP_STATE, stateToSave);
  }

  /**
   * Load complete app state
   */
  loadAppState(): Partial<AppState> | null {
    if (!this.isStorageAvailable()) return null;

    const stored = this.storage!.getItem(STORAGE_KEYS.APP_STATE);
    return this.safeParseJSON(stored, null);
  }

  /**
   * Save individual state parts
   */
  saveDeviceInfo(deviceInfo: AppState['device']): boolean {
    return this.config.persistDeviceInfo 
      ? this.safeStore(STORAGE_KEYS.DEVICE_INFO, deviceInfo)
      : false;
  }

  saveScanState(scanState: AppState['scan']): boolean {
    return this.config.persistScanState 
      ? this.safeStore(STORAGE_KEYS.SCAN_STATE, scanState)
      : false;
  }

  savePickupState(pickupState: AppState['pickup']): boolean {
    return this.config.persistPickupState 
      ? this.safeStore(STORAGE_KEYS.PICKUP_STATE, pickupState)
      : false;
  }

  saveDisplayState(displayState: AppState['display']): boolean {
    return this.config.persistDisplayState 
      ? this.safeStore(STORAGE_KEYS.DISPLAY_STATE, {
          ...displayState,
          lastUpdate: new Date(),
        })
      : false;
  }

  saveSystemState(systemState: AppState['system']): boolean {
    return this.config.persistSystemState 
      ? this.safeStore(STORAGE_KEYS.SYSTEM_STATE, systemState)
      : false;
  }

  /**
   * Load individual state parts
   */
  loadDeviceInfo(): AppState['device'] | null {
    if (!this.isStorageAvailable() || !this.config.persistDeviceInfo) return null;
    
    const stored = this.storage!.getItem(STORAGE_KEYS.DEVICE_INFO);
    return this.safeParseJSON(stored, null);
  }

  loadScanState(): AppState['scan'] | null {
    if (!this.isStorageAvailable() || !this.config.persistScanState) return null;
    
    const stored = this.storage!.getItem(STORAGE_KEYS.SCAN_STATE);
    return this.safeParseJSON(stored, null);
  }

  loadPickupState(): AppState['pickup'] | null {
    if (!this.isStorageAvailable() || !this.config.persistPickupState) return null;
    
    const stored = this.storage!.getItem(STORAGE_KEYS.PICKUP_STATE);
    return this.safeParseJSON(stored, null);
  }

  loadDisplayState(): AppState['display'] | null {
    if (!this.isStorageAvailable() || !this.config.persistDisplayState) return null;
    
    const stored = this.storage!.getItem(STORAGE_KEYS.DISPLAY_STATE);
    return this.safeParseJSON(stored, null);
  }

  loadSystemState(): AppState['system'] | null {
    if (!this.isStorageAvailable() || !this.config.persistSystemState) return null;
    
    const stored = this.storage!.getItem(STORAGE_KEYS.SYSTEM_STATE);
    return this.safeParseJSON(stored, null);
  }

  /**
   * Clear stored state
   */
  clearAppState(): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.storage!.removeItem(key);
      });
      return true;
    } catch (error) {
      console.warn('Failed to clear stored state:', error);
      return false;
    }
  }

  clearScanState(): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      this.storage!.removeItem(STORAGE_KEYS.SCAN_STATE);
      return true;
    } catch (error) {
      console.warn('Failed to clear scan state:', error);
      return false;
    }
  }

  clearPickupState(): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      this.storage!.removeItem(STORAGE_KEYS.PICKUP_STATE);
      return true;
    } catch (error) {
      console.warn('Failed to clear pickup state:', error);
      return false;
    }
  }

  /**
   * Get storage info
   */
  getStorageInfo(): {
    isAvailable: boolean;
    type: string;
    keys: string[];
    size: number;
  } {
    if (!this.isStorageAvailable()) {
      return {
        isAvailable: false,
        type: 'none',
        keys: [],
        size: 0,
      };
    }

    const keys = Object.values(STORAGE_KEYS).filter(key => 
      this.storage!.getItem(key) !== null
    );

    const size = keys.reduce((total, key) => {
      const value = this.storage!.getItem(key);
      return total + (value ? value.length : 0);
    }, 0);

    return {
      isAvailable: true,
      type: this.config.storageType,
      keys,
      size,
    };
  }
}

// Default instance
export const statePersistence = new StatePersistence();

// Hook for using state persistence
export function useStatePersistence(config?: Partial<StorageConfig>) {
  const persistence = config ? new StatePersistence(config) : statePersistence;
  
  return persistence;
}