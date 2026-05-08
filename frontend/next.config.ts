import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/uploads/covers/**" }],
  },
};

export default nextConfig;
