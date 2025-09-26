# State Management System

This directory contains the complete state management system for the Automated Store Frontend application. The system is built using React Context, useReducer, and custom hooks to provide a clean and maintainable way to manage application state.

## Architecture Overview

The state management system consists of several layers:

1. **Context Layer** (`AppContext.tsx`) - Provides the React Context and reducer
2. **Hook Layer** (`useAppState.ts`, `useScanState.ts`, etc.) - Custom hooks for state access
3. **Persistence Layer** (`state-persistence.ts`) - Handles state persistence to localStorage
4. **Integration Layer** (`usePersistedState.ts`) - Integrates persistence with state management

## Core Components

### AppContext (`contexts/AppContext.tsx`)

The main React Context that provides:
- Application state using `useReducer`
- Action dispatch function
- Type-safe state management

```typescript
import { AppProvider, useAppContext } from '@/hooks';

// Wrap your app
<AppProvider>
  <YourApp />
</AppProvider>
```

### State Hooks

#### `useAppState()`
The main hook for accessing and updating application state:

```typescript
import { useAppState } from '@/hooks';

function MyComponent() {
  const { state, setDeviceInfo, setLoading, setError } = useAppState();
  
  // Access state
  console.log(state.device.type);
  
  // Update state
  setLoading(true);
}
```

#### `useScanState()`
Specialized hook for QR scanning functionality:

```typescript
import { useScanState } from '@/hooks';

function ScannerComponent() {
  const { 
    scan, 
    startScanning, 
    stopScanning, 
    setScanResult,
    requestCameraPermission 
  } = useScanState();
  
  const handleScan = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      startScanning();
    }
  };
}
```

#### `usePickupState()`
Specialized hook for pickup process management:

```typescript
import { usePickupState } from '@/hooks';

function PickupComponent() {
  const { 
    pickup, 
    simulatePickupProcess, 
    isProcessing,
    completePickup 
  } = usePickupState();
  
  const handlePickup = () => {
    simulatePickupProcess('pickup-123');
  };
}
```

#### `useSystemState()`
Specialized hook for system status management:

```typescript
import { useSystemState } from '@/hooks';

function SystemComponent() {
  const { 
    system, 
    checkSystemHealth, 
    setMaintenanceMode,
    isOnline 
  } = useSystemState();
  
  useEffect(() => {
    checkSystemHealth();
  }, []);
}
```

### State Persistence

#### `StatePersistence` Class
Handles saving and loading state to/from localStorage:

```typescript
import { StatePersistence } from '@/lib/state-persistence';

const persistence = new StatePersistence({
  persistScanState: false, // Don't persist scan state for security
  persistPickupState: true, // Persist pickup state
  storageType: 'localStorage'
});

// Save state
persistence.saveAppState(state);

// Load state
const savedState = persistence.loadAppState();
```

#### `usePersistedState()`
Hook that automatically persists state changes:

```typescript
import { usePersistedState } from '@/hooks';

function App() {
  const { saveState, loadState, clearPersistedState } = usePersistedState();
  
  // State is automatically persisted on changes
  // Manual operations available if needed
}
```

## State Structure

The application state follows this structure:

```typescript
interface AppState {
  device: DeviceInfo;      // Device detection info
  scan: ScanState;         // QR scanning state
  pickup: PickupState;     // Pickup process state
  display: DisplayState;   // Display interface state
  system: SystemState;     // System status state
}
```

### Device State
```typescript
interface DeviceInfo {
  type: 'mobile' | 'desktop';
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}
```

### Scan State
```typescript
interface ScanState {
  isScanning: boolean;
  scanResult: string | null;
  error: string | null;
  cameraPermission: 'granted' | 'denied' | 'pending';
}
```

### Pickup State
```typescript
interface PickupState {
  status: 'idle' | 'scanning' | 'processing' | 'success' | 'error';
  pickupId: string | null;
  progress: number;
  message: string;
}
```

### System State
```typescript
interface SystemState {
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: Date;
  error: string | null;
  isLoading: boolean;
}
```

## Usage Examples

### Basic Setup

```typescript
// app/layout.tsx
import { AppProvider } from '@/hooks';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
```

### Component Usage

```typescript
// components/Scanner.tsx
import { useScanState } from '@/hooks';

export function Scanner() {
  const { 
    scan, 
    startScanning, 
    stopScanning, 
    handleScanSuccess,
    canScan 
  } = useScanState();

  return (
    <div>
      {scan.isScanning ? (
        <div>
          <p>Scanning...</p>
          <button onClick={stopScanning}>Stop</button>
        </div>
      ) : (
        <button 
          onClick={startScanning} 
          disabled={!canScan}
        >
          Start Scanning
        </button>
      )}
      
      {scan.scanResult && (
        <p>Scanned: {scan.scanResult}</p>
      )}
      
      {scan.error && (
        <p className="error">{scan.error}</p>
      )}
    </div>
  );
}
```

### Error Handling

```typescript
import { useSystemState } from '@/hooks';

export function ErrorBoundary() {
  const { system, handleError, retryOperation } = useSystemState();

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      handleError(error, true); // Second param sets system offline
    }
  };

  if (system.error) {
    return (
      <div className="error">
        <p>{system.error}</p>
        <button onClick={() => retryOperation(handleApiCall)}>
          Retry
        </button>
      </div>
    );
  }

  return <YourComponent />;
}
```

## Testing

The state management system includes comprehensive tests:

- **Unit Tests**: Test individual hooks and functions
- **Integration Tests**: Test hook interactions
- **Persistence Tests**: Test state saving/loading

Run tests:
```bash
npm test -- --testPathPatterns="state-.*\.test\.(ts|tsx)"
```

## Best Practices

1. **Use Specialized Hooks**: Use `useScanState()`, `usePickupState()`, etc. instead of `useAppState()` when possible
2. **Handle Loading States**: Always show loading indicators during async operations
3. **Error Handling**: Use the built-in error handling mechanisms
4. **State Persistence**: Configure persistence based on security requirements
5. **Type Safety**: Leverage TypeScript for type-safe state management

## Configuration

### Persistence Configuration

```typescript
const persistence = new StatePersistence({
  persistScanState: false,     // Security: don't persist scan results
  persistPickupState: true,    // UX: persist pickup progress
  persistDisplayState: true,   // UX: persist display settings
  persistSystemState: true,    // Reliability: persist system status
  persistDeviceInfo: true,     // Performance: cache device detection
  storageType: 'localStorage'  // or 'sessionStorage'
});
```

### Custom Initial State

```typescript
<AppProvider initialState={{
  device: { type: 'mobile', /* ... */ },
  system: { status: 'maintenance', /* ... */ }
}}>
  <App />
</AppProvider>
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **6.1**: State maintained appropriately across navigation
- **6.2**: UI components update automatically on state changes  
- **6.3**: Immediate feedback provided for user actions
- **6.4**: Graceful error handling with user-friendly messages

The system provides a robust, type-safe, and well-tested foundation for managing application state in the Automated Store Frontend.