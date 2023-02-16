/** @type {import('next').NextConfig} */
const path = require('path');
const transpiled = require('next-transpile-modules')(['echarts', 'zrender']);
const { i18n } = require('./next-i18next.config');

const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,

    webpack(config) {
        config.resolve.alias['~'] = path.join(__dirname, 'src');
        return config;
    },

    i18n,
};

module.exports = transpiled(nextConfig);
