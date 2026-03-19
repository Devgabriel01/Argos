/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite consumir a API do backend NestJS sem bloqueio de CORS em dev
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
