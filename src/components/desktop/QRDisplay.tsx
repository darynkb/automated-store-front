'use client'

import { useEffect, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { apiClient } from '@/lib/mock-api'
import type { QRDisplayData } from '@/lib/mock-api'
import { Loading } from '@/components/shared/Loading'
import { Error } from '@/components/shared/Error'

interface QRDisplayProps {
  size?: number
  className?: string
  onQRGenerated?: (qrData: QRDisplayData) => void
}

export function QRDisplay({ size = 256, className = '', onQRGenerated }: QRDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [qrData, setQrData] = useState<QRDisplayData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<number>(30000)

  const generateQRCode = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get QR data from API
      const data = await apiClient.getDisplayQR()
      setQrData(data)

      // Generate QR code image
      const qrCodeDataUrl = await QRCode.toDataURL(data.qrCode, {
        width: size,
        margin: 2,
        color: {
          dark: '#1f2937', // gray-800
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })

      setQrDataUrl(qrCodeDataUrl)
      onQRGenerated?.(data)
    } catch (err: unknown) {
      console.error('Failed to generate QR code:', err)
      setError(err instanceof Error ? (err as Error).message : 'Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }, [size, onQRGenerated])

  // const refreshQRCode = useCallback(() => {
  //   generateQRCode()
  // }, [generateQRCode])

  useEffect(() => {
    // Get display config and generate initial QR code
    const initializeDisplay = async () => {
      try {
        const config = await apiClient.getDisplayConfig()
        // setRefreshInterval(config.refreshInterval)
        await generateQRCode()
      } catch (err: unknown) {
        console.error('Failed to initialize display:', err)
        setError('Failed to initialize display')
        setIsLoading(false)
      }
    }

    initializeDisplay()
  }, []) // Remove generateQRCode dependency to prevent infinite loop

  // useEffect(() => {
  //   // Set up auto-refresh interval
  //   if (refreshInterval > 0) {
  //     const interval = setInterval(refreshQRCode, refreshInterval)
  //     return () => clearInterval(interval)
  //   }
  // }, [refreshInterval, refreshQRCode])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Loading size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Error 
          message={error}
          // onRetry={refreshQRCode}
          className="text-center"
        />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {qrDataUrl && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="QR Code for pickup"
            className="rounded-lg shadow-sm"
            width={size}
            height={size}
          />
          
          {/* QR Code overlay info */}
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* QR Code info */}
      {qrData && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Display ID: {qrData.displayId.slice(0, 8)}...
          </p>
        </div>
      )}
    </div>
  )
}