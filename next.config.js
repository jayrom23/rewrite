/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Enable app directory if not already enabled
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
