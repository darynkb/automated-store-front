'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/mock-api'
import type { SystemStatusResponse } from '@/lib/mock-api'

interface SystemStatusProps {
  className?: string
  showDetails?: boolean
}

export function SystemStatus({ className = '', showDetails = false }: SystemStatusProps) {
  const [status, setStatus] = useState<SystemStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setError(null)
      const statusData = await apiClient.getSystemStatus()
      setStatus(statusData)
    } catch (err) {
      console.error('Failed to fetch system status:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'maintenance':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'maintenance':
        return 'Maintenance'
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Loading status...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span className="text-sm text-red-600">Status unavailable</span>
      </div>
    )
  }

  if (!status) {
    return null
  }

  return (
    // <div className={className}>
    //   <div className="flex items-center space-x-2">
    //     <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`}></div>
    //     <span className="text-sm font-medium text-gray-900">
    //       {getStatusText(status.status)}
    //     </span>
    //   </div>

    //   {showDetails && (
    //     <div className="mt-2 space-y-1">
    //       <div className="text-xs text-gray-600">
    //         Uptime: {formatUptime(status.uptime)}
    //       </div>
    //       <div className="text-xs text-gray-600">
    //         Last Update: {new Date(status.lastUpdate).toLocaleTimeString()}
    //       </div>
          
    //       {/* Service status */}
    //       <div className="mt-2">
    //         <div className="text-xs font-medium text-gray-700 mb-1">Services:</div>
    //         <div className="grid grid-cols-3 gap-2 text-xs">
    //           <div className="flex items-center space-x-1">
    //             <div className={`w-2 h-2 rounded-full ${status.services.scanner ? 'bg-green-500' : 'bg-red-500'}`}></div>
    //             <span>Scanner</span>
    //           </div>
    //           <div className="flex items-center space-x-1">
    //             <div className={`w-2 h-2 rounded-full ${status.services.display ? 'bg-green-500' : 'bg-red-500'}`}></div>
    //             <span>Display</span>
    //           </div>
    //           <div className="flex items-center space-x-1">
    //             <div className={`w-2 h-2 rounded-full ${status.services.api ? 'bg-green-500' : 'bg-red-500'}`}></div>
    //             <span>API</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div></div>
  )
}