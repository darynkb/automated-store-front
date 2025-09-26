'use client'

import { useState, useEffect, useMemo } from 'react'
import { DeviceInfo } from '@/types'
import { getDeviceInfo, getFinalDeviceDetection } from '@/lib/device-detection'

/**
 * React hook for device detection with real-time updates
 */
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo())
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }
    
    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo())
      setIsLoading(false)
    }
    
    // Initial detection
    updateDeviceInfo()
    
    // Listen for resize events to update screen dimensions
    window.addEventListener('resize', updateDeviceInfo)
    
    // Listen for orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
      // Delay to allow orientation change to complete
      setTimeout(updateDeviceInfo, 100)
    })
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])
  
  const detectionResult = useMemo(() => 
    getFinalDeviceDetection(deviceInfo.userAgent), 
    [deviceInfo]
  )
  
  return {
    deviceInfo,
    detectionResult,
    isLoading,
  }
}