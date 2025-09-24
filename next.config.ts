
import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'tradelight'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
