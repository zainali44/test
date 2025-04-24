/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['firebasestorage.googleapis.com', 'picsum.photos','images.unsplash.com','flagcdn.com','cdn-dynmedia-1.microsoft.com','hebbkx1anhila5yf.public.blob.vercel-storage.com']
    },
};

export default nextConfig;
