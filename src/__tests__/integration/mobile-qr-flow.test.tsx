import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '@/contexts/AppContext';
import MobilePage from '@/app/mobile/page';

// Mock device detection
jest.mock('@/hooks/useDeviceDetection', () => ({
  useDeviceDetection: () => ({
    deviceInfo: {
      type: 'mobile',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      screenWidth: 375,
      screenHeight: 812,
    },
    detectionResult: {
      isMobile: true,
      isDesktop: false,
      shouldShowMobileInterface: true,
      shouldShowDesktopInterface: false,
    },
    isLoading: false,
  }),
}));

// Mock the ZXing library
jest.mock('@zxing/library', () => ({
  BrowserMultiFormatReader: jest.fn().mockImplementation(() => ({
    decodeFromVideoDevice: jest.fn(),
    reset: jest.fn(),
  })),
  NotFoundException: class NotFoundException extends Error {},
}));

// Mock getUserMedia
const mockGetUserMedia = jest.fn();
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
});

// Mock navigator.mediaDevices.enumerateDevices
const mockEnumerateDevices = jest.fn();

// Mock fetch for API calls
global.fetch = jest.fn();

const renderMobilePage = () => {
  return render(
    <AppProvider>
      <MobilePage />
    </AppProvider>
  );
};

describe('Mobile QR Scanner Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    });
    mockEnumerateDevices.mockResolvedValue([
      { deviceId: 'camera1', label: 'Back Camera', kind: 'videoinput' },
    ]);
    
    // Mock successful API responses
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: { scanId: 'test-scan-id' },
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          success: true,
          data: { pickupId: 'test-pickup-id' },
        }),
      });
  });

  it('renders mobile page with QR scanner', () => {
    renderMobilePage();
    
    expect(screen.getByText('Automated Store')).toBeInTheDocument();
    expect(screen.getByText('Mobile QR Scanner Interface')).toBeInTheDocument();
    expect(screen.getByText('QR Code Scanner')).toBeInTheDocument();
    expect(screen.getByText('Start Scanning')).toBeInTheDocument();
  });

  it('shows instructions for using the scanner', () => {
    renderMobilePage();
    
    expect(screen.getByText('How to use:')).toBeInTheDocument();
    expect(screen.getByText('1. Tap "Start Scanning" to activate camera')).toBeInTheDocument();
    expect(screen.getByText('2. Point camera at the QR code on the display')).toBeInTheDocument();
    expect(screen.getByText('3. Wait for automatic detection')).toBeInTheDocument();
    expect(screen.getByText('4. Follow pickup instructions')).toBeInTheDocument();
  });

  it('handles complete QR scan to pickup flow', async () => {
    const mockReader = {
      decodeFromVideoDevice: jest.fn(),
      reset: jest.fn(),
    };
    
    BrowserMultiFormatReader.mockImplementation(() => mockReader);
    
    renderMobilePage();
    
    // Start scanning
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    // Wait for camera to initialize
    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    // Simulate successful QR scan
    const mockResult = { getText: () => 'test-qr-code' };
    const callback = mockReader.decodeFromVideoDevice.mock.calls[0][2];
    callback(mockResult, null);

    // Should show pickup flow
    await waitFor(() => {
      expect(screen.getByText('Processing Scan...')).toBeInTheDocument();
    });

    // Wait for pickup process to complete
    await waitFor(() => {
      expect(screen.getByText('Pickup Complete!')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Should show completion message
    expect(screen.getByText(/Your items have been successfully retrieved/)).toBeInTheDocument();
    expect(screen.getByText('Start New Pickup')).toBeInTheDocument();
  });

  it('handles scan errors gracefully', async () => {
    // Mock API error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: false,
        error: { message: 'Invalid QR code' },
      }),
    });

    const mockReader = {
      decodeFromVideoDevice: jest.fn(),
      reset: jest.fn(),
    };
    
    BrowserMultiFormatReader.mockImplementation(() => mockReader);
    
    renderMobilePage();
    
    // Start scanning
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    // Wait for camera to initialize
    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    // Simulate successful QR scan (but API will return error)
    const mockResult = { getText: () => 'invalid-qr-code' };
    const callback = mockReader.decodeFromVideoDevice.mock.calls[0][2];
    callback(mockResult, null);

    // Should show error in pickup flow
    await waitFor(() => {
      expect(screen.getByText(/Invalid QR code/)).toBeInTheDocument();
    });
  });

  it('allows returning to scanner after pickup completion', async () => {
    const mockReader = {
      decodeFromVideoDevice: jest.fn(),
      reset: jest.fn(),
    };
    
    BrowserMultiFormatReader.mockImplementation(() => mockReader);
    
    renderMobilePage();
    
    // Complete a scan and pickup flow
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    const mockResult = { getText: () => 'test-qr-code' };
    const callback = mockReader.decodeFromVideoDevice.mock.calls[0][2];
    callback(mockResult, null);

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Pickup Complete!')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Click start new pickup
    const newPickupButton = screen.getByText('Start New Pickup');
    fireEvent.click(newPickupButton);

    // Should return to scanner
    await waitFor(() => {
      expect(screen.getByText('Start Scanning')).toBeInTheDocument();
    });
  });
});