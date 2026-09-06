import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default position (bottom-left) sits exactly under the collapsed
  // sidebar's control row and intercepted real clicks on it during dev.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lrunbcbnbfeiknbyiaru.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
