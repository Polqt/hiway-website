import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@supabase/ssr', '@radix-ui/react-checkbox', '@radix-ui/react-label', '@radix-ui/react-separator', '@radix-ui/react-slot']
  },
};

export default nextConfig;
