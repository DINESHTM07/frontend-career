/** @type {import('next').NextConfig} */

/**
 * next.config.js — Next.js 14 configuration
 *
 * Key settings:
 *  - images.remotePatterns: whitelist external image domains for next/image
 *  - experimental.serverComponentsExternalPackages: packages that need Node.js
 *    runtime on the server (not bundled by webpack)
 */
const nextConfig = {
  images: {
    // Allow images from these external domains (used with next/image)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile pictures (NextAuth)
      },
      {
        protocol: "https",
        // Your Supabase storage bucket — replace with your project ref
        hostname: "*.supabase.co",
      },
    ],
  },

  // Packages that rely on Node.js built-ins (fs, crypto, etc.) and should
  // NOT be bundled by webpack when running in Server Components
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};

module.exports = nextConfig;
