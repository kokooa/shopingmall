/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // 👈 방금 에러난 곳 (배너용)
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',      // 👈 앞으로 쓸 곳 (상품 이미지용)
      },
    ],
  },
};

export default nextConfig;