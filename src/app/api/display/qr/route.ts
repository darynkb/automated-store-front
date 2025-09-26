import { NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function GET() {
  await simulateDelay();
  
  try {
    const qrData = mockDataStore.generateDisplayQR();

    return NextResponse.json({
      success: true,
      data: qrData,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to generate QR code'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}