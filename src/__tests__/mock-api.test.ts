import { mockDataStore, simulateDelay, MockApiClient } from '@/lib/mock-api';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)
}));

describe('Mock API System', () => {
  describe('MockDataStore', () => {
    test('should validate QR codes correctly', () => {
      expect(mockDataStore.isValidQRCode('STORE_001_BOX_A')).toBe(true);
      expect(mockDataStore.isValidQRCode('STORE_001_TEST')).toBe(true);
      expect(mockDataStore.isValidQRCode('INVALID_CODE')).toBe(false);
    });

    test('should process scan and return scan data', () => {
      const qrCode = 'STORE_001_BOX_A';
      const scanResult = mockDataStore.processScan(qrCode);

      expect(scanResult).toMatchObject({
        isValid: true,
        storeId: 'STORE_001',
        canProceed: true
      });
      expect(scanResult.scanId).toBeDefined();
      expect(scanResult.availableBoxes).toBeGreaterThan(0);
    });

    test('should retrieve scan status', () => {
      const qrCode = 'STORE_001_BOX_B';
      const scanResult = mockDataStore.processScan(qrCode);
      const scanStatus = mockDataStore.getScanStatus(scanResult.scanId);

      expect(scanStatus).toEqual(expect.objectContaining({
        scanId: scanResult.scanId,
        qrCode: qrCode
      }));
    });

    test('should start pickup process', () => {
      const qrCode = 'STORE_001_BOX_C';
      const scanResult = mockDataStore.processScan(qrCode);
      const pickup = mockDataStore.startPickup(scanResult.scanId);

      expect(pickup).toMatchObject({
        scanId: scanResult.scanId,
        status: 'initiated',
        progress: 0
      });
      expect(pickup?.pickupId).toBeDefined();
      expect(pickup?.estimatedTime).toBeGreaterThan(0);
    });

    test('should return null for invalid scan ID when starting pickup', () => {
      const pickup = mockDataStore.startPickup('invalid-scan-id');
      expect(pickup).toBeNull();
    });

    test('should complete pickup process', () => {
      const qrCode = 'TEST_QR_CODE';
      const scanResult = mockDataStore.processScan(qrCode);
      const pickup = mockDataStore.startPickup(scanResult.scanId);
      
      if (pickup) {
        const completedPickup = mockDataStore.completePickup(pickup.pickupId);
        expect(completedPickup).toMatchObject({
          pickupId: pickup.pickupId,
          status: 'completed',
          progress: 100
        });
        expect(completedPickup.completedAt).toBeDefined();
      }
    });

    test('should return system status', () => {
      const systemStatus = mockDataStore.getSystemStatus();
      
      expect(systemStatus).toMatchObject({
        status: 'online',
        services: {
          scanner: true,
          display: true,
          api: true
        }
      });
      expect(systemStatus.uptime).toBeGreaterThanOrEqual(0);
      expect(systemStatus.lastUpdate).toBeDefined();
    });

    test('should return store information', () => {
      const storeInfo = mockDataStore.getStoreInfo();
      
      expect(storeInfo).toMatchObject({
        name: 'Automated Store MVP',
        location: 'Demo Location',
        operatingHours: '24/7'
      });
      expect(storeInfo.instructions.en).toBeDefined();
      expect(storeInfo.instructions.kz).toBeDefined();
    });

    test('should generate display QR code', () => {
      const qrData = mockDataStore.generateDisplayQR();
      
      expect(qrData).toMatchObject({
        qrCode: expect.stringContaining('STORE_001_DISPLAY_'),
        displayId: expect.any(String),
        qrCodeUrl: expect.stringContaining('pickup?code=')
      });
      expect(qrData.expiresAt).toBeDefined();
    });

    test('should return display configuration', () => {
      const displayConfig = mockDataStore.getDisplayConfig();
      
      expect(displayConfig).toMatchObject({
        refreshInterval: 30000,
        qrSize: 256,
        showInstructions: true,
        language: 'both',
        theme: 'light'
      });
    });
  });

  describe('simulateDelay', () => {
    test('should simulate network delay', async () => {
      const startTime = Date.now();
      await simulateDelay(100, 200);
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(300); // Allow some buffer for test execution
    });

    test('should use default delay range', async () => {
      const startTime = Date.now();
      await simulateDelay();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(600); // Allow some buffer for test execution
    });
  });

  describe('MockApiClient', () => {
    let apiClient: MockApiClient;

    beforeEach(() => {
      apiClient = new MockApiClient();
      
      // Mock fetch for testing
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should make successful API request', async () => {
      const mockResponse = {
        success: true,
        data: { test: 'data' },
        timestamp: new Date().toISOString()
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (apiClient as any).request('/test');
      expect(result).toEqual({ test: 'data' });
    });

    test('should handle API errors', async () => {
      const mockResponse = {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Test error message'
        },
        timestamp: new Date().toISOString()
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect((apiClient as any).request('/test')).rejects.toThrow('Test error message');
    });

    test('should handle API errors without message', async () => {
      const mockResponse = {
        success: false,
        timestamp: new Date().toISOString()
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect((apiClient as any).request('/test')).rejects.toThrow('API request failed');
    });
  });
});