/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // Docker 프로덕션 최적화
    webpack: (config) => {
        config.watchOptions = {
            poll: 500,
            aggregateTimeout: 300,
        }
        return config
    },
};

export default nextConfig;
