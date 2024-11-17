/** @type {import('next').NextConfig} */
const config = {
    images: {
        domains: ['picsum.photos'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'replicate.com'
            },
            {
                protocol: 'https',
                hostname: 'replicate.delivery'
            }
        ]
    }
}

export default config
