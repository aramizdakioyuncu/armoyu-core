import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@armoyu/core'],
  allowedDevOrigins: ['192.168.1.13', '192.168.1.11', 'localhost', '127.0.0.1']
};

export default nextConfig;
