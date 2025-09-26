'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, DeviceInfo, ScanState, PickupState, DisplayState, SystemState } from '@/types';

// Action types for the reducer
export type AppAction =
  | { type: 'SET_DEVICE_INFO'; payload: DeviceInfo }
  | { type: 'SET_SCAN_STATE'; payload: Partial<ScanState> }
  | { type: 'SET_PICKUP_STATE'; payload: Partial<PickupState> }
  | { type: 'SET_DISPLAY_STATE'; payload: Partial<DisplayState> }
  | { type: 'SET_SYSTEM_STATE'; payload: Partial<SystemState> }
  | { type: 'RESET_SCAN_STATE' }
  | { type: 'RESET_PICKUP_STATE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  device: {
    type: 'desktop',
    userAgent: '',
    screenWidth: 0,
    screenHeight: 0,
  },
  scan: {
    isScanning: false,
    scanResult: null,
    error: null,
    cameraPermission: 'not-requested',
  },
  pickup: {
    status: 'idle',
    pickupId: null,
    progress: 0,
    message: '',
  },
  display: {
    qrCode: '',
    storeInfo: {
      name: 'Automated Store',
      location: 'Demo Location',
      instructions: {
        en: 'Scan the QR code with your mobile device to start shopping',
        kz: 'Сатып алуды бастау үшін мобильді құрылғыңызбен QR кодын сканерлеңіз',
      },
      operatingHours: '24/7',
    },
    systemStatus: 'online',
    lastUpdate: new Date(),
  },
  system: {
    status: 'online',
    lastUpdate: new Date(),
    error: null,
    isLoading: false,
  },
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DEVICE_INFO':
      return {
        ...state,
        device: action.payload,
      };

    case 'SET_SCAN_STATE':
      return {
        ...state,
        scan: {
          ...state.scan,
          ...action.payload,
        },
      };

    case 'SET_PICKUP_STATE':
      return {
        ...state,
        pickup: {
          ...state.pickup,
          ...action.payload,
        },
      };

    case 'SET_DISPLAY_STATE':
      return {
        ...state,
        display: {
          ...state.display,
          ...action.payload,
        },
      };

    case 'SET_SYSTEM_STATE':
      return {
        ...state,
        system: {
          ...state.system,
          ...action.payload,
        },
      };

    case 'RESET_SCAN_STATE':
      return {
        ...state,
        scan: initialState.scan,
      };

    case 'RESET_PICKUP_STATE':
      return {
        ...state,
        pickup: initialState.pickup,
      };

    case 'SET_LOADING':
      return {
        ...state,
        system: {
          ...state.system,
          isLoading: action.payload,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        system: {
          ...state.system,
          error: action.payload,
        },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Provider component
interface AppProviderProps {
  children: ReactNode;
  initialState?: Partial<AppState>;
}

export function AppProvider({ children, initialState: customInitialState }: AppProviderProps) {
  const mergedInitialState = customInitialState 
    ? { ...initialState, ...customInitialState }
    : initialState;

  const [state, dispatch] = useReducer(appReducer, mergedInitialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}