import { render, screen, waitFor } from '@testing-library/react'
import { SystemStatus } from '@/components/desktop/SystemStatus'
import { apiClient } from '@/lib/mock-api'

// Mock the API client
jest.mock('@/lib/mock-api', () => ({
  apiClient: {
    getSystemStatus: jest.fn(),
  },
}))

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('SystemStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mock
    mockApiClient.getSystemStatus.mockResolvedValue({
      status: 'online',
      uptime: 3661, // 1 hour, 1 minute, 1 second
      lastUpdate: '2023-01-01T12:00:00.000Z',
      services: {
        scanner: true,
        display: true,
        api: true
      }
    })
  })

  it('renders loading state initially', () => {
    render(<SystemStatus />)
    expect(screen.getByText('Loading status...')).toBeInTheDocument()
  })

  it('renders online status', async () => {
    render(<SystemStatus />)

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeInTheDocument()
    })

    expect(mockApiClient.getSystemStatus).toHaveBeenCalled()
  })

  it('renders status details when showDetails is true', async () => {
    render(<SystemStatus showDetails={true} />)

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeInTheDocument()
    })

    expect(screen.getByText('Uptime: 1h 1m')).toBeInTheDocument()
    expect(screen.getByText(/Last Update:/)).toBeInTheDocument()
    expect(screen.getByText('Services:')).toBeInTheDocument()
    expect(screen.getByText('Scanner')).toBeInTheDocument()
    expect(screen.getByText('Display')).toBeInTheDocument()
    expect(screen.getByText('API')).toBeInTheDocument()
  })

  it('does not render details when showDetails is false', async () => {
    render(<SystemStatus showDetails={false} />)

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeInTheDocument()
    })

    expect(screen.queryByText('Uptime:')).not.toBeInTheDocument()
    expect(screen.queryByText('Services:')).not.toBeInTheDocument()
  })

  it('renders maintenance status with yellow indicator', async () => {
    mockApiClient.getSystemStatus.mockResolvedValue({
      status: 'maintenance',
      uptime: 1800,
      lastUpdate: '2023-01-01T12:00:00.000Z',
      services: {
        scanner: false,
        display: true,
        api: true
      }
    })

    render(<SystemStatus />)

    await waitFor(() => {
      expect(screen.getByText('Maintenance')).toBeInTheDocument()
    })
  })

  it('renders offline status with red indicator', async () => {
    mockApiClient.getSystemStatus.mockResolvedValue({
      status: 'offline',
      uptime: 0,
      lastUpdate: '2023-01-01T12:00:00.000Z',
      services: {
        scanner: false,
        display: false,
        api: false
      }
    })

    render(<SystemStatus />)

    await waitFor(() => {
      expect(screen.getByText('Offline')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    mockApiClient.getSystemStatus.mockRejectedValue(new Error('Network error'))

    render(<SystemStatus />)

    await waitFor(() => {
      expect(screen.getByText('Status unavailable')).toBeInTheDocument()
    })
  })

  it('formats uptime correctly for minutes only', async () => {
    mockApiClient.getSystemStatus.mockResolvedValue({
      status: 'online',
      uptime: 1800, // 30 minutes
      lastUpdate: '2023-01-01T12:00:00.000Z',
      services: {
        scanner: true,
        display: true,
        api: true
      }
    })

    render(<SystemStatus showDetails={true} />)

    await waitFor(() => {
      expect(screen.getByText('Uptime: 30m')).toBeInTheDocument()
    })
  })

  it('shows service status indicators correctly', async () => {
    mockApiClient.getSystemStatus.mockResolvedValue({
      status: 'online',
      uptime: 3600,
      lastUpdate: '2023-01-01T12:00:00.000Z',
      services: {
        scanner: true,
        display: false,
        api: true
      }
    })

    render(<SystemStatus showDetails={true} />)

    await waitFor(() => {
      expect(screen.getByText('Services:')).toBeInTheDocument()
    })

    // Check that we have the right number of service indicators
    const serviceElements = screen.getAllByText(/Scanner|Display|API/)
    expect(serviceElements).toHaveLength(3)
  })
})