'use client';

import React from 'react';
import { debugManager } from '@/lib/debug';

// Development-only React component for debug panel
export function DebugPanel() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState(debugManager.getLogs());
  const [filter, setFilter] = React.useState({ category: '', level: '' });
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLogs(debugManager.getLogs(filter.category || undefined, filter.level || undefined));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [filter]);
  
  // Early return after hooks
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
        title="Open Debug Panel"
      >
        🐛
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Debug Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b flex gap-4">
            <input
              type="text"
              placeholder="Filter by category"
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="border rounded px-2 py-1"
            />
            <select
              value={filter.level}
              onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
              className="border rounded px-2 py-1"
            >
              <option value="">All levels</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
            <button
              onClick={() => debugManager.clearLogs()}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Clear
            </button>
            <button
              onClick={() => debugManager.exportLogs()}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Export
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm border-l-4 ${
                    log.level === 'error' ? 'border-red-500 bg-red-50' :
                    log.level === 'warn' ? 'border-yellow-500 bg-yellow-50' :
                    log.level === 'info' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-500 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{log.category}</span>
                    <span className="text-xs text-gray-500">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-1">{log.message}</div>
                  {log.data ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-gray-600">
                        Show data
                      </summary>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}