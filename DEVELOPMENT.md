# Development Setup Guide

## Overview

This is a clean, frontend-only version of the Automated Store MVP built with Next.js. The system automatically routes users to device-appropriate interfaces and uses mock API responses for development.

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with camera support (for mobile testing)

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   cd automated-store-frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Desktop: http://localhost:3000 (shows QR display interface)
   - Mobile: http://localhost:3000 (shows QR scanner interface)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── desktop/           # Desktop-specific pages
│   ├── mobile/            # Mobile-specific pages
│   └── api/               # Mock API routes
├── components/            # React components
│   ├── desktop/          # Desktop interface components
│   ├── mobile/           # Mobile interface components
│   ├── shared/           # Shared UI components
│   └── examples/         # Development examples
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and constants
├── types/                # TypeScript type definitions
└── __tests__/            # Test files
```

## Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## Device Testing

### Desktop Interface Testing
- Access http://localhost:3000 on desktop browser
- Should show QR display interface with store information
- Test different screen sizes using browser dev tools

### Mobile Interface Testing
- Access http://localhost:3000 on mobile device or mobile emulator
- Should show QR scanner interface
- Grant camera permissions when prompted
- Test QR scanning with generated codes

### Manual Interface Override
- Force mobile interface: http://localhost:3000?interface=mobile
- Force desktop interface: http://localhost:3000?interface=desktop

## Mock API System

All API endpoints return successful mock responses by default:

- `/api/scan/qr` - Mock QR scan processing
- `/api/pickup/start` - Mock pickup initiation
- `/api/pickup/status` - Mock pickup status
- `/api/system/status` - Mock system health
- `/api/display/qr` - Mock QR code generation

## Environment Configuration

Create `.env.local` for local development:

```env
# Development settings
NODE_ENV=development
NEXT_PUBLIC_MOCK_API=true
NEXT_PUBLIC_STORE_ID=store-001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Debugging

### Browser DevTools
- Use React Developer Tools extension
- Check Network tab for API calls
- Use Console for error messages
- Test responsive design with device emulation

### Common Issues

1. **Camera not working on mobile:**
   - Ensure HTTPS in production
   - Check browser permissions
   - Test on actual device vs emulator

2. **QR codes not scanning:**
   - Ensure good lighting
   - Check camera focus
   - Verify QR code format

3. **Interface not switching:**
   - Clear browser cache
   - Check user agent detection
   - Use manual override parameters

## Hot Reload

The development server supports hot reload for:
- React components
- CSS/Tailwind styles
- API routes
- TypeScript files

Changes should reflect immediately without full page refresh.

## Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Tailwind CSS for styling
- Conventional commit messages

## Testing Strategy

- Unit tests for components and utilities
- Integration tests for user flows
- Mock API responses for consistent testing
- Device-specific interface testing

Run tests with `npm test` or `npm run test:watch` for development.