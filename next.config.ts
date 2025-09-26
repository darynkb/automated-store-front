import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    MOCK_API: process.env.NODE_ENV === 'development' ? 'true' : 'false',
    STORE_ID: 'store_001',
    QR_CODE_URL: 'https://automated-store.local',
  },
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  // Optimize for performance
  poweredByHeader: false,
  // Compress responses
  compress: true,
};

export default nextConfig;
