/**
 * Development debugging utilities
 * Only active in development mode
 */

interface DebugConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  showStateChanges: boolean;
  showApiCalls: boolean;
  showComponentRenders: boolean;
}

class DebugManager {
  private config: DebugConfig = {
    enabled: process.env.NODE_ENV === 'development',
    logLevel: 'debug',
    showStateChanges: true,
    showApiCalls: true,
    showComponentRenders: false,
  };

  private logs: Array<{
    timestamp: Date;
    level: string;
    category: string;
    message: string;
    data?: unknown;
  }> = [];

  constructor() {
    if (this.config.enabled && typeof window !== 'undefined') {
      // Add debug panel to window object for console access
      (window as unknown as { __DEBUG__: DebugManager }).__DEBUG__ = this;
      this.setupGlobalErrorHandler();
      this.log('debug', 'system', 'Debug Manager initialized');
    }
  }

  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.log('error', 'global', 'Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', 'global', 'Unhandled Promise Rejection', {
        reason: event.reason,
      });
    });
  }

  log(level: string, category: string, message?: string, data?: unknown) {
    if (!this.config.enabled) return;

    const logEntry = {
      timestamp: new Date(),
      level,
      category,
      message: message || category,
      data,
    };

    this.logs.push(logEntry);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Console output with styling
    const style = this.getLogStyle(level);
    const timestamp = logEntry.timestamp.toLocaleTimeString();
    
    console.groupCollapsed(
      `%c[${timestamp}] ${category}${message ? `: ${message}` : ''}`,
      style
    );
    
    if (data) {
      console.log('Data:', data);
    }
    
    console.trace('Stack trace');
    console.groupEnd();
  }

  private getLogStyle(level: string): string {
    const styles = {
      debug: 'color: #6B7280; font-weight: normal;',
      info: 'color: #3B82F6; font-weight: bold;',
      warn: 'color: #F59E0B; font-weight: bold;',
      error: 'color: #EF4444; font-weight: bold; background: #FEE2E2;',
    };
    return styles[level as keyof typeof styles] || styles.debug;
  }

  // State change tracking
  logStateChange(component: string, oldState: unknown, newState: unknown) {
    if (!this.config.showStateChanges) return;
    
    this.log('info', 'state', `${component}`, {
      oldState,
      newState,
      diff: this.getStateDiff(
        oldState as Record<string, unknown>, 
        newState as Record<string, unknown>
      ),
    });
  }

  private getStateDiff(oldState: Record<string, unknown>, newState: Record<string, unknown>): Record<string, { from: unknown; to: unknown }> {
    const diff: Record<string, { from: unknown; to: unknown }> = {};
    
    for (const key in newState) {
      if (oldState[key] !== newState[key]) {
        diff[key] = {
          from: oldState[key],
          to: newState[key],
        };
      }
    }
    
    return diff;
  }

  // API call tracking
  logApiCall(method: string, url: string, data?: unknown, response?: unknown, error?: unknown) {
    if (!this.config.showApiCalls) return;
    
    const status = error ? 'ERROR' : 'SUCCESS';
    this.log('info', 'api', `${method} ${url} - ${status}`, {
      method,
      url,
      requestData: data,
      response,
      error,
    });
  }

  // Component render tracking
  logComponentRender(componentName: string, props?: unknown, renderTime?: number) {
    if (!this.config.showComponentRenders) return;
    
    this.log('debug', 'render', componentName, {
      props,
      renderTime: renderTime ? `${renderTime}ms` : undefined,
    });
  }

  // Performance tracking
  startTimer(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.log('info', 'performance', `${label} completed in ${duration.toFixed(2)}ms`);
    };
  }

  // Debug panel methods
  getLogs(category?: string, level?: string) {
    let filteredLogs = this.logs;
    
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
    console.clear();
    this.log('info', 'system', 'Logs cleared');
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(updates: Partial<DebugConfig>) {
    this.config = { ...this.config, ...updates };
    this.log('info', 'system', 'Configuration updated', updates);
  }

  // Device information
  getDeviceInfo() {
    if (typeof window === 'undefined') return null;
    
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      location: {
        href: window.location.href,
        protocol: window.location.protocol,
        host: window.location.host,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      },
    };
  }

  // Memory usage (if available)
  getMemoryInfo() {
    if (typeof window === 'undefined' || !(performance as unknown as { memory?: unknown }).memory) {
      return null;
    }
    
    const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    return {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    };
  }

  // Export logs for debugging
  exportLogs() {
    const data = {
      timestamp: new Date().toISOString(),
      config: this.config,
      deviceInfo: this.getDeviceInfo(),
      memoryInfo: this.getMemoryInfo(),
      logs: this.logs,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.log('info', 'system', 'Logs exported');
  }
}

// Create singleton instance
export const debugManager = new DebugManager();

// Convenience functions
export const debug = {
  log: (category: string, message?: string, data?: unknown) => 
    debugManager.log('debug', category, message, data),
  
  info: (category: string, message?: string, data?: unknown) => 
    debugManager.log('info', category, message, data),
  
  warn: (category: string, message?: string, data?: unknown) => 
    debugManager.log('warn', category, message, data),
  
  error: (category: string, message?: string, data?: unknown) => 
    debugManager.log('error', category, message, data),
  
  stateChange: (component: string, oldState: Record<string, unknown>, newState: Record<string, unknown>) =>
    debugManager.logStateChange(component, oldState, newState),
  
  apiCall: (method: string, url: string, data?: unknown, response?: unknown, error?: unknown) =>
    debugManager.logApiCall(method, url, data, response, error),
  
  componentRender: (componentName: string, props?: unknown, renderTime?: number) =>
    debugManager.logComponentRender(componentName, props, renderTime),
  
  timer: (label: string) => debugManager.startTimer(label),
  
  deviceInfo: () => debugManager.getDeviceInfo(),
  
  memoryInfo: () => debugManager.getMemoryInfo(),
  
  exportLogs: () => debugManager.exportLogs(),
  
  clearLogs: () => debugManager.clearLogs(),
};

// React hook for debugging (to be used in React components)
export interface UseDebugHook {
  log: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
  timer: (label: string) => () => void;
}

// Hook factory function - returns hook implementation
export interface UseDebugHook {
  log: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
  timer: (label: string) => () => void;
}

export function createUseDebugHook() {
  return function useDebug(componentName: string): UseDebugHook {
    const renderStart = performance.now();
    
    // Log component render on mount
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const renderTime = performance.now() - renderStart;
        debugManager.logComponentRender(componentName, undefined, renderTime);
      }, 0);
    }
    
    return {
      log: (message: string, data?: unknown) => debug.log(componentName, message, data),
      info: (message: string, data?: unknown) => debug.info(componentName, message, data),
      warn: (message: string, data?: unknown) => debug.warn(componentName, message, data),
      error: (message: string, data?: unknown) => debug.error(componentName, message, data),
      timer: (label: string) => debug.timer(`${componentName}: ${label}`),
    };
  };
}

export default debugManager;