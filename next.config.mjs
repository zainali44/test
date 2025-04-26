/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['firebasestorage.googleapis.com', 'picsum.photos','images.unsplash.com','flagcdn.com','cdn-dynmedia-1.microsoft.com','hebbkx1anhila5yf.public.blob.vercel-storage.com','img.freepik.com',
            'storage.googleapis.com','upload.wikimedia.org','cdn.pixabay.com','cdn-icons-png.flaticon.com']
    },
    env: {
        NEXTAPI_URL: 'https://a551-154-192-2-32.ngrok-free.app',
    },
};

export default nextConfig;
