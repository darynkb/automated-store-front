import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QRScanner } from '@/components/mobile/QRScanner';
import { AppProvider } from '@/contexts/AppContext';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

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
const mockEnumerateDevices = jest.fn();

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('QRScanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: jest.fn() }],
    });
    mockEnumerateDevices.mockResolvedValue([
      { deviceId: 'camera1', label: 'Back Camera', kind: 'videoinput' },
    ]);
  });

  it('renders scanner interface', () => {
    renderWithProvider(<QRScanner />);
    
    expect(screen.getByText('QR Code Scanner')).toBeInTheDocument();
    expect(screen.getByText('Start Scanning')).toBeInTheDocument();
    expect(screen.getByText('Camera will appear here')).toBeInTheDocument();
  });

  it('shows camera permission request', async () => {
    renderWithProvider(<QRScanner />);
    
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
    });
  });

  it('handles camera permission denied', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
    
    renderWithProvider(<QRScanner />);
    
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Camera access is required/)).toBeInTheDocument();
    });
  });

  it('calls onScanSuccess when QR code is scanned', async () => {
    const mockOnScanSuccess = jest.fn();
    const mockReader = {
      decodeFromVideoDevice: jest.fn(),
      reset: jest.fn(),
    };
    
    // const { BrowserMultiFormatReader } = require('@zxing/library');
    BrowserMultiFormatReader.mockImplementation(() => mockReader);
    
    renderWithProvider(<QRScanner onScanSuccess={mockOnScanSuccess} />);
    
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    // Wait for camera to initialize
    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    // Simulate successful scan
    const mockResult = { getText: () => 'test-qr-code' };
    const callback = mockReader.decodeFromVideoDevice.mock.calls[0][2];
    callback(mockResult, null);

    await waitFor(() => {
      expect(mockOnScanSuccess).toHaveBeenCalledWith('test-qr-code');
    });
  });

  it('shows scan result when QR code is successfully scanned', async () => {
    const mockReader = {
      decodeFromVideoDevice: jest.fn(),
      reset: jest.fn(),
    };
    
    // const { BrowserMultiFormatReader } = require('@zxing/library');
    BrowserMultiFormatReader.mockImplementation(() => mockReader);
    
    renderWithProvider(<QRScanner />);
    
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    // Wait for camera to initialize
    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    // Simulate successful scan
    const mockResult = { getText: () => 'test-qr-code' };
    const callback = mockReader.decodeFromVideoDevice.mock.calls[0][2];
    callback(mockResult, null);

    await waitFor(() => {
      expect(screen.getByText('QR Code Scanned Successfully!')).toBeInTheDocument();
      expect(screen.getByText('Scan ID: test-qr-code')).toBeInTheDocument();
    });
  });

  it('allows scanning another code after successful scan', async () => {
    const mockReader = {
      decodeFromVideoDevice: jest.fn(),
      reset: jest.fn(),
    };
    
    // const { BrowserMultiFormatReader } = require('@zxing/library');
    BrowserMultiFormatReader.mockImplementation(() => mockReader);
    
    renderWithProvider(<QRScanner />);
    
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    // Wait for camera to initialize and simulate scan
    await waitFor(() => {
      expect(mockEnumerateDevices).toHaveBeenCalled();
    });

    const mockResult = { getText: () => 'test-qr-code' };
    const callback = mockReader.decodeFromVideoDevice.mock.calls[0][2];
    callback(mockResult, null);

    await waitFor(() => {
      expect(screen.getByText('Scan Another Code')).toBeInTheDocument();
    });

    // Click scan another code
    const scanAnotherButton = screen.getByText('Scan Another Code');
    fireEvent.click(scanAnotherButton);

    await waitFor(() => {
      expect(screen.getByText('Start Scanning')).toBeInTheDocument();
    });
  });

  it('handles scan errors gracefully', async () => {
    const mockOnScanError = jest.fn();
    
    renderWithProvider(<QRScanner onScanError={mockOnScanError} />);
    
    const startButton = screen.getByText('Start Scanning');
    fireEvent.click(startButton);

    // Wait for camera initialization to fail
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });
  });
});