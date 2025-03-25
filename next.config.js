/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "bodynsol.com",
      "bodynsol.vercel.app",
      "images.unsplash.com",
      "via.placeholder.com",
      "picsum.photos",
      "video.wixstatic.com",
      "i.imgur.com",
      "imgur.com",
      "cdn.pixabay.com",
      "res.cloudinary.com",
      "media.giphy.com",
      "giphy.com",
      "drive.google.com",
      "lh3.googleusercontent.com",
      "storage.googleapis.com",
      "firebasestorage.googleapis.com",
      "s3.amazonaws.com",
      "amazonaws.com",
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "player.vimeo.com",
      "img.youtube.com",
      "i.ytimg.com",
      "ytimg.com",
      "videos.ctfassets.net",
      "videos.contentful.com",
      "assets.contentful.com",
      "images.contentful.com",
      "dl.dropboxusercontent.com",
      "dropbox.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 개발 환경에서는 최적화하지 않음
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    largePageDataBytes: 128 * 100000, // 기본값 128KB를 증가
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 타입 체크 오류 무시
  },
  // 모든 페이지에 대해 동적 렌더링 설정
  output: "standalone",
  reactStrictMode: true,
  // 정적 생성 비활성화
  staticPageGenerationTimeout: 1000,
  // 모든 페이지를 서버 사이드 렌더링으로 처리
  trailingSlash: false,
  // 정적 생성 완전히 비활성화
  distDir: ".next",
  // 모든 페이지를 동적으로 렌더링
  env: {
    NEXT_PUBLIC_FORCE_DYNAMIC: "true",
  },
};

module.exports = nextConfig;
