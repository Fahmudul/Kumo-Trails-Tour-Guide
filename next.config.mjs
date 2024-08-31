/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https", // Match both http and https protocols
        hostname: "**", // Allow any hostname (any domain)
        port: "", // Allow any port (optional)
        pathname: "**", // Allow any path
      },
    ],
  },
};

export default nextConfig;
