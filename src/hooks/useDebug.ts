import { useEffect, useState } from 'react';
import { debug, debugManager } from '@/lib/debug';

export interface UseDebugHook {
  log: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
  timer: (label: string) => () => void;
}

export function useDebug(componentName: string): UseDebugHook {
  const [renderStart] = useState(() => performance.now());
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    debugManager.logComponentRender(componentName, undefined, renderTime);
  }, [componentName, renderStart]);
  
  return {
    log: (message: string, data?: unknown) => debug.log(componentName, message, data),
    info: (message: string, data?: unknown) => debug.info(componentName, message, data),
    warn: (message: string, data?: unknown) => debug.warn(componentName, message, data),
    error: (message: string, data?: unknown) => debug.error(componentName, message, data),
    timer: (label: string) => debug.timer(`${componentName}: ${label}`),
  };
}