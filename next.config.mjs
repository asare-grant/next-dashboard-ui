/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
