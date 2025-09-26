import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '@/contexts/AppContext';
import { PickupFlow } from '@/components/mobile/PickupFlow';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Pickup Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/scan/qr')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            data: { scanId: 'test-scan-123' }
          })
        });
      }
      if (url.includes('/api/pickup/start')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            data: { pickupId: 'test-pickup-456' }
          })
        });
      }
      if (url.includes('/api/pickup/complete')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            data: { status: 'completed' }
          })
        });
      }
      return Promise.reject(new Error('Unknown API endpoint'));
    });
  });

  it('should start pickup flow and show progress indicators', async () => {
    const onComplete = jest.fn();
    const onCancel = jest.fn();

    render(
      <TestWrapper>
        <PickupFlow
          scanResult="test-qr-code-123"
          onComplete={onComplete}
          onCancel={onCancel}
        />
      </TestWrapper>
    );

    // Should start with processing state
    await waitFor(() => {
      expect(screen.getByText('Pickup in Progress')).toBeInTheDocument();
    });

    // Should show progress indicators
    expect(screen.getByText('QR Code Validated')).toBeInTheDocument();
    expect(screen.getByText('Preparing Items')).toBeInTheDocument();
    expect(screen.getByText('Processing Order')).toBeInTheDocument();
    expect(screen.getByText('Ready for Pickup')).toBeInTheDocument();

    // Should show progress percentage
    expect(screen.getByText('0%')).toBeInTheDocument();

    // Should have cancel button
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    (fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: false,
          error: { message: 'Invalid QR code' }
        })
      });
    });

    render(
      <TestWrapper>
        <PickupFlow
          scanResult="invalid-qr-code"
          onComplete={jest.fn()}
          onCancel={jest.fn()}
        />
      </TestWrapper>
    );

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText(/Invalid QR code/)).toBeInTheDocument();
    });

    expect(screen.getByText('Cancel and Scan Again')).toBeInTheDocument();
  });

  it('should allow cancellation during processing', async () => {
    const onCancel = jest.fn();

    render(
      <TestWrapper>
        <PickupFlow
          scanResult="test-qr-code-123"
          onComplete={jest.fn()}
          onCancel={onCancel}
        />
      </TestWrapper>
    );

    // Wait for processing to start
    await waitFor(() => {
      expect(screen.getByText('Pickup in Progress')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});