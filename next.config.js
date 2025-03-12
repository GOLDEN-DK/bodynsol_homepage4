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
    unoptimized: true,
  },
  experimental: {
    largePageDataBytes: 128 * 100000, // 기본값 128KB를 증가
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
