'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/mock-api';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import { Success } from '@/components/shared/Success';

export default function ApiDemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ description: string; data: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async (apiCall: () => Promise<unknown>, description: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiCall();
      setResult({ description, data });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? (err as Error).message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testScanQR = () => handleApiCall(
    () => apiClient.scanQR('STORE_001_BOX_A'),
    'QR Code Scan'
  );

  const testSystemStatus = () => handleApiCall(
    () => apiClient.getSystemStatus(),
    'System Status'
  );

  const testStoreInfo = () => handleApiCall(
    () => apiClient.getStoreInfo(),
    'Store Information'
  );

  const testDisplayQR = () => handleApiCall(
    () => apiClient.getDisplayQR(),
    'Display QR Code'
  );

  const testHealthCheck = () => handleApiCall(
    () => apiClient.getHealthStatus(),
    'Health Check'
  );

  const testDisplayConfig = () => handleApiCall(
    () => apiClient.getDisplayConfig(),
    'Display Configuration'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mock API Demo</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Endpoints</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Button onClick={testScanQR} disabled={loading}>
              Test QR Scan
            </Button>
            <Button onClick={testSystemStatus} disabled={loading}>
              System Status
            </Button>
            <Button onClick={testStoreInfo} disabled={loading}>
              Store Info
            </Button>
            <Button onClick={testDisplayQR} disabled={loading}>
              Display QR
            </Button>
            <Button onClick={testHealthCheck} disabled={loading}>
              Health Check
            </Button>
            <Button onClick={testDisplayConfig} disabled={loading}>
              Display Config
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <Loading message="Making API call..." />
            </div>
          )}

          {error && (
            <Error 
              message={error}
              onRetry={() => setError(null)}
            />
          )}

          {result && (
            <div className="mt-6">
              <Success message={`${result.description} completed successfully!`} />
              <div className="mt-4 bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Response Data:</h3>
                <pre className="text-sm text-gray-600 overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Documentation</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-800">Scan Endpoints</h3>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li><code>POST /api/scan/qr</code> - Process QR code scan</li>
                <li><code>GET /api/scan/status?scanId=...</code> - Get scan status</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-800">Pickup Endpoints</h3>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li><code>POST /api/pickup/start</code> - Start pickup process</li>
                <li><code>GET /api/pickup/status?pickupId=...</code> - Get pickup status</li>
                <li><code>POST /api/pickup/complete</code> - Complete pickup</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-800">System Endpoints</h3>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li><code>GET /api/system/status</code> - Get system status</li>
                <li><code>GET /api/system/info</code> - Get store information</li>
                <li><code>GET /api/system/health</code> - Health check</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-800">Display Endpoints</h3>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li><code>GET /api/display/qr</code> - Get QR code for display</li>
                <li><code>GET /api/display/config</code> - Get display configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}