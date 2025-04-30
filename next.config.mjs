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
        NEXTAPI_URL: 'http://localhost:8000/',
        NEXT_API: 'http://localhost:8000',
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
