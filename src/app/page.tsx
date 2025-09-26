'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {
  const { deviceInfo, detectionResult, isLoading } = useDeviceDetection()

  useEffect(() => {
    // This page should normally not be seen due to middleware routing
    // But it's useful for testing and debugging
    console.log('Root page accessed - Device info:', deviceInfo)
    console.log('Root page accessed - Detection result:', detectionResult)
  }, [deviceInfo, detectionResult])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Detecting device...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Automated Store Frontend
          </h1>
          <p className="text-xl text-gray-600">
            Device Detection & Routing System
          </p>
        </div>

        {/* Device Detection Results */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Device Detection Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Device Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Device Type:</span>
                  <span className={`font-semibold ${
                    deviceInfo.type === 'mobile' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {deviceInfo.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Screen Size:</span>
                  <span className="font-medium">
                    {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User Agent:</span>
                  <span className="font-medium text-xs truncate max-w-48" title={deviceInfo.userAgent}>
                    {deviceInfo.userAgent.substring(0, 30)}...
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Routing Decision
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Is Mobile:</span>
                  <span className={`font-semibold ${
                    detectionResult.isMobile ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {detectionResult.isMobile ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Is Desktop:</span>
                  <span className={`font-semibold ${
                    detectionResult.isDesktop ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {detectionResult.isDesktop ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended Interface:</span>
                  <span className="font-semibold text-indigo-600">
                    {detectionResult.shouldShowMobileInterface ? 'Mobile Scanner' : 'Desktop Display'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interface Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Mobile Interface */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Mobile Interface
              </h3>
              <p className="text-gray-600 mt-2">
                QR Scanner for mobile devices
              </p>
            </div>
            <Link
              href="/mobile"
              className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Mobile Scanner
            </Link>
          </div>

          {/* Desktop Interface */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🖥️</div>
              <h3 className="text-xl font-semibold text-gray-900">
                Desktop Interface
              </h3>
              <p className="text-gray-600 mt-2">
                QR Display for desktop/monitor devices
              </p>
            </div>
            <Link
              href="/desktop"
              className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Go to Desktop Display
            </Link>
          </div>
        </div>

        {/* Automatic Routing Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔄 Automatic Routing
          </h3>
          <p className="text-blue-800 mb-4">
            Normally, you would be automatically redirected to the{' '}
            <strong>
              {detectionResult.shouldShowMobileInterface ? 'Mobile Scanner' : 'Desktop Display'}
            </strong>{' '}
            interface based on your device type.
          </p>
          <p className="text-blue-700 text-sm">
            This page is shown for testing and debugging purposes. In production, 
            users would be automatically routed to the appropriate interface.
          </p>
        </div>

        {/* URL Override Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🔧 Manual Override
          </h3>
          <p className="text-gray-700 mb-4">
            You can manually override device detection using URL parameters:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <code className="bg-gray-200 px-2 py-1 rounded">?device=mobile</code>
              <span className="text-gray-600">Force mobile interface</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-200 px-2 py-1 rounded">?device=desktop</code>
              <span className="text-gray-600">Force desktop interface</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
