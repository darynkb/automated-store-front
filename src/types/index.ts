// Device Detection Types
export interface DeviceInfo {
  type: 'mobile' | 'desktop';
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

export interface DeviceDetectionResult {
  isMobile: boolean;
  isDesktop: boolean;
  shouldShowMobileInterface: boolean;
  shouldShowDesktopInterface: boolean;
}

// Scan State Types
export interface ScanState {
  isScanning: boolean;
  scanResult: string | null;
  error: string | null;
  cameraPermission: 'granted' | 'denied' | 'pending' | 'not-requested';
}

// Pickup State Types
export interface PickupState {
  status: 'idle' | 'scanning' | 'processing' | 'success' | 'error';
  pickupId: string | null;
  progress: number;
  message: string;
}

// Display State Types
export interface DisplayState {
  qrCode: string;
  storeInfo: StoreInfo;
  systemStatus: 'online' | 'offline' | 'maintenance';
  lastUpdate: Date;
}

export interface StoreInfo {
  name: string;
  location: string;
  instructions: {
    en: string;
    kz: string;
  };
  operatingHours: string;
}

// System State Types
export interface SystemState {
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: Date;
  error: string | null;
  isLoading: boolean;
}

// Application State
export interface AppState {
  device: DeviceInfo;
  scan: ScanState;
  pickup: PickupState;
  display: DisplayState;
  system: SystemState;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

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

// Mock Data Types
export interface MockDataStore {
  storeInfo: StoreInfo;
  qrCodes: QRCodeData[];
  pickupHistory: PickupRecord[];
  systemStatus: SystemStatusData;
}

export interface QRCodeData {
  id: string;
  code: string;
  storeId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PickupRecord {
  id: string;
  scanId: string;
  status: string;
  timestamp: Date;
  duration: number;
}

export interface SystemStatusData {
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  services: Record<string, boolean>;
}

// Error Types
export enum ErrorType {
  CAMERA_ACCESS_DENIED = 'CAMERA_ACCESS_DENIED',
  QR_SCAN_FAILED = 'QR_SCAN_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_QR_CODE = 'INVALID_QR_CODE',
  PICKUP_FAILED = 'PICKUP_FAILED',
  SYSTEM_OFFLINE = 'SYSTEM_OFFLINE'
}

export interface ErrorState {
  type: ErrorType;
  message: string;
  isRecoverable: boolean;
  retryAction?: () => void;
}

// Environment Configuration
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production';
  MOCK_API: boolean;
  API_BASE_URL: string;
  STORE_ID: string;
  QR_CODE_URL: string;
}