'use client'

import { useState } from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { useScanState } from '@/hooks/useScanState'
import { QRScanner, PickupFlow } from '@/components/mobile'
import { Loading } from '@/components/shared/Loading'

export default function MobilePage() {
  const { deviceInfo, detectionResult, isLoading } = useDeviceDetection()
  const { scan, resetScanState } = useScanState()
  const [showPickupFlow, setShowPickupFlow] = useState(false)

  const handleScanSuccess = (result: string) => {
    console.log('QR Code scanned:', result)
    setShowPickupFlow(true)
  }

  const handlePickupComplete = () => {
    setShowPickupFlow(false)
    resetScanState()
  }

  const handlePickupCancel = () => {
    setShowPickupFlow(false)
    resetScanState()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loading message="Loading mobile interface..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Automated Store
          </h1>
          <p className="text-gray-600">
            Mobile QR Scanner Interface
          </p>
        </div>

        {/* Main Content */}
        {showPickupFlow && scan.scanResult ? (
          <PickupFlow
            scanResult={scan.scanResult}
            onComplete={handlePickupComplete}
            onCancel={handlePickupCancel}
          />
        ) : (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanError={(error) => console.error('Scan error:', error)}
          />
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            How to use:
          </h3>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Tap &quot;Start Scanning&quot; to activate camera</li>
            <li>2. Point camera at the QR code on the display</li>
            <li>3. Wait for automatic detection</li>
            <li>4. Follow pickup instructions</li>
          </ol>
        </div>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Debug Info:
            </h3>
            <div className="text-xs text-gray-600 space-y-2">
              <div>
                <strong>Device:</strong>
                <pre className="mt-1 overflow-x-auto">
                  {JSON.stringify({ deviceInfo, detectionResult }, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Scan State:</strong>
                <pre className="mt-1 overflow-x-auto">
                  {JSON.stringify(scan, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}