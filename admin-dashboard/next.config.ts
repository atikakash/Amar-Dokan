import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
