# Component Documentation

## Overview

This document provides comprehensive documentation for all React components in the Automated Store Frontend application.

## Component Categories

### Shared Components (`src/components/shared/`)

#### Button
**Purpose:** Reusable button component with consistent styling and behavior.

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { Button } from '@/components/shared';

<Button 
  variant="primary" 
  size="lg" 
  onClick={handleClick}
  loading={isLoading}
>
  Scan QR Code
</Button>
```

#### Loading
**Purpose:** Loading spinner with optional message.

**Props:**
```typescript
interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Usage:**
```tsx
import { Loading } from '@/components/shared';

<Loading message="Processing scan..." size="lg" />
```

#### Error
**Purpose:** Error display component with retry functionality.

**Props:**
```typescript
interface ErrorProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { Error } from '@/components/shared';

<Error 
  message="Failed to scan QR code" 
  onRetry={handleRetry}
  retryText="Try Again"
/>
```

#### Success
**Purpose:** Success message display with optional actions.

**Props:**
```typescript
interface SuccessProps {
  message: string;
  onContinue?: () => void;
  continueText?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { Success } from '@/components/shared';

<Success 
  message="Pickup completed successfully!" 
  onContinue={handleContinue}
  continueText="Start New Scan"
/>
```

### Mobile Components (`src/components/mobile/`)

#### QRScanner
**Purpose:** Mobile QR code scanner with camera integration.

**Props:**
```typescript
interface QRScannerProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
  isActive?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import { QRScanner } from '@/components/mobile';

<QRScanner 
  onScan={handleScanResult}
  onError={handleScanError}
  isActive={isScanning}
/>
```

#### PickupFlow
**Purpose:** Complete pickup process flow for mobile users.

**Props:**
```typescript
interface PickupFlowProps {
  scanResult: string;
  onComplete: () => void;
  onCancel: () => void;
}
```

**Usage:**
```tsx
import { PickupFlow } from '@/components/mobile';

<PickupFlow 
  scanResult={qrResult}
  onComplete={handlePickupComplete}
  onCancel={handleCancel}
/>
```

#### PickupProgressIndicator
**Purpose:** Visual progress indicator for pickup process.

**Props:**
```typescript
interface PickupProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  className?: string;
}
```

**Usage:**
```tsx
import { PickupProgressIndicator } from '@/components/mobile';

<PickupProgressIndicator 
  currentStep={2}
  totalSteps={4}
  stepLabels={['Scan', 'Process', 'Prepare', 'Complete']}
/>
```

### Desktop Components (`src/components/desktop/`)

#### QRDisplay
**Purpose:** Desktop QR code display with store information.

**Props:**
```typescript
interface QRDisplayProps {
  qrCode: string;
  storeInfo: StoreInfo;
  className?: string;
}
```

**Usage:**
```tsx
import { QRDisplay } from '@/components/desktop';

<QRDisplay 
  qrCode={generatedQRCode}
  storeInfo={storeData}
/>
```

#### BilingualInstructions
**Purpose:** Bilingual instruction display (English/Kazakh).

**Props:**
```typescript
interface BilingualInstructionsProps {
  instructions: {
    en: string;
    kz: string;
  };
  className?: string;
}
```

**Usage:**
```tsx
import { BilingualInstructions } from '@/components/desktop';

<BilingualInstructions 
  instructions={{
    en: "Scan the QR code with your mobile device",
    kz: "Мобильді құрылғыңызбен QR кодын сканерлеңіз"
  }}
/>
```

#### SystemStatus
**Purpose:** System status display for desktop interface.

**Props:**
```typescript
interface SystemStatusProps {
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: Date;
  services: {
    scanner: boolean;
    display: boolean;
    api: boolean;
  };
  className?: string;
}
```

**Usage:**
```tsx
import { SystemStatus } from '@/components/desktop';

<SystemStatus 
  status="online"
  lastUpdate={new Date()}
  services={{ scanner: true, display: true, api: true }}
/>
```

## Custom Hooks

### useAppState
**Purpose:** Access and manage global application state.

**Returns:**
```typescript
interface AppStateHook {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isLoading: boolean;
  error: string | null;
}
```

**Usage:**
```tsx
import { useAppState } from '@/hooks';

const { state, dispatch, isLoading, error } = useAppState();
```

### useDeviceDetection
**Purpose:** Detect device type and capabilities.

**Returns:**
```typescript
interface DeviceDetectionHook {
  isMobile: boolean;
  isDesktop: boolean;
  screenSize: { width: number; height: number };
  userAgent: string;
}
```

**Usage:**
```tsx
import { useDeviceDetection } from '@/hooks';

const { isMobile, isDesktop } = useDeviceDetection();
```

### useErrorHandler
**Purpose:** Centralized error handling with user feedback.

**Returns:**
```typescript
interface ErrorHandlerHook {
  error: string | null;
  showError: (message: string) => void;
  clearError: () => void;
  handleError: (error: Error) => void;
}
```

**Usage:**
```tsx
import { useErrorHandler } from '@/hooks';

const { error, showError, clearError, handleError } = useErrorHandler();
```

## Styling Guidelines

### Tailwind CSS Classes
- Use consistent spacing: `p-4`, `m-2`, `gap-4`
- Responsive design: `sm:`, `md:`, `lg:` prefixes
- Color scheme: `bg-blue-500`, `text-gray-800`
- Animations: `transition-all`, `duration-300`

### Component Styling
- Use `className` prop for custom styling
- Merge classes with `cn()` utility function
- Support responsive design in all components
- Use consistent color palette

## Testing Components

### Unit Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/shared';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Testing
```tsx
import { render, screen } from '@testing-library/react';
import { AppProvider } from '@/contexts/AppContext';
import { PickupFlow } from '@/components/mobile';

test('pickup flow completes successfully', async () => {
  render(
    <AppProvider>
      <PickupFlow scanResult="test-qr" onComplete={jest.fn()} onCancel={jest.fn()} />
    </AppProvider>
  );
  
  // Test pickup flow steps
});
```

## Best Practices

1. **Component Design:**
   - Keep components focused and single-purpose
   - Use TypeScript for prop validation
   - Support className prop for styling flexibility
   - Handle loading and error states

2. **State Management:**
   - Use local state for component-specific data
   - Use global state for shared application data
   - Implement proper error boundaries

3. **Accessibility:**
   - Use semantic HTML elements
   - Add proper ARIA labels
   - Support keyboard navigation
   - Ensure color contrast compliance

4. **Performance:**
   - Use React.memo for expensive components
   - Implement proper key props for lists
   - Lazy load heavy components
   - Optimize re-renders with useCallback/useMemo