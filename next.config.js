/** @type {import('next').NextConfig} */
const path = require('path');
const transpiled = require('next-transpile-modules')(['echarts', 'zrender']);

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['beethoven-assets.s3.eu-central-1.amazonaws.com'],
      },
    webpack(config) {
        config.resolve.alias['~'] = path.join(__dirname, 'src');
        return config;
    },
};

module.exports = transpiled(nextConfig);
