/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "puaebozvrhhsoseywzuj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    qualities: [75, 90],
  },
};

export default nextConfig;
