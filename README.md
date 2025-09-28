# Automated Store Frontend

A clean, frontend-only version of the Automated Store MVP that provides beautiful mobile and desktop interfaces for automated parcel pickup systems.

## 🎯 Overview

This project focuses purely on the user interface and experience, using device detection to automatically route users to the appropriate interface:
- **Mobile devices** → QR Scanner Interface
- **Desktop/Monitor devices** → QR Display Interface

All backend interactions are mocked to return successful responses, making the frontend ready for easy backend integration later.

## ✨ Features

- 📱 **Device-Based Routing** - Automatic interface selection based on device type
- 🔍 **Mobile QR Scanner** - Beautiful, responsive QR code scanner with camera access
- 🖥️ **Desktop QR Display** - Elegant display interface with prominent QR codes
- 🌐 **Bilingual Support** - English and Kazakh language support
- 🎨 **Modern UI/UX** - Clean design with smooth animations and transitions
- 📦 **Mock API System** - Realistic API responses for development and testing
- 🧪 **Comprehensive Testing** - Unit and integration tests included
- ⚡ **Performance Optimized** - Code splitting and lazy loading

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/darynkb/automated-store-front.git](https://github.com/darynkb/automated-store-front.git)
cd automated-store-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Mobile interface: http://localhost:3000 (on mobile device)
   - Desktop interface: http://localhost:3000 (on desktop)

## 📖 Usage

### Device Detection

The application automatically detects your device type and shows the appropriate interface:

- **Mobile/Tablet** → QR Scanner interface for customers
- **Desktop/Monitor** → QR Display interface for store displays

### Manual Override

You can manually access specific interfaces:
- Force mobile: `http://localhost:3000?interface=mobile`
- Force desktop: `http://localhost:3000?interface=desktop`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── mobile/         # Mobile-specific components
│   ├── desktop/        # Desktop-specific components
│   └── shared/         # Shared components
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── __tests__/          # Test files
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NODE_ENV=development
MOCK_API=true
API_BASE_URL=http://localhost:3000/api
STORE_ID=store_001
QR_CODE_URL=https://automated-store.local
```

## 🔌 API Integration

The frontend is designed for easy backend integration. All API calls are centralized and use consistent interfaces:

### API Endpoints

```
/api/scan/qr          # Process QR code scan
/api/pickup/start     # Start pickup process
/api/pickup/status    # Get pickup status
/api/system/status    # Get system status
/api/display/qr       # Get QR code for display
```

### Mock Responses

All endpoints currently return successful mock responses. To integrate with a real backend:

1. Update `API_BASE_URL` in environment variables
2. Set `MOCK_API=false`
3. Ensure backend implements the same API contract

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 🎨 Customization

### Styling

The project uses Tailwind CSS with a custom theme. Modify `tailwind.config.ts` to customize:

- Colors and branding
- Animations and transitions
- Responsive breakpoints
- Typography

### Components

All components are modular and reusable. Key components:

- `QRScanner` - Mobile QR code scanning
- `QRDisplay` - Desktop QR code display
- `PickupFlow` - Pickup process management
- `DeviceDetector` - Device type detection

## 📱 Mobile Features

- Camera access for QR scanning
- Touch-optimized interface
- Responsive design
- Smooth animations
- Progress indicators

## 🖥️ Desktop Features

- Large QR code display
- Bilingual instructions
- Status monitoring
- Monitor-optimized layout
- Real-time updates

## 🔄 Backend Integration

When ready to connect to a real backend:

1. **Update environment variables**
2. **Replace mock API calls** with real endpoints
3. **Add error handling** for real backend errors
4. **Configure authentication** if needed

The frontend architecture makes this integration straightforward with minimal code changes.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

---

**Built with ❤️ for automated retail solutions**
