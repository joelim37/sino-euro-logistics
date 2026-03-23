const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || '/portal-se-eu-7k9x2m';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: ADMIN_BASE_PATH,
        destination: '/admin/login',
      },
      {
        source: `${ADMIN_BASE_PATH}/:path*`,
        destination: '/admin/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vcsqufwvtapazytctlcg.supabase.co',
      },
    ],
  },
};

export default nextConfig;
