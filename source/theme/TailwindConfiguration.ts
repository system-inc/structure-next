// Dependencies - Project
// Have to use relative paths for tailwind.config.js
import { ProjectSettings } from './../../../../ProjectSettings';

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

    theme: {
        // Container configuration - Controls centered page content
        // Sets consistent padding and constrains maximum width to 980px on larger screens
        // Full width on mobile and small screens, fixed width at lg breakpoint and above
        container: {
            center: true,
            padding: {
                DEFAULT: '1.5rem',
            },
            screens: {
                DEFAULT: '100%',
                sm: '100%',
                lg: '980px',
                xl: '980px',
                '2xl': '980px',
            },
        },

        extend: {
            colors: {
                background: {
                    DEFAULT: 'var(--background-primary)',
                    primary: 'var(--background-primary)',
                    'primary-subtle': 'var(--background-primary-subtle)',
                    secondary: 'var(--background-secondary)',
                    tertiary: 'var(--background-tertiary)',
                    quartary: 'var(--background-quartary)',
                    overlay: 'var(--background-overlay)',
                },

                foreground: {
                    DEFAULT: 'var(--foreground-primary)',
                    primary: 'var(--foreground-primary)',
                    secondary: 'var(--foreground-secondary)',
                    tertiary: 'var(--foreground-tertiary)',
                    placeholder: 'var(--foreground-placeholder)',
                    disabled: 'var(--foreground-disabled)',
                },

                border: {
                    DEFAULT: 'var(--border-primary)',
                    primary: 'var(--border-primary)',
                    secondary: 'var(--border-secondary)',
                    tertiary: 'var(--border-tertiary)',
                    contrast: 'var(--border-contrast)',
                },

                link: {
                    DEFAULT: 'var(--link-primary-default)',
                    hover: 'var(--link-primary-hover)',
                    pressed: 'var(--link-primary-pressed)',
                    secondary: {
                        DEFAULT: 'var(--link-secondary-default)',
                        hover: 'var(--link-secondary-hover)',
                        pressed: 'var(--link-secondary-pressed)',
                    },
                    muted: {
                        DEFAULT: 'var(--link-muted-default)',
                        hover: 'var(--link-muted-hover)',
                        pressed: 'var(--link-muted-pressed)',
                    },
                    contrast: {
                        DEFAULT: 'var(--link-primary-contrast-default)',
                        hover: 'var(--link-primary-contrast-hover)',
                        pressed: 'var(--link-primary-contrast-pressed)',
                        disabled: 'var(--link-primary-contrast-disabled)',
                    },
                    disabled: 'var(--link-primary-disabled)',
                },

                effects: {
                    shadow: {
                        DEFAULT: 'var(--effects-shadow-default)',
                        strong: 'var(--effects-shadow-strong)',
                        subtle: { dark: 'var(--effects-shadow-subtle-dark)' },
                        default: { dark: 'var(--effects-shadow-default-dark)' },
                    },
                },

                action: {
                    primary: {
                        DEFAULT: 'var(--action-primary-default)',
                        hover: 'var(--action-primary-hover)',
                        pressed: 'var(--action-primary-pressed)',
                        contrast: {
                            DEFAULT: 'var(--action-primary-contrast-default)',
                            hover: 'var(--action-primary-contrast-hover)',
                            pressed: 'var(--action-primary-contrast-pressed)',
                        },
                    },
                    secondary: {
                        DEFAULT: 'var(--action-secondary-default)',
                        hover: 'var(--action-secondary-hover)',
                        pressed: 'var(--action-secondary-pressed)',
                    },
                    ghost: {
                        DEFAULT: 'var(--action-ghost-default)',
                        hover: 'var(--action-ghost-hover)',
                        pressed: 'var(--action-ghost-pressed)',
                    },
                    destructive: {
                        DEFAULT: 'var(--action-destructive-default)',
                        hover: 'var(--action-destructive-hover)',
                        pressed: 'var(--action-destructive-pressed)',
                    },
                    general: {
                        light: 'var(--action-general-light)',
                        dark: 'var(--action-general-dark)',
                        gray: 'var(--action-general-gray)',
                        disabled: 'var(--action-general-disabled)',
                        contrast: {
                            light: 'var(--action-general-contrast-light)',
                            dark: 'var(--action-general-contrast-dark)',
                        },
                    },
                },

                badge: {
                    success: {
                        foreground: 'var(--badge-success-foreground)',
                        background: 'var(--badge-success-background)',
                    },
                    danger: {
                        foreground: 'var(--badge-danger-foreground)',
                        background: 'var(--badge-danger-background)',
                    },
                    warning: {
                        foreground: 'var(--badge-warning-foreground)',
                        background: 'var(--badge-warning-background)',
                    },
                    info: {
                        foreground: 'var(--badge-info-foreground)',
                        background: 'var(--badge-info-background)',
                    },
                },
            },

            backgroundImage: {
                logoLight: 'url(' + ProjectSettings.assets.logo.light.location + ')',
                logoDark: 'url(' + ProjectSettings.assets.logo.dark.location + ')',
            },

            blur: {
                'gradient-bg': '150px',
            },

            borderRadius: {
                none: 'var(--border-radius-none)',
                'extra-small': 'var(--border-radius-extra-small)',
                small: 'var(--border-radius-small)',
                medium: 'var(--border-radius-medium)',
                large: 'var(--border-radius-large)',
                'extra-large': 'var(--border-radius-extra-large)',
                full: 'var(--border-radius-full)',
            },

            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                blink: {
                    '0%': {
                        opacity: '1',
                    },
                    '20%,50%': {
                        opacity: '0',
                    },
                    '70%,100%': {
                        opacity: '1',
                    },
                },
                blinkOnce: {
                    '0%': { opacity: '1' },
                    '50%': { opacity: '0.25' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(75%)' },
                },
            },

            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                blink: 'blink 1.3s ease-in-out infinite',
                blinkOnce: 'blinkOnce 500ms linear',
                shimmer: 'shimmer 5s infinite',
            },

            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'soft-out-expo': 'cubic-bezier(0.25,0,0,1)',
            },
        },
    },

    // Base plugins that would be used across projects
    plugins: [TailwindCssAnimate, ContainerQueryPlugin],
} satisfies TailwindConfigurationInterface;
