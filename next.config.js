// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    transpilePackages: ['echarts', 'zrender'],

    webpack(config) {
        config.resolve.alias['~'] = path.join(__dirname, 'src');
        return config;
    },
};

module.exports = withSentryConfig(nextConfig, { silent: true }, { hideSourcemaps: true });
