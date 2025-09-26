import { type ClassValue, clsx } from "clsx"

/**
 * Utility function to merge class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Utility function to format dates
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Utility function to generate unique IDs
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Utility function to delay execution (for simulating API calls)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Utility function to format time duration
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

/**
 * Utility function to check if code is running on client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Utility function to get environment variable
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  if (isClient()) {
    // Client-side environment variables must be prefixed with NEXT_PUBLIC_
    return process.env[`NEXT_PUBLIC_${key}`] || defaultValue || ''
  }
  return process.env[key] || defaultValue || ''
}

/**
 * Utility function to check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Utility function to check if mock API should be used
 */
export function shouldUseMockApi(): boolean {
  return getEnvVar('MOCK_API', 'true') === 'true'
}