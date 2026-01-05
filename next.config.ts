import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // เพิ่ม body size limit สำหรับ Server Actions (รองรับรูปภาพ base64)
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
