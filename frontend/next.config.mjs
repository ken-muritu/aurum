/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aurum frontend calls the Django + DRF backend directly from the browser.
  // NEXT_PUBLIC_API_URL is inlined at build time. Vercel env var (if set) wins;
  // otherwise this default points at the Render backend.
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://aurum-ou03.onrender.com",
  },
  // The old top-level routes now live under /learn.
  async redirects() {
    return [
      { source: "/dashboard", destination: "/learn", permanent: true },
      { source: "/masteries", destination: "/learn", permanent: true },
      { source: "/masteries/new", destination: "/learn", permanent: true },
      { source: "/generate", destination: "/learn", permanent: true },
      { source: "/discover", destination: "/learn", permanent: true },
    ];
  },
};

export default nextConfig;
