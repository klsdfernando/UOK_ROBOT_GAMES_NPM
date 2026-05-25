/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robotbattles.ecsc-uok.com",
        pathname: "/People/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
