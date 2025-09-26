# Mock API System

This directory contains the mock API system for the Automated Store Frontend. The mock API provides realistic responses for all frontend functionality without requiring a real backend.

## Files

- `mock-api.ts` - Main mock API implementation with data store and client utilities
- `constants.ts` - Application constants
- `device-detection.ts` - Device detection utilities
- `state-persistence.ts` - State persistence utilities
- `utils.ts` - General utility functions

## Mock API Features

### Data Store
The `MockDataStore` class provides:
- QR code validation and processing
- Pickup process simulation with progress tracking
- System status and store information
- Display QR code generation
- Realistic response timing simulation

### API Endpoints

#### Scan Endpoints
- `POST /api/scan/qr` - Process QR code scan
- `GET /api/scan/status?scanId=...` - Get scan status

#### Pickup Endpoints
- `POST /api/pickup/start` - Start pickup process
- `GET /api/pickup/status?pickupId=...` - Get pickup status
- `POST /api/pickup/complete` - Complete pickup

#### System Endpoints
- `GET /api/system/status` - Get system status
- `GET /api/system/info` - Get store information
- `GET /api/system/health` - Health check

#### Display Endpoints
- `GET /api/display/qr` - Get QR code for display
- `GET /api/display/config` - Get display configuration

### API Client

The `MockApiClient` class provides a convenient interface for making API calls:

```typescript
import { apiClient } from '@/lib/mock-api';

// Scan QR code
const scanResult = await apiClient.scanQR('STORE_001_BOX_A');

// Start pickup
const pickup = await apiClient.startPickup(scanResult.scanId);

// Get system status
const status = await apiClient.getSystemStatus();
```

### Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### Error Handling

The mock API includes realistic error scenarios:
- Invalid QR codes
- Missing required parameters
- Pickup process failures
- Network simulation delays

### Testing

The mock API system includes comprehensive tests:
- Unit tests for data store functionality
- API client tests with mocked fetch
- Response timing tests
- Error handling tests

Run tests with:
```bash
npm test -- --testPathPatterns=mock-api.test.ts
```

### Demo Page

Visit `/api-demo` to test all API endpoints interactively.

## Future Backend Integration

The mock API is designed to be easily replaced with real backend calls:

1. Replace mock responses with real API endpoints
2. Update error handling for real backend errors
3. Add authentication if needed
4. Configure environment-based API URLs

The frontend code using the API client will require minimal changes.