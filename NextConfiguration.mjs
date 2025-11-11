// Dependencies
import { initOpenNextCloudflareForDev as initializeOpenNextCloudflareForDevelopment } from '@opennextjs/cloudflare';

// Initialize OpenNext for Cloudflare Workers in development mode
initializeOpenNextCloudflareForDevelopment();

// Next Configuration
/** @type {import('next').NextConfig} */
export const NextConfiguration = {
    reactCompiler: true,
    images: {
        unoptimized: true, // Do not optimize images as we are on Cloudflare not Vercel
    },
    // optimizeFonts: false, // Do not optimize fonts as we are on Cloudflare not Vercel
    turbopack: {
        rules: {
            // Convert SVG files to React components using SVGR
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
            // Import markdown files as strings
            '*.md': {
                loaders: ['raw-loader'],
                as: '*.js',
            },
            // Import code files as strings (used for WebSocket shared worker)
            '*.code.js': {
                loaders: ['raw-loader'],
                as: '*.js',
            },
            '*.code.ts': {
                loaders: ['raw-loader'],
                as: '*.js',
            },
        },
    },
};
