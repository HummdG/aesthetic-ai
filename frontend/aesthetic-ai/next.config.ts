import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Core Configuration */
  reactStrictMode: true,
  swcMinify: true,
  
  /* Performance & Optimization */
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    serverComponentsExternalPackages: ['sharp'],
    typedRoutes: true,
  },
  
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
            value: 'camera=(), microphone=(), geolocation=()',
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
  
  /* Webpack Configuration */
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack config for AI/ML libraries
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Optimize for AI image processing
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'sharp$': false,
        'onnxruntime-node$': false,
      };
    }
    
    return config;
  },
  
  /* TypeScript Configuration */
  typescript: {
    ignoreBuildErrors: false,
  },
  
  /* ESLint Configuration */
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },
  
  /* Compiler Options */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  /* API Routes */
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  
  /* Internationalization (if needed) */
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
  
  /* Logging */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  /* Bundle Analyzer (uncomment to use) */
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
};

export default nextConfig;