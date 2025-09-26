import { NextResponse } from 'next/server';
import { mockDataStore, simulateDelay } from '@/lib/mock-api';

export async function GET() {
  await simulateDelay();
  
  try {
    const systemStatus = mockDataStore.getSystemStatus();

    return NextResponse.json({
      success: true,
      data: systemStatus,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get system status'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}