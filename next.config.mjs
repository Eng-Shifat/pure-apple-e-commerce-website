// SAVE PATH: next.config.mjs
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
    // optimized image ১ মাস cache থাকবে — বারবার নতুন করে বানাতে হবে না
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/webp"],
  },
};

export default nextConfig;
