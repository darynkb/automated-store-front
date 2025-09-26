'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AppProvider } from '@/contexts/AppContext'

const QRScanner = dynamic(() => import('@/components/mobile').then(mod => ({ default: mod.QRScanner })), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <p>Loading scanner...</p>
    </div>
  )
})

function MobileTestPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)


  const handleScanSuccess = (result: string) => {
    console.log('QR Code scanned:', result)
    setScanResult(result)
    setScanError(null)
  }

  const handleScanError = (error: string) => {
    console.error('Scan error:', error)
    setScanError(error)
    setScanResult(null)
  }

  const resetScanner = () => {
    setScanResult(null)
    setScanError(null)
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              QR Scanner Test
            </h1>
            <p className="text-gray-600">
              Mobile QR Scanner Testing Interface
            </p>
          </div>

          {/* Scanner */}
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />

          {/* Results */}
          {scanResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Scan Successful!
              </h3>
              <p className="text-green-700 text-sm mb-3">
                Scanned: <code className="bg-green-100 px-2 py-1 rounded">{scanResult}</code>
              </p>
              <button
                onClick={resetScanner}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                Scan Another
              </button>
            </div>
          )}

          {scanError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-red-800 mb-2">
                ❌ Scan Error
              </h3>
              <p className="text-red-700 text-sm mb-3">
                {scanError}
              </p>
              <button
                onClick={resetScanner}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Test QR Codes */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Test QR Codes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You can test the scanner with these sample QR codes. Generate them using any QR code generator:
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Test Code 1:</strong> <code>STORE-001-PICKUP-ABC123</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Test Code 2:</strong> <code>AUTOMATED-STORE-TEST-456</code>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Test Code 3:</strong> <code>https://example.com/pickup/789</code>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Testing Instructions:
            </h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Tap &quot;Start Scanning&quot; to activate camera</li>
              <li>2. Allow camera permissions when prompted</li>
              <li>3. Point camera at any QR code to test</li>
              <li>4. Check the results below the scanner</li>
              <li>5. Use the test codes above if needed</li>
            </ol>
          </div>

          {/* Device Info */}
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Device Info:
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>User Agent: {navigator.userAgent}</div>
              <div>Screen: {window.innerWidth} × {window.innerHeight}</div>
              <div>Camera API: {navigator.mediaDevices ? '✅ Available' : '❌ Not Available'}</div>
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

export default dynamic(() => Promise.resolve(MobileTestPage), {
  ssr: false
})