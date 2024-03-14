/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WC_PROJECT_ID: process.env.WC_PROJECT_ID,
    NEXT_PUBLIC_SIGNIN_MESSAGE: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

export default nextConfig;
