'use client';

import React from 'react';
import { useAppState, useScanState, usePickupState, useSystemState } from '@/hooks';
import { Button } from '@/components/shared/Button';

/**
 * Example component demonstrating state management usage
 */
export function StateExample() {
  const { state } = useAppState();
  const { 
    scan, 
    startScanning, 
    stopScanning, 
    setScanResult, 
    setCameraPermission,
    resetScanState 
  } = useScanState();
  const { 
    pickup, 
    startPickupProcess, 
    cancelPickup,
    resetPickupState 
  } = usePickupState();
  const { 
    system, 
    setOnlineMode, 
    setOfflineMode, 
    setMaintenanceMode,
    checkSystemHealth 
  } = useSystemState();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">State Management Demo</h1>
      
      {/* Device Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Device Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span> {state.device.type}
          </div>
          <div>
            <span className="font-medium">Screen:</span> {state.device.screenWidth}x{state.device.screenHeight}
          </div>
        </div>
      </div>

      {/* Scan State */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Scan State</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Scanning:</span> {scan.isScanning ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="font-medium">Permission:</span> {scan.cameraPermission}
            </div>
            <div>
              <span className="font-medium">Result:</span> {scan.scanResult || 'None'}
            </div>
            <div>
              <span className="font-medium">Error:</span> {scan.error || 'None'}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setCameraPermission('granted')}
              variant="outline"
              size="sm"
            >
              Grant Permission
            </Button>
            <Button 
              onClick={startScanning}
              disabled={scan.isScanning}
              size="sm"
            >
              Start Scanning
            </Button>
            <Button 
              onClick={stopScanning}
              disabled={!scan.isScanning}
              variant="outline"
              size="sm"
            >
              Stop Scanning
            </Button>
            <Button 
              onClick={() => setScanResult('demo-qr-code-123')}
              variant="outline"
              size="sm"
            >
              Simulate Scan
            </Button>
            <Button 
              onClick={resetScanState}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Pickup State */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pickup State</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span> {pickup.status}
            </div>
            <div>
              <span className="font-medium">Pickup ID:</span> {pickup.pickupId || 'None'}
            </div>
            <div>
              <span className="font-medium">Progress:</span> {pickup.progress}%
            </div>
            <div className="col-span-2">
              <span className="font-medium">Message:</span> {pickup.message || 'None'}
            </div>
          </div>
          
          {pickup.status === 'processing' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pickup.progress}%` }}
              />
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => startPickupProcess('demo-pickup-123')}
              disabled={pickup.status === 'processing'}
              size="sm"
            >
              Start Pickup
            </Button>
            <Button 
              onClick={cancelPickup}
              disabled={pickup.status === 'idle'}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={resetPickupState}
              variant="outline"
              size="sm"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* System State */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">System State</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                system.status === 'online' ? 'bg-green-100 text-green-800' :
                system.status === 'offline' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {system.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Loading:</span> {system.isLoading ? 'Yes' : 'No'}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Error:</span> {system.error || 'None'}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Last Update:</span> {system.lastUpdate.toLocaleString()}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={setOnlineMode}
              size="sm"
            >
              Set Online
            </Button>
            <Button 
              onClick={() => setOfflineMode('Manual offline')}
              variant="outline"
              size="sm"
            >
              Set Offline
            </Button>
            <Button 
              onClick={() => setMaintenanceMode('Demo maintenance')}
              variant="outline"
              size="sm"
            >
              Maintenance
            </Button>
            <Button 
              onClick={checkSystemHealth}
              variant="outline"
              size="sm"
            >
              Health Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}