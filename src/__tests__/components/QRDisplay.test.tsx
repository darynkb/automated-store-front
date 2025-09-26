import { render, screen, waitFor } from '@testing-library/react'
import { QRDisplay } from '@/components/desktop/QRDisplay'
import { apiClient } from '@/lib/mock-api'

// Mock the API client
jest.mock('@/lib/mock-api', () => ({
  apiClient: {
    getDisplayQR: jest.fn(),
    getDisplayConfig: jest.fn(),
  },
}))

// Mock QRCode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}))

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>
import * as QRCodeLib from 'qrcode'
const mockQRCode = QRCodeLib as jest.Mocked<typeof QRCodeLib>

describe('QRDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    mockApiClient.getDisplayConfig.mockResolvedValue({
      refreshInterval: 30000,
      qrSize: 256,
      showInstructions: true,
      language: 'both',
      theme: 'light'
    })

    mockApiClient.getDisplayQR.mockResolvedValue({
      qrCode: 'STORE_001_DISPLAY_123',
      qrCodeUrl: 'http://localhost:3000/pickup?code=STORE_001_DISPLAY_123',
      displayId: 'display-123',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    })

    mockQRCode.toDataURL.mockResolvedValue('data:image/png;base64,mock-qr-code-data')
  })

  it('renders loading state initially', () => {
    render(<QRDisplay />)
    // Check for the loading spinner by looking for the SVG element
    const spinner = document.querySelector('svg.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders QR code after loading', async () => {
    render(<QRDisplay />)

    await waitFor(() => {
      expect(screen.getByAltText('QR Code for pickup')).toBeInTheDocument()
    })

    expect(mockApiClient.getDisplayConfig).toHaveBeenCalled()
    expect(mockApiClient.getDisplayQR).toHaveBeenCalled()
    expect(mockQRCode.toDataURL).toHaveBeenCalledWith(
      'STORE_001_DISPLAY_123',
      expect.objectContaining({
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'M'
      })
    )
  })

  it('displays QR code info', async () => {
    render(<QRDisplay />)

    await waitFor(() => {
      expect(screen.getByText(/Display ID: display-/)).toBeInTheDocument()
    })

    expect(screen.getByText(/Expires:/)).toBeInTheDocument()
    expect(screen.getByText('Refresh QR Code')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    mockApiClient.getDisplayQR.mockRejectedValue(new Error('API Error'))

    render(<QRDisplay />)

    await waitFor(() => {
      expect(screen.getByText('Failed to initialize display')).toBeInTheDocument()
    })

    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('calls onQRGenerated callback when QR is generated', async () => {
    const onQRGenerated = jest.fn()
    render(<QRDisplay onQRGenerated={onQRGenerated} />)

    await waitFor(() => {
      expect(onQRGenerated).toHaveBeenCalledWith({
        qrCode: 'STORE_001_DISPLAY_123',
        qrCodeUrl: 'http://localhost:3000/pickup?code=STORE_001_DISPLAY_123',
        displayId: 'display-123',
        expiresAt: expect.any(String)
      })
    })
  })

  it('applies custom size and className', async () => {
    render(<QRDisplay size={128} className="custom-class" />)

    await waitFor(() => {
      const img = screen.getByAltText('QR Code for pickup')
      expect(img).toHaveAttribute('width', '128')
      expect(img).toHaveAttribute('height', '128')
    })

    expect(mockQRCode.toDataURL).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        width: 128
      })
    )
  })
})