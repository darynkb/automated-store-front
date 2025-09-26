import { NextRequest, NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function POST(request: NextRequest) {
  await simulateDelay();
  
  try {
    const body = await request.json();
    const { scanId } = body;

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

    const pickup = mockDataStore.startPickup(scanId);

    if (!pickup) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PICKUP_FAILED',
          message: 'Unable to start pickup process'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: pickup,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to start pickup'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}