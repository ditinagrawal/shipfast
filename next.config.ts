import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: `${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.t3.storageapi.dev`,
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
