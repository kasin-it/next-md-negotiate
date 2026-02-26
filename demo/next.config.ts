import { createRewritesFromConfig } from 'next-md-negotiate';
import { mdConfig } from './md.config';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: createRewritesFromConfig(mdConfig),
    };
  },

  /* config options here */
};

export default nextConfig;
