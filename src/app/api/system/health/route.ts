import { NextResponse } from 'next/server';
import { simulateDelay } from '@/lib/mock-api';

export async function GET() {
  await simulateDelay();
  
  try {
    const healthStatus = {
      status: 'healthy',
      uptime: Math.floor(Math.random() * 86400), // Random uptime in seconds
      version: '1.0.0',
      services: {
        scanner: true,
        display: true,
        api: true,
        database: true
      },
      lastHealthCheck: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: healthStatus,
      timestamp: new Date().toISOString()
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Health check failed'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}