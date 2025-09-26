import { NextRequest, NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function GET(request: NextRequest) {
  await simulateDelay();
  
  try {
    const { searchParams } = new URL(request.url);
    const scanId = searchParams.get('scanId');

    if (!scanId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Scan ID is required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const scanStatus = mockDataStore.getScanStatus(scanId);

    if (!scanStatus) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'SCAN_NOT_FOUND',
          message: 'Scan not found'
        },
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: scanStatus,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get scan status'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}