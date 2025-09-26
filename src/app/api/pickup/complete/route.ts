import { NextRequest, NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function POST(request: NextRequest) {
  await simulateDelay();
  
  try {
    const body = await request.json();
    const { pickupId } = body;

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

    const completedPickup = mockDataStore.completePickup(pickupId);

    if (!completedPickup) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PICKUP_NOT_FOUND',
          message: 'Pickup not found or already completed'
        },
        timestamp: new Date().toISOString()
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: completedPickup,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to complete pickup'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}