import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PickupFlow } from '@/components/mobile/PickupFlow';
import { AppProvider } from '@/contexts/AppContext';

// Mock the hooks
const mockUsePickupState = jest.fn();
jest.mock('@/hooks/usePickupState', () => ({
  usePickupState: () => mockUsePickupState(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('PickupFlow', () => {
  const defaultProps = {
    scanResult: 'test-qr-code',
    onComplete: jest.fn(),
    onCancel: jest.fn(),
  };

  it('should render processing state correctly', () => {
    mockUsePickupState.mockReturnValue({
      pickup: {
        status: 'processing',
        pickupId: 'test-pickup-123',
        progress: 50,
        message: 'Processing your request...',
      },
      startPickupProcess: jest.fn(),
      completePickupProcess: jest.fn(),
      resetPickupState: jest.fn(),
      setPickupError: jest.fn(),
    });

    render(
      <TestWrapper>
        <PickupFlow {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Pickup in Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Processing your request...')).toBeInTheDocument();
  });

  it('should render success state with confirmation', () => {
    mockUsePickupState.mockReturnValue({
      pickup: {
        status: 'success',
        pickupId: 'test-pickup-123',
        progress: 100,
        message: 'Pickup completed successfully!',
      },
      startPickupProcess: jest.fn(),
      completePickupProcess: jest.fn(),
      resetPickupState: jest.fn(),
      setPickupError: jest.fn(),
    });

    render(
      <TestWrapper>
        <PickupFlow {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Pickup Complete!')).toBeInTheDocument();
    expect(screen.getByText('test-pickup-123')).toBeInTheDocument();
    expect(screen.getByText('Start New Pickup')).toBeInTheDocument();
  });

  it('should render error state correctly', () => {
    mockUsePickupState.mockReturnValue({
      pickup: {
        status: 'error',
        pickupId: null,
        progress: 0,
        message: 'Pickup failed. Please try again.',
      },
      startPickupProcess: jest.fn(),
      completePickupProcess: jest.fn(),
      resetPickupState: jest.fn(),
      setPickupError: jest.fn(),
    });

    render(
      <TestWrapper>
        <PickupFlow {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Pickup failed. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Cancel and Scan Again')).toBeInTheDocument();
  });

  it('should handle complete pickup button click', async () => {
    const mockCompletePickupProcess = jest.fn();
    mockUsePickupState.mockReturnValue({
      pickup: {
        status: 'processing',
        pickupId: 'test-pickup-123',
        progress: 100,
        message: 'Pickup ready!',
      },
      startPickupProcess: jest.fn(),
      completePickupProcess: mockCompletePickupProcess,
      resetPickupState: jest.fn(),
      setPickupError: jest.fn(),
    });

    render(
      <TestWrapper>
        <PickupFlow {...defaultProps} />
      </TestWrapper>
    );

    const completeButton = screen.getByText('Complete Pickup');
    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(mockCompletePickupProcess).toHaveBeenCalled();
    });
  });
});