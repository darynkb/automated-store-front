'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { useEffect, useState } from 'react'
import { STORE_INFO } from '@/lib/constants'
import { QRDisplay, SystemStatus, BilingualInstructions } from '@/components/desktop'
import { apiClient } from '@/lib/mock-api'
import type { QRDisplayData, StoreInfo } from '@/lib/mock-api'
import axios from "axios";

export default function DesktopPage() {
  const { deviceInfo, detectionResult, isLoading: deviceLoading } = useDeviceDetection()
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [currentQRData, setCurrentQRData] = useState<QRDisplayData | null>(null)

  useEffect(() => {
    // Log device detection for debugging
    console.log('Desktop page - Device info:', deviceInfo)
    console.log('Desktop page - Detection result:', detectionResult)
  }, [deviceInfo, detectionResult])

  useEffect(() => {
    // Fetch store information
    const fetchStoreInfo = async () => {
      try {
        const info = await apiClient.getStoreInfo()
        setStoreInfo(info)
      } catch (error) {
        console.error('Failed to fetch store info:', error)
      }
    }

    fetchStoreInfo()
  }, [])

  const handleQRGenerated = async (qrData: QRDisplayData) => {
    setCurrentQRData(qrData)
  }

  if (deviceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading display interface...</p>
        </div>
      </div>
    )
  }

  const displayStoreInfo = storeInfo || STORE_INFO

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {displayStoreInfo.name}
              </h1>
              <p className="text-gray-600">{displayStoreInfo.location}</p>
            </div>
            <div className="text-right">
              <SystemStatus showDetails={false} />
              <p className="text-sm text-gray-600 mt-1">
                Operating: {displayStoreInfo.operatingHours}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* QR Code Display */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Scan to Start Pickup
              </h2>
              
              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <QRDisplay 
                  size={280}
                  onQRGenerated={handleQRGenerated}
                  className="mx-auto"
                />
              </div>

              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Ready for Pickup
                </p>
                <p className="text-gray-600">
                  Use your mobile device to scan the QR code above
                </p>
                {/* {currentQRData && (
                  <p className="text-xs text-gray-500 mt-2">
                    QR Code refreshes automatically every 30 seconds
                  </p>
                )} */}
              </div>
            </div>

            {/* System Status Details */}
            {/* <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Status
              </h3>
              <SystemStatus showDetails={true} />
            </div> */}
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <BilingualInstructions showLanguageToggle={true} />

            {/* Store Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Store Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="text-blue-600">{displayStoreInfo.location}</p>
                </div>
                <div>
                  <span className="text-gray-600">Operating Hours:</span>
                  <p className="text-blue-600">{displayStoreInfo.operatingHours}</p>
                </div>
                {storeInfo?.contactInfo && (
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <p className="text-blue-600">{storeInfo.contactInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Device Info */}
            {/* <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Display Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Device Type:</span>
                  <p className="font-medium text-blue-600">{deviceInfo.type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Screen Size:</span>
                  <p className="font-medium">
                    {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Interface:</span>
                  <p className="font-medium text-green-600">Desktop Display</p>
                </div>
                <div>
                  <span className="text-gray-600">QR Status:</span>
                  <p className="font-medium text-green-600">
                    {currentQRData ? 'Active' : 'Loading...'}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 bg-gray-100 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Debug Information:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Device Detection:</h4>
                <pre className="text-sm text-gray-600 overflow-x-auto bg-white p-3 rounded">
                  {JSON.stringify({ deviceInfo, detectionResult }, null, 2)}
                </pre>
              </div>
              {currentQRData && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Current QR Data:</h4>
                  <pre className="text-sm text-gray-600 overflow-x-auto bg-white p-3 rounded">
                    {JSON.stringify(currentQRData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}