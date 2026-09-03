import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The parent folder is another Next app; pin the root so Turbopack does not
  // walk up and pick up its proxy/config.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'wzjlqgkafsqwczfmxson.supabase.co' },
    ],
  },
};

export default nextConfig;
