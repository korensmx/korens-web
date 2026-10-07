/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Incluye los artículos automáticos (data/blog) en la función /api/blog de Vercel
    outputFileTracingIncludes: {
      "/api/blog": ["./data/blog/**/*"],
    },
  },
};

export default nextConfig;
