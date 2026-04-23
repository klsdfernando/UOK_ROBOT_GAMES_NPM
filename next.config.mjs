/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robotbattles.ecsc-uok.com",
        pathname: "/People/**",
      },
    ],
  },
};

export default nextConfig;
