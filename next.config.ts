import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Allow the explicit loopback host used by local functional checks.
  allowedDevOrigins: ["127.0.0.1"],
};
export default nextConfig;
