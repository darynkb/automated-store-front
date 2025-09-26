import { NextRequest, NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function POST(request: NextRequest) {
  await simulateDelay();
  
  try {
    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'QR code is required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Simulate QR code validation
    const isValid = mockDataStore.isValidQRCode(qrCode);
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_QR_CODE',
          message: 'QR code is not valid or has expired'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const scanResult = mockDataStore.processScan(qrCode);

    return NextResponse.json({
      success: true,
      data: scanResult,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process QR scan'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}