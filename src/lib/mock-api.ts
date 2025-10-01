// Mock API utilities and data store
import { v4 as uuidv4 } from 'uuid';

// Types for mock data
export interface ScanResponse {
  scanId: string;
  isValid: boolean;
  storeId: string;
  availableBoxes: number;
  canProceed: boolean;
}

export interface PickupResponse {
  pickupId: string;
  status: 'initiated' | 'processing' | 'ready' | 'completed';
  estimatedTime: number;
  instructions: string;
  progress: number;
}

export interface SystemStatusResponse {
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  lastUpdate: string;
  services: {
    scanner: boolean;
    display: boolean;
    api: boolean;
  };
}

export interface StoreInfo {
  name: string;
  location: string;
  instructions: {
    en: string;
    kz: string;
  };
  operatingHours: string;
  contactInfo: string;
}

export interface QRDisplayData {
  qrCode: string;
  qrCodeUrl: string;
  displayId: string;
  // expiresAt: string;
}

export interface DisplayConfig {
  refreshInterval: number;
  qrSize: number;
  showInstructions: boolean;
  language: 'en' | 'kz' | 'ru';
  theme: 'light' | 'dark';
}

// Internal data types
interface ScanData extends ScanResponse {
  timestamp: string;
  qrCode: string;
}

interface PickupData extends PickupResponse {
  scanId: string;
  startedAt: string;
  lastUpdate?: string;
  completedAt?: string;
}

// Mock data store class
class MockDataStore {
  private scans: Map<string, ScanData> = new Map();
  private pickups: Map<string, PickupData> = new Map();
  private validQRCodes: Set<string> = new Set();

  constructor() {
    // Initialize with some valid QR codes for testing
    this.validQRCodes.add('STORE_001_BOX_A');
    this.validQRCodes.add('STORE_001_BOX_B');
    this.validQRCodes.add('STORE_001_BOX_C');
    this.validQRCodes.add('TEST_QR_CODE');
  }

  isValidQRCode(qrCode: string): boolean {
    // Simulate QR code validation
    return this.validQRCodes.has(qrCode) || qrCode.startsWith('STORE_001_');
  }

  processScan(qrCode: string): ScanResponse {
    const scanId = uuidv4();
    const scanData = {
      scanId,
      isValid: true,
      storeId: 'STORE_001',
      availableBoxes: Math.floor(Math.random() * 5) + 1,
      canProceed: true,
      timestamp: new Date().toISOString(),
      qrCode
    };

    this.scans.set(scanId, scanData);
    return scanData;
  }

  getScanStatus(scanId: string): ScanData | null {
    return this.scans.get(scanId) || null;
  }

  startPickup(scanId: string): PickupResponse | null {
    const scan = this.scans.get(scanId);
    if (!scan) return null;

    const pickupId = uuidv4();
    const pickup = {
      pickupId,
      scanId,
      status: 'initiated' as const,
      estimatedTime: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
      instructions: 'Please wait while we prepare your items...',
      progress: 0,
      startedAt: new Date().toISOString()
    };

    this.pickups.set(pickupId, pickup);

    // Simulate pickup progress
    this.simulatePickupProgress(pickupId);

    return pickup;
  }

  private simulatePickupProgress(pickupId: string): void {
    const pickup = this.pickups.get(pickupId);
    if (!pickup) return;

    const progressSteps = [
      { progress: 25, status: 'processing', instructions: 'Locating your items...' },
      { progress: 50, status: 'processing', instructions: 'Preparing items for pickup...' },
      { progress: 75, status: 'processing', instructions: 'Moving items to pickup area...' },
      { progress: 100, status: 'ready', instructions: 'Your items are ready! Please collect them from the pickup area.' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= progressSteps.length) {
        clearInterval(interval);
        return;
      }

      const step = progressSteps[stepIndex];
      pickup.progress = step.progress;
      pickup.status = step.status as 'initiated' | 'processing' | 'ready' | 'completed';
      pickup.instructions = step.instructions;
      pickup.lastUpdate = new Date().toISOString();

      this.pickups.set(pickupId, pickup);
      stepIndex++;
    }, 2000); // Update every 2 seconds
  }

  getPickupStatus(pickupId: string): PickupData | null {
    return this.pickups.get(pickupId) || null;
  }

  completePickup(pickupId: string): PickupData | null {
    const pickup = this.pickups.get(pickupId);
    if (!pickup) return null;

    pickup.status = 'completed';
    pickup.completedAt = new Date().toISOString();
    pickup.instructions = 'Pickup completed successfully. Thank you!';
    pickup.progress = 100;

    this.pickups.set(pickupId, pickup);
    return pickup;
  }

  getSystemStatus(): SystemStatusResponse {
    return {
      status: 'online',
      uptime: Math.floor(Math.random() * 86400), // Random uptime in seconds
      lastUpdate: new Date().toISOString(),
      services: {
        scanner: true,
        display: true,
        api: true
      }
    };
  }

  getStoreInfo(): StoreInfo {
    return {
      name: 'Robotized Droneport',
      location: 'EXPO: Demo Location',
      instructions: {
        en: 'Scan the QR code with your mobile device to start the pickup process',
        kz: 'Алу процесін бастау үшін мобильді құрылғыңызбен QR кодын сканерлеңіз'
      },
      operatingHours: '24/7',
      contactInfo: 'business@mignon-robotics.kz'
    };
  }

  generateDisplayQR(): QRDisplayData {
    const displayId = 'kiosk-5678';
    const qrCode = `STORE_001_DISPLAY_${displayId}`;
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes from now

    // Add to valid QR codes
    this.validQRCodes.add(qrCode);

    return {
      qrCode,
      qrCodeUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pickup?code=${qrCode}`,
      displayId,
      // expiresAt
    };
  }

  getDisplayConfig(): DisplayConfig {
    return {
      refreshInterval: 30000, // 30 seconds
      qrSize: 256,
      showInstructions: true,
      language: 'en',
      theme: 'light'
    };
  }
}

// Singleton instance
export const mockDataStore = new MockDataStore();

// Utility function to simulate network delay
export async function simulateDelay(min: number = 100, max: number = 500): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// API client utilities for frontend use
export class MockApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data.data;
  }

  // Scan endpoints
  async scanQR(qrCode: string): Promise<ScanResponse> {
    return this.request<ScanResponse>('/scan/qr', {
      method: 'POST',
      body: JSON.stringify({ qrCode }),
    });
  }

  async getScanStatus(scanId: string): Promise<ScanData> {
    return this.request<ScanData>(`/scan/status?scanId=${scanId}`);
  }

  // Pickup endpoints
  async startPickup(scanId: string): Promise<PickupResponse> {
    return this.request<PickupResponse>('/pickup/start', {
      method: 'POST',
      body: JSON.stringify({ scanId }),
    });
  }

  async getPickupStatus(pickupId: string): Promise<PickupData> {
    return this.request<PickupData>(`/pickup/status?pickupId=${pickupId}`);
  }

  async completePickup(pickupId: string): Promise<PickupData> {
    return this.request<PickupData>('/pickup/complete', {
      method: 'POST',
      body: JSON.stringify({ pickupId }),
    });
  }

  // System endpoints
  async getSystemStatus(): Promise<SystemStatusResponse> {
    return this.request<SystemStatusResponse>('/system/status');
  }

  async getStoreInfo(): Promise<StoreInfo> {
    return this.request<StoreInfo>('/system/info');
  }

  async getHealthStatus(): Promise<{ status: string; uptime: number; version: string; services: Record<string, boolean>; lastHealthCheck: string }> {
    return this.request('/system/health');
  }

  // Display endpoints
  async getDisplayQR(): Promise<QRDisplayData> {
    return this.request<QRDisplayData>('/display/qr');
  }

  async getDisplayConfig(): Promise<DisplayConfig> {
    return this.request<DisplayConfig>('/display/config');
  }
}

// Default API client instance
export const apiClient = new MockApiClient();
