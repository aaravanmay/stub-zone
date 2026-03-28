/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cards.theshow.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mlb26.theshow.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
