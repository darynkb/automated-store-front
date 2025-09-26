import { NextRequest, NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function GET(request: NextRequest) {
  await simulateDelay();
  
  try {
    const { searchParams } = new URL(request.url);
    const pickupId = searchParams.get('pickupId');

    if (!pickupId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'Pickup ID is required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const pickupStatus = mockDataStore.getPickupStatus(pickupId);

    if (!pickupStatus) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PICKUP_NOT_FOUND',
          message: 'Pickup not found'
        },
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: pickupStatus,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get pickup status'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}