'use client';

import React from 'react';
import { useDebug } from '@/hooks/useDebug';
import { debug } from '@/lib/debug';

export function DebugTest() {
  const componentDebug = useDebug('DebugTest');
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    componentDebug.info('Component mounted');
    debug.info('System', 'Debug test component initialized');
  }, [componentDebug]);

  const handleClick = () => {
    const timer = componentDebug.timer('Button Click');
    
    componentDebug.log('Button clicked', { count, timestamp: new Date() });
    
    setTimeout(() => {
      setCount(prev => {
        const newCount = prev + 1;
        componentDebug.info('Count updated', { from: prev, to: newCount });
        timer(); // End timer
        return newCount;
      });
    }, 100);
  };

  const handleError = () => {
    try {
      throw new Error('Test error for debugging');
    } catch (error: unknown) {
      componentDebug.error('Test error caught', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const handleApiTest = () => {
    debug.apiCall('GET', '/api/test', { param: 'value' }, { success: true }, null);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-40">
      <h3 className="font-semibold mb-2">Debug Test Panel</h3>
      <div className="space-y-2">
        <div>Count: {count}</div>
        <button
          onClick={handleClick}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Increment (+Debug)
        </button>
        <button
          onClick={handleError}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Test Error
        </button>
        <button
          onClick={handleApiTest}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Test API Log
        </button>
      </div>
    </div>
  );
}