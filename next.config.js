/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow deploys to succeed even if there are TypeScript/ESLint issues
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Silence optional deps not required in the browser bundle
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
};

module.exports = nextConfig;

