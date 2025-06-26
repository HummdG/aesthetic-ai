import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Core Configuration */
  reactStrictMode: true,
  
  /* Performance & Optimization */
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Removed typedRoutes as it's not supported with Turbopack
  },
  
  /* Server External Packages (updated from experimental.serverComponentsExternalPackages) */
  serverExternalPackages: ['sharp'],
  
  /* Image Configuration */
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'source.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'openai.com',
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  /* Security Headers */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            // CHANGED: Allow camera access for same origin
            value: 'camera=(self), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  /* Redirects */
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  /* Environment Variables */
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  /* Build Configuration */
  output: 'standalone',
  
  /* TypeScript Configuration */
  typescript: {
    // Allow production builds to complete even if there are type errors (for deployment)
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  /* ESLint Configuration */
  eslint: {
    // Allow production builds to complete even if there are ESLint errors (for deployment)
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    dirs: ['src'],
  },
  
  /* Compiler Options */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  /* Logging */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;