import { DeviceInfo, DeviceDetectionResult } from '@/types'
import { MOBILE_BREAKPOINT, MOBILE_USER_AGENTS } from './constants'

/**
 * Server-side device detection using user-agent string
 */
export function detectDeviceFromUserAgent(userAgent: string): 'mobile' | 'desktop' {
  const ua = userAgent.toLowerCase()
  
  // Check for mobile user agents
  const isMobile = MOBILE_USER_AGENTS.some(agent => 
    ua.includes(agent.toLowerCase())
  )
  
  return isMobile ? 'mobile' : 'desktop'
}

/**
 * Client-side device detection using screen dimensions
 */
export function detectDeviceFromScreen(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop' // Default for SSR
  }
  
  const screenWidth = window.innerWidth
  return screenWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop'
}

/**
 * Get comprehensive device information
 */
export function getDeviceInfo(userAgent?: string): DeviceInfo {
  const isClient = typeof window !== 'undefined'
  
  // Get user agent
  const ua = userAgent || (isClient ? navigator.userAgent : '')
  
  // Get screen dimensions
  const screenWidth = isClient ? window.innerWidth : 1920
  const screenHeight = isClient ? window.innerHeight : 1080
  
  // Determine device type - if userAgent is explicitly provided, use it
  // Otherwise, prefer client-side detection when available
  let deviceType: 'mobile' | 'desktop'
  
  if (userAgent) {
    // Explicit user agent provided, use server-side detection
    deviceType = detectDeviceFromUserAgent(userAgent)
  } else if (isClient) {
    // No explicit user agent, use client-side detection
    deviceType = detectDeviceFromScreen()
  } else {
    // SSR fallback
    deviceType = detectDeviceFromUserAgent(ua)
  }
  
  return {
    type: deviceType,
    userAgent: ua,
    screenWidth,
    screenHeight,
  }
}

/**
 * Get device detection result with routing information
 */
export function getDeviceDetectionResult(userAgent?: string): DeviceDetectionResult {
  const deviceInfo = getDeviceInfo(userAgent)
  const isMobile = deviceInfo.type === 'mobile'
  const isDesktop = deviceInfo.type === 'desktop'
  
  return {
    isMobile,
    isDesktop,
    shouldShowMobileInterface: isMobile,
    shouldShowDesktopInterface: isDesktop,
  }
}

/**
 * Check if device type override is requested via URL parameters
 */
export function getDeviceOverride(searchString?: string): 'mobile' | 'desktop' | null {
  let search: string
  
  if (searchString !== undefined) {
    search = searchString
  } else if (typeof window !== 'undefined') {
    search = window.location.search
  } else {
    return null
  }
  
  const urlParams = new URLSearchParams(search)
  const deviceParam = urlParams.get('device')
  
  if (deviceParam === 'mobile' || deviceParam === 'desktop') {
    return deviceParam
  }
  
  return null
}

/**
 * Get final device detection result with override support
 */
export function getFinalDeviceDetection(userAgent?: string, searchString?: string): DeviceDetectionResult {
  const override = getDeviceOverride(searchString)
  
  if (override) {
    const isMobile = override === 'mobile'
    const isDesktop = override === 'desktop'
    
    return {
      isMobile,
      isDesktop,
      shouldShowMobileInterface: isMobile,
      shouldShowDesktopInterface: isDesktop,
    }
  }
  
  return getDeviceDetectionResult(userAgent)
}

/**
 * Utility to check if current device is mobile
 */
export function isMobileDevice(userAgent?: string, searchString?: string): boolean {
  return getFinalDeviceDetection(userAgent, searchString).isMobile
}

/**
 * Utility to check if current device is desktop
 */
export function isDesktopDevice(userAgent?: string, searchString?: string): boolean {
  return getFinalDeviceDetection(userAgent, searchString).isDesktop
}

