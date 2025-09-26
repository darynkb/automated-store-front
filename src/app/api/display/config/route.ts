import { NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function GET() {
  await simulateDelay();
  
  try {
    const displayConfig = mockDataStore.getDisplayConfig();

    return NextResponse.json({
      success: true,
      data: displayConfig,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get display configuration'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}