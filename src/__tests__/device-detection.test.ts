import { 
  detectDeviceFromUserAgent, 
  detectDeviceFromScreen, 
  getDeviceInfo, 
  getDeviceDetectionResult,
  getFinalDeviceDetection,
  isMobileDevice,
  isDesktopDevice
} from '@/lib/device-detection'
import { MOBILE_BREAKPOINT, MOBILE_USER_AGENTS } from '../lib/constants';

// Mock window object for testing
const mockWindow = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

// Mock navigator for testing
const mockNavigator = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value: userAgent,
  })
}

describe('Device Detection', () => {
  describe('detectDeviceFromUserAgent', () => {
    it('should detect mobile devices from user agent', () => {
      const mobileUserAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
        'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)',
        'Mozilla/5.0 (Linux; Android 10; Mobile)',
        'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900)',
      ]

      mobileUserAgents.forEach(ua => {
        expect(detectDeviceFromUserAgent(ua)).toBe('mobile')
      })
    })

    it('should detect desktop devices from user agent', () => {
      const desktopUserAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
      ]

      desktopUserAgents.forEach(ua => {
        expect(detectDeviceFromUserAgent(ua)).toBe('desktop')
      })
    })
  })

  describe('detectDeviceFromScreen', () => {
    it('should detect mobile devices from screen size', () => {
      mockWindow(375, 667) // iPhone size
      expect(detectDeviceFromScreen()).toBe('mobile')

      mockWindow(414, 896) // iPhone Plus size
      expect(detectDeviceFromScreen()).toBe('mobile')

      mockWindow(360, 640) // Android size
      expect(detectDeviceFromScreen()).toBe('mobile')
    })

    it('should detect desktop devices from screen size', () => {
      mockWindow(1920, 1080) // Desktop size
      expect(detectDeviceFromScreen()).toBe('desktop')

      mockWindow(1366, 768) // Laptop size
      expect(detectDeviceFromScreen()).toBe('desktop')

      mockWindow(800, 600) // Tablet landscape
      expect(detectDeviceFromScreen()).toBe('desktop')
    })

    it('should handle edge case at breakpoint', () => {
      mockWindow(768, 1024) // Exactly at breakpoint
      expect(detectDeviceFromScreen()).toBe('desktop')

      mockWindow(767, 1024) // Just below breakpoint
      expect(detectDeviceFromScreen()).toBe('mobile')
    })
  })

  describe('getDeviceInfo', () => {
    beforeEach(() => {
      mockWindow(1920, 1080)
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    })

    it('should return comprehensive device information', () => {
      const deviceInfo = getDeviceInfo()
      
      expect(deviceInfo).toHaveProperty('type')
      expect(deviceInfo).toHaveProperty('userAgent')
      expect(deviceInfo).toHaveProperty('screenWidth')
      expect(deviceInfo).toHaveProperty('screenHeight')
      expect(deviceInfo.type).toBe('desktop')
      expect(deviceInfo.screenWidth).toBe(1920)
      expect(deviceInfo.screenHeight).toBe(1080)
    })

    it('should accept custom user agent', () => {
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
      const deviceInfo = getDeviceInfo(mobileUA)
      
      expect(deviceInfo.userAgent).toBe(mobileUA)
      expect(deviceInfo.type).toBe('mobile')
    })
  })

  describe('getDeviceDetectionResult', () => {
    it('should return correct detection result for mobile', () => {
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
      const result = getDeviceDetectionResult(mobileUA)
      
      expect(result.isMobile).toBe(true)
      expect(result.isDesktop).toBe(false)
      expect(result.shouldShowMobileInterface).toBe(true)
      expect(result.shouldShowDesktopInterface).toBe(false)
    })

    it('should return correct detection result for desktop', () => {
      const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      const result = getDeviceDetectionResult(desktopUA)
      
      expect(result.isMobile).toBe(false)
      expect(result.isDesktop).toBe(true)
      expect(result.shouldShowMobileInterface).toBe(false)
      expect(result.shouldShowDesktopInterface).toBe(true)
    })
  })

  describe('URL override functionality', () => {
    it('should respect mobile override', () => {
      const result = getFinalDeviceDetection('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '?device=mobile')
      
      expect(result.isMobile).toBe(true)
      expect(result.isDesktop).toBe(false)
    })

    it('should respect desktop override', () => {
      const result = getFinalDeviceDetection('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', '?device=desktop')
      
      expect(result.isMobile).toBe(false)
      expect(result.isDesktop).toBe(true)
    })

    it('should ignore invalid override values', () => {
      const result = getFinalDeviceDetection('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', '?device=invalid')
      
      expect(result.isMobile).toBe(true)
      expect(result.isDesktop).toBe(false)
    })

    it('should work without search string', () => {
      const result = getFinalDeviceDetection('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)', '')
      
      expect(result.isMobile).toBe(true)
      expect(result.isDesktop).toBe(false)
    })
  })

  describe('utility functions', () => {
    it('should correctly identify mobile devices', () => {
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
      expect(isMobileDevice(mobileUA, '')).toBe(true)
      
      const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      expect(isMobileDevice(desktopUA, '')).toBe(false)
    })

    it('should correctly identify desktop devices', () => {
      const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      expect(isDesktopDevice(desktopUA, '')).toBe(true)
      
      const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
      expect(isDesktopDevice(mobileUA, '')).toBe(false)
    })
  })
})

describe('Constants', () => {
  it('should have correct mobile breakpoint', () => {
    // const { MOBILE_BREAKPOINT } = require('../lib/constants')
    expect(MOBILE_BREAKPOINT).toBe(768)
  })

  it('should have mobile user agents defined', () => {
    // const { MOBILE_USER_AGENTS } = require('../lib/constants')
    expect(Array.isArray(MOBILE_USER_AGENTS)).toBe(true)
    expect(MOBILE_USER_AGENTS.length).toBeGreaterThan(0)
    expect(MOBILE_USER_AGENTS).toContain('Mobile')
    expect(MOBILE_USER_AGENTS).toContain('iPhone')
    expect(MOBILE_USER_AGENTS).toContain('Android')
  })
})