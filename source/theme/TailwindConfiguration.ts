// Dependencies - Theme
import type { Config as TailwindConfigurationInterface } from 'tailwindcss';
import ContainerQueryPlugin from '@tailwindcss/container-queries';
import TailwindCssAnimate from 'tailwindcss-animate';

// Tailwind Configuration - Base configuration to be extended by projects
export const TailwindConfiguration = {
    // Content paths
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './libraries/**/*.{js,ts,jsx,tsx,mdx}',
        './source/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    // Dark mode
    darkMode: ['variant', ['&:not(.light *, .light):where(.dark *)']],

    // Common animations and keyframes
    theme: {
        extend: {
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(75%)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                shimmer: 'shimmer 5s infinite',
            },

            // Common transition timing functions
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'soft-out-expo': 'cubic-bezier(0.25,0,0,1)',
            },
        },
    },

    // Base plugins that would be used across projects
    plugins: [TailwindCssAnimate, ContainerQueryPlugin],
} satisfies TailwindConfigurationInterface;

// Export - Default
export default TailwindConfiguration;
