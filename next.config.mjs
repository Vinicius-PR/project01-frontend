/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '/u/**',
        },
        {
            protocol: 'https',
            hostname: '*.googleusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'project01-vini.s3.us-east-2.amazonaws.com',
      }
    ],
  },
};

export default nextConfig;
