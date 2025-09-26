# API Documentation

## Overview

This document describes the API endpoints used by the Automated Store Frontend. Currently, all endpoints return mock responses for development purposes. This documentation serves as a specification for future backend integration.

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://your-domain.com/api`

## Authentication

Currently, no authentication is required for the mock API. Future backend integration may require:

- API key authentication
- JWT token authentication
- Session-based authentication

## Response Format

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

### Success Response Example
```json
{
  "success": true,
  "data": {
    "id": "scan-123",
    "status": "completed"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QR_CODE",
    "message": "The provided QR code is invalid or expired",
    "details": {
      "qrCode": "invalid-code-123"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Endpoints

### QR Code Scanning

#### POST /api/scan/qr
Process a scanned QR code and validate it.

**Request Body:**
```typescript
{
  qrCode: string;        // The scanned QR code content
  deviceId?: string;     // Optional device identifier
  timestamp: string;     // ISO timestamp of scan
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    scanId: string;           // Unique scan identifier
    isValid: boolean;         // Whether QR code is valid
    storeId: string;          // Store identifier
    availableBoxes: number;   // Number of available storage boxes
    canProceed: boolean;      // Whether user can proceed to pickup
    expiresAt: string;        // ISO timestamp when scan expires
  }
}
```

**Error Codes:**
- `INVALID_QR_CODE` - QR code format is invalid
- `EXPIRED_QR_CODE` - QR code has expired
- `STORE_OFFLINE` - Store system is offline
- `NO_AVAILABLE_BOXES` - No storage boxes available

#### GET /api/scan/status/{scanId}
Get the current status of a scan operation.

**Parameters:**
- `scanId` (path) - The scan identifier

**Response:**
```typescript
{
  success: true,
  data: {
    scanId: string;
    status: 'pending' | 'valid' | 'invalid' | 'expired';
    createdAt: string;
    expiresAt: string;
  }
}
```

### Pickup Process

#### POST /api/pickup/start
Initiate the pickup process for a validated scan.

**Request Body:**
```typescript
{
  scanId: string;        // The validated scan ID
  customerInfo?: {       // Optional customer information
    phone?: string;
    email?: string;
  };
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    pickupId: string;           // Unique pickup identifier
    status: 'initiated';        // Initial status
    estimatedTime: number;      // Estimated completion time in seconds
    instructions: string;       // Instructions for customer
    boxNumber?: number;         // Assigned box number (if available)
  }
}
```

**Error Codes:**
- `INVALID_SCAN_ID` - Scan ID is invalid or expired
- `PICKUP_ALREADY_STARTED` - Pickup already in progress for this scan
- `SYSTEM_BUSY` - System is currently processing other requests

#### GET /api/pickup/status/{pickupId}
Get the current status of a pickup operation.

**Parameters:**
- `pickupId` (path) - The pickup identifier

**Response:**
```typescript
{
  success: true,
  data: {
    pickupId: string;
    status: 'initiated' | 'processing' | 'ready' | 'completed' | 'failed';
    progress: number;           // Progress percentage (0-100)
    estimatedTime: number;      // Remaining time in seconds
    instructions: string;       // Current instructions
    boxNumber?: number;         // Box number (when ready)
    completedAt?: string;       // Completion timestamp (when completed)
  }
}
```

#### POST /api/pickup/complete
Mark a pickup as completed by the customer.

**Request Body:**
```typescript
{
  pickupId: string;      // The pickup identifier
  confirmationCode?: string;  // Optional confirmation code
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    pickupId: string;
    status: 'completed';
    completedAt: string;
    receipt?: {
      id: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      total: number;
    };
  }
}
```

### System Status

#### GET /api/system/status
Get the current system status and health information.

**Response:**
```typescript
{
  success: true,
  data: {
    status: 'online' | 'offline' | 'maintenance';
    uptime: number;             // System uptime in seconds
    lastUpdate: string;         // Last status update timestamp
    services: {
      scanner: boolean;         // QR scanner service status
      display: boolean;         // Display service status
      api: boolean;            // API service status
      storage: boolean;        // Storage system status
    };
    metrics: {
      totalScans: number;      // Total scans today
      successfulPickups: number; // Successful pickups today
      averageProcessTime: number; // Average process time in seconds
      availableBoxes: number;   // Currently available boxes
    };
  }
}
```

#### GET /api/system/info
Get store information and configuration.

**Response:**
```typescript
{
  success: true,
  data: {
    storeId: string;
    name: string;
    location: string;
    instructions: {
      en: string;              // English instructions
      kz: string;              // Kazakh instructions
    };
    operatingHours: {
      open: string;            // Opening time (HH:MM)
      close: string;           // Closing time (HH:MM)
      timezone: string;        // Timezone identifier
    };
    contact: {
      phone?: string;
      email?: string;
      website?: string;
    };
    features: {
      qrScanning: boolean;
      mobileApp: boolean;
      multiLanguage: boolean;
    };
  }
}
```

#### GET /api/system/health
Health check endpoint for monitoring.

**Response:**
```typescript
{
  success: true,
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: {
      database: 'pass' | 'fail';
      storage: 'pass' | 'fail';
      external_apis: 'pass' | 'fail';
    };
    version: string;           // API version
    environment: string;       // Environment (dev/staging/prod)
  }
}
```

### Display Management

#### GET /api/display/qr
Get QR code for display on desktop interface.

**Query Parameters:**
- `storeId` (optional) - Store identifier
- `refresh` (optional) - Force refresh of QR code

**Response:**
```typescript
{
  success: true,
  data: {
    qrCode: string;            // QR code content/URL
    qrCodeImage: string;       // Base64 encoded QR code image
    expiresAt: string;         // When QR code expires
    displayText: {
      en: string;              // English display text
      kz: string;              // Kazakh display text
    };
  }
}
```

#### GET /api/display/config
Get display configuration and settings.

**Response:**
```typescript
{
  success: true,
  data: {
    refreshInterval: number;    // QR code refresh interval in seconds
    displayTimeout: number;     // Display timeout in seconds
    theme: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
    };
    layout: {
      qrSize: number;          // QR code size in pixels
      showInstructions: boolean;
      showStatus: boolean;
    };
    languages: string[];       // Supported languages
  }
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `422` - Unprocessable Entity (validation errors)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
- `503` - Service Unavailable (maintenance mode)

### Common Error Codes

- `INVALID_REQUEST` - Request format is invalid
- `MISSING_PARAMETER` - Required parameter is missing
- `INVALID_PARAMETER` - Parameter value is invalid
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RESOURCE_EXPIRED` - Resource has expired
- `SYSTEM_ERROR` - Internal system error
- `SERVICE_UNAVAILABLE` - Service is temporarily unavailable
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Scan endpoints:** 10 requests per minute per IP
- **Pickup endpoints:** 5 requests per minute per IP
- **Status endpoints:** 60 requests per minute per IP
- **Display endpoints:** 30 requests per minute per IP

Rate limit headers are included in responses:
- `X-RateLimit-Limit` - Request limit per window
- `X-RateLimit-Remaining` - Remaining requests in window
- `X-RateLimit-Reset` - Time when window resets

## Webhooks (Future)

For real-time updates, the backend may support webhooks:

### Pickup Status Updates
```typescript
POST /your-webhook-endpoint
{
  event: 'pickup.status_changed';
  data: {
    pickupId: string;
    oldStatus: string;
    newStatus: string;
    timestamp: string;
  };
}
```

### System Status Updates
```typescript
POST /your-webhook-endpoint
{
  event: 'system.status_changed';
  data: {
    oldStatus: string;
    newStatus: string;
    timestamp: string;
    reason?: string;
  };
}
```

## Integration Guide

### Replacing Mock API

1. **Update API Base URL:**
   ```typescript
   // In environment configuration
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
   ```

2. **Add Authentication:**
   ```typescript
   // Add auth headers to requests
   const headers = {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`,
   };
   ```

3. **Handle Real Errors:**
   ```typescript
   // Update error handling for real backend errors
   if (!response.ok) {
     const error = await response.json();
     throw new Error(error.error?.message || 'Request failed');
   }
   ```

4. **Add Request Interceptors:**
   ```typescript
   // Add logging, retry logic, etc.
   const apiCall = async (url: string, options: RequestInit) => {
     const response = await fetch(url, {
       ...options,
       headers: {
         ...headers,
         ...options.headers,
       },
     });
     
     if (!response.ok) {
       // Handle errors
     }
     
     return response.json();
   };
   ```

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourstore.com
NEXT_PUBLIC_STORE_ID=store-001

# Authentication (if required)
API_KEY=your-api-key
JWT_SECRET=your-jwt-secret

# Feature Flags
NEXT_PUBLIC_ENABLE_WEBHOOKS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Testing with Real Backend

1. **Update mock responses** to match real API responses
2. **Add integration tests** with real API endpoints
3. **Test error scenarios** with actual error responses
4. **Verify rate limiting** behavior
5. **Test authentication** flows if implemented

This API documentation provides a complete specification for integrating the frontend with a real backend system while maintaining compatibility with the current mock implementation.