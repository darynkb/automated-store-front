'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useScanState } from '@/hooks/useScanState';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { Error } from '@/components/shared/Error';
import axios from "axios";

interface QRScannerProps {
  onScanSuccess?: (result: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [lalaError, setLalaError] = useState<string | null>(null);

  const {
    scan,
    startScanning,
    stopScanning,
    handleScanSuccess,
    handleScanError,
    requestCameraPermission,
    resetScanState,
  } = useScanState();

  // Initialize the QR code reader
  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  // Handle successful scan
  const handleScan = useCallback(async (result: string) => {
    try {
      // console.error(process.env.NEXT_PUBLIC_API_URL + "/scan");
      // const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/scan", {
      //   method: "GET",
      //   cache: "no-store"
      // });

      // // Read body once, then decide how to parse
      // const contentType = resp.headers.get("content-type") || "";
      // const text = await resp.text();
      // const data = contentType.includes("application/json")
      //   ? (() => { try { return JSON.parse(text); } catch { return text; } })()
      //   : text;

      // if (!resp.ok) {
      //   // HTTP error (4xx/5xx) — not a thrown exception by fetch
      //   console.error(`HTTP ${resp.status} ${resp.statusText} — ${typeof data === "string" ? data.slice(0,200) : JSON.stringify(data).slice(0,200)}`);
      // }

      // // Success
      // console.error("OK:", data);
      handleScanSuccess(result);
      onScanSuccess?.(result);
      stopCamera();
    } catch (err: any) {
      let message = "Unexpected error";
      if (err instanceof DOMException && err.name === "AbortError") {
        message = "Request timed out";
      } else if (err instanceof TypeError) {
        // fetch network layer: DNS/SSL/CORS/mixed content/PNA, etc.
        message = `Network/CORS/SSL error: ${err.message}`;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setLalaError(message);
      console.error("Request failed:", err);
    }
    // const resp = await axios.get("https://10.101.1.157:8443/scan");
    // handleScanSuccess(result);
    // onScanSuccess?.(result);
    // stopCamera();
  }, [handleScanSuccess, onScanSuccess]);

  // Handle scan error
  const handleError = useCallback((error: string) => {
    handleScanError(error);
    onScanError?.(error);
  }, [handleScanError, onScanError]);

  // Start camera and scanning
  const startCamera = useCallback(async () => {
    if (!readerRef.current || !videoRef.current) return;

    setIsInitializing(true);
    
    try {
      // Request camera permission first
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setIsInitializing(false);
        return;
      }

      startScanning();

      // Get video devices using navigator.mediaDevices
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        handleError('Media devices not available');
        return;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoInputDevices.length === 0) {
        handleError('No camera devices found');
        setIsInitializing(false);
        return;
      }

      // Prefer back camera on mobile devices
      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      const selectedDevice = backCamera || videoInputDevices[0];

      // Start decoding from video device
      await readerRef.current.decodeFromVideoDevice(
        selectedDevice.deviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScan(result.getText());
          } else if (error && !(error instanceof NotFoundException)) {
            console.error('QR Scanner error:', error);
          }
        }
      );

      setIsInitializing(false);
    } catch (error) {
      console.error('Failed to start camera:', error);
      handleError('Failed to access camera. Please check permissions.');
      setIsInitializing(false);
    }
  }, [requestCameraPermission, startScanning, handleScan, handleError]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    stopScanning();
  }, [stopScanning]);

  // Reset scanner
  const resetScanner = useCallback(() => {
    stopCamera();
    resetScanState();
  }, [stopCamera, resetScanState]);

  // Render camera permission denied state
  if (scan.cameraPermission === 'denied') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Error 
          message="Camera access is required to scan QR codes. Please enable camera permissions and try again."
          onRetry={requestCameraPermission}
        />
      </div>
    );
  }

  // Render scan result state
  if (scan.scanResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            QR Code Scanned Successfully!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Scan ID: {scan.scanResult}
          </p>
          <Button
            onClick={resetScanner}
            variant="dark"
            className="w-full"
          >
            Scan Another Code
          </Button>
        </div>
      </div>
    );
  }

  // Render error state
  if (scan.error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <Error 
          message={scan.error}
          onRetry={resetScanner}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        QR Code Scanner
      </h2>

      {/* Camera View */}
      <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden mb-4">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loading message="Initializing camera..." />
          </div>
        )}
        {lalaError}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ display: scan.isScanning ? 'block' : 'none' }}
        />

        {!scan.isScanning && !isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-dashed border-white/50 rounded-lg mx-auto mb-4"></div>
              <p className="text-sm opacity-75">
                Camera will appear here
              </p>
            </div>
          </div>
        )}

        {/* Scanning overlay */}
        {scan.isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-white/80"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-white/80"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-white/80"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-white/80"></div>
            
            {/* Scanning line animation */}
            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-white/60 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {!scan.isScanning ? (
          <Button
            onClick={startCamera}
            disabled={isInitializing}
            variant="dark"
            className="w-full"
          >
            {isInitializing ? 'Initializing...' : 'Start Scanning'}
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="dark"
            className="w-full"
          >
            Stop Scanning
          </Button>
        )}

        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {scan.isScanning 
              ? 'Point your camera at a QR code to scan'
              : 'Tap "Start Scanning" to begin'
            }
          </p>
        </div>
      </div>
    </div>
  );
}