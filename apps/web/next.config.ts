import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@inf-crm/types", "recharts"],
};

export default nextConfig;
