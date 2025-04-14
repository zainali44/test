/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['firebasestorage.googleapis.com', 'picsum.photos','images.unsplash.com']
    },
};

export default nextConfig;
