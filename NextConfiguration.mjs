// Dependencies
import { initOpenNextCloudflareForDev as initializeOpenNextCloudflareForDevelopment } from '@opennextjs/cloudflare';

// Initialize OpenNext for Cloudflare Workers in development mode
initializeOpenNextCloudflareForDevelopment();

// Next Configuration
/** @type {import('next').NextConfig} */
export const NextConfiguration = {
    // optimizeFonts: false, // Do not optimize fonts as we are on Cloudflare not Vercel
    images: {
        unoptimized: true, // Do not optimize images as we are on Cloudflare not Vercel
    },
    webpack(configuration) {
        // Configures webpack to handle SVG files with SVGR. SVGR optimizes and transforms SVG files
        // into React components. See https://react-svgr.com/docs/next/ for more information.

        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = configuration.module.rules.find((rule) => rule.test?.test?.('.svg'));

        configuration.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
            // Add support for importing .md files
            {
                test: /\.md$/,
                type: 'asset/source',
            },
            // Add support for importing code files as strings
            {
                test: /\.code\.(js|ts)$/,
                type: 'asset/source',
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return configuration;
    },
};
