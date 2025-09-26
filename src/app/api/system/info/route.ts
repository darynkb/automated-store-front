import { NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function GET() {
  await simulateDelay();
  
  try {
    const storeInfo = mockDataStore.getStoreInfo();

    return NextResponse.json({
      success: true,
      data: storeInfo,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get store information'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}