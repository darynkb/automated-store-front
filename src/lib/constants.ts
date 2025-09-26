// API Configuration
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api'
export const STORE_ID = process.env.STORE_ID || 'store_001'
export const QR_CODE_URL = process.env.QR_CODE_URL || 'https://automated-store.local'

// Device Detection
export const MOBILE_BREAKPOINT = 768
export const MOBILE_USER_AGENTS = [
  'Mobile',
  'Android',
  'iPhone',
  'iPad',
  'iPod',
  'BlackBerry',
  'Windows Phone'
]

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const

// API Timeouts (in milliseconds)
export const API_TIMEOUT = {
  FAST: 5000,
  NORMAL: 10000,
  SLOW: 30000,
} as const

// Pickup Process
export const PICKUP_STEPS = [
  'scanning',
  'validating',
  'processing',
  'retrieving',
  'opening',
  'waiting',
  'completed'
] as const

export const PICKUP_STEP_MESSAGES = {
  scanning: 'Scanning QR code...',
  validating: 'Validating request...',
  processing: 'Processing pickup...',
  retrieving: 'Retrieving your parcel...',
  opening: 'Opening compartment...',
  waiting: 'Please take your parcel',
  completed: 'Pickup completed successfully!'
} as const

// System Status
export const SYSTEM_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  CAMERA_ACCESS_DENIED: 'Camera access is required to scan QR codes. Please enable camera permissions.',
  QR_SCAN_FAILED: 'Failed to scan QR code. Please try again.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  INVALID_QR_CODE: 'Invalid QR code. Please scan a valid store QR code.',
  PICKUP_FAILED: 'Pickup process failed. Please try again or contact support.',
  SYSTEM_OFFLINE: 'System is currently offline. Please try again later.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  QR_SCANNED: 'QR code scanned successfully!',
  PICKUP_STARTED: 'Pickup process started',
  PICKUP_COMPLETED: 'Pickup completed successfully!',
  SYSTEM_READY: 'System is ready',
} as const

// Store Information
export const STORE_INFO = {
  name: 'Automated Store',
  location: 'Main Location',
  instructions: {
    en: 'Scan the QR code with your mobile device to start pickup process',
    kz: 'Алу процесін бастау үшін мобильді құрылғыңызбен QR кодын сканерлеңіз'
  },
  operatingHours: '24/7',
} as const

// QR Code Configuration
export const QR_CODE_CONFIG = {
  size: 256,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  errorCorrectionLevel: 'M' as const,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  DEVICE_INFO: 'automated-store-device-info',
  USER_PREFERENCES: 'automated-store-preferences',
  PICKUP_HISTORY: 'automated-store-pickup-history',
} as const

// Event Names
export const EVENTS = {
  QR_SCANNED: 'qr-scanned',
  PICKUP_STARTED: 'pickup-started',
  PICKUP_COMPLETED: 'pickup-completed',
  ERROR_OCCURRED: 'error-occurred',
  DEVICE_DETECTED: 'device-detected',
} as const