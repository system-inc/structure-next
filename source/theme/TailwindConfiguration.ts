/**
 * Structure Theme System
 *
 * Philosophy:
 * This theme system uses a letter-based hierarchy (A/B/C/D/etc.) for visual levels and
 * semantic words (positive/negative/disabled) for meaningful states. This approach provides:
 * - Scalability: Can extend without inventing Latin words
 * - Brevity: Short class names (background--a vs bg-opsis-background-primary)
 * - Consistency: Same pattern across backgrounds, foregrounds, borders, links
 * - Clarity: Letters = hierarchy, Words = meaning
 *
 * Double-Dash Naming Convention:
 * We use double-dash (--) in our utility class names (background--a, border--b, foreground--c)
 * to avoid conflicts with Tailwind's built-in utilities:
 * - border-b (Tailwind) = border-bottom
 * - border--b (Ours) = border variant B
 * The double-dash also signals "this is a custom design token" and follows BEM-style conventions
 * where -- indicates a variant/modifier. It provides clear visual distinction when scanning code.
 *
 * Architecture:
 *
 * 1. Foundation Layer (0-1000 Scales) - Granular color values
 *    Location: ./styles/variables.css
 *    - light-0 to light-1000 (transparent whites)
 *    - dark-0 to dark-1000 (transparent blacks)
 *    - black-0 to black-1000 (opaque grays to pure black)
 *    - white-0 to white-1000 (opaque grays to pure white)
 *    - gray-0 to gray-1000 (opaque middle grays)
 *    Use: Rarely used directly, these are the building blocks for semantic tokens.
 *    Can be accessed as CSS variable (var(--color-gray-500)) or Tailwind utility
 *    (bg-gray-500, text-gray-500, border-gray-500, etc.)
 *
 * 2. Semantic Token Layer (Letter-Based) - Design decisions
 *    Location: ./styles/variables.css
 *    - --background--a, b, c, etc. (hierarchy: page, page accent, dialogs, tips, etc.)
 *    - --foreground--a, b, c, etc. (hierarchy: primary, secondary, tertiary, etc.)
 *    - --border--a, b, c, etc. (hierarchy: primary, secondary, tertiary, etc.)
 *    - --link--a, b, c, etc. (hierarchy: primary, secondary, tertiary, etc.)
 *    - Semantic tokens: --foreground--positive, --foreground--negative, --foreground--disabled, etc.
 *    Use: These are the CSS variables you reference when creating utilities.
 *
 * 3. Utility Class Layer - What developers use
 *    Location: ./styles/utilities.css
 *    - background--a { background-color: var(--background--a); }
 *    - foreground--a { color: var(--foreground--a); }
 *    - border--a { border-color: var(--border--a); }
 *    - link--a { color: var(--link--a); (include :hover and :active states) }
 *    Use: These are the classes you use in components.
 *
 * Usage in Components:
 *
 * ```tsx
 * // Letter-based hierarchy with double-dash
 * <div className="background--a foreground--a border border--a">
 *   <Link className="link--a">Click me</Link>
 * </div>
 *
 * // With Tailwind modifiers
 * <div className="background--a hover:background--b focus:background--c">
 *   Theme colors with hover and focus states
 * </div>
 *
 * // Semantic states
 * <input className="border--focus foreground--placeholder" />
 * <span className="foreground--positive">Success!</span>
 * <span className="foreground--negative">Error!</span>
 *
 * // Mixing Tailwind and custom utilities
 * <div className="flex items-center p-4 background--c border border--a">
 *   Tailwind (flex, items-center, p-4, border) + Custom (background--c, border--a)
 * </div>
 * ```
 *
 * Adding New Tokens (Structure Layer):
 *
 * 1. Define CSS variable in variables.css:
 *    --background--x: light-dark(var(--color-white-500), var(--color-black-500));
 *
 * 2. Create utility class in utilities.css:
 *    @utility background--x { background-color: var(--background--x); }
 *
 * That's it! Tailwind automatically generates hover:background--x, md:background--x, etc.
 *
 * Project-specific Extensions:
 *
 * Projects can add their own tokens in /app/_theme/styles/:
 *
 * 1. variables.css - Define project-specific CSS variables
 *    Example: --link--blue, --link--blue-hover
 *
 * 2. utilities.css - Create project-specific utility classes
 *    Example: @utility link--blue { color: var(--link--blue); }
 *
 * 3. animations.css - Add project-specific animations
 *    Example: @keyframes borderGlow { ... }
 *
 * Projects automatically inherit all Structure tokens via CSS @import in theme.css
 *
 * Why use .css Files Instead of the Tailwind Configuration?
 *
 * We define utilities in CSS using @utility rather than Tailwind configuration files because:
 * ✅ Handles complex states (link hover/active) in one class
 * ✅ Single source of truth (just CSS variables + utilities)
 * ✅ Less duplication (no need to map colors in both CSS and configuration)
 * ✅ More explicit (you see exactly what utilities exist)
 * ✅ All Tailwind modifiers still work (hover:, md:, etc.)
 *
 * Light and Dark Mode:
 *
 * We use modern CSS `light-dark()` with Tailwind v4's `scheme-*` utilities for theme control:
 *
 * How It Works:
 * 1. Semantic tokens use `light-dark(lightValue, darkValue)` in variables.css
 *    Example: --background--a: light-dark(var(--color-white-1000), var(--color-black-700));
 *
 * 2. The `scheme-*` classes on <html> control which value is used:
 *    - scheme-light: Forces light mode (uses first value in light-dark())
 *    - scheme-dark: Forces dark mode (uses second value in light-dark())
 *    - scheme-light-dark: Respects system preference (prefers-color-scheme)
 *
 * 3. Users toggle theme via ThemeToggle component, which updates the <html> class
 *
 * Browser Support:
 * - Modern browsers (2024+): Full support for light-dark() and color-scheme
 * - Older browsers: Gracefully degrade to light mode (fallback values in variables.css)
 *
 * Light Islands (Components that stay light regardless of page theme):
 *
 * Apply `scheme-light` to any container along with background/foreground tokens:
 *
 * ```tsx
 * <div className="scheme-light background--a foreground--a p-6 rounded-lg">
 *   This stays light even when page is in dark mode
 * </div>
 * ```
 *
 * The `scheme-light` class overrides the parent's color-scheme, making all `light-dark()`
 * functions within that container use the light value. Works with any nesting depth.
 *
 * Dark Islands (force dark in light mode):
 *
 * ```tsx
 * <div className="scheme-dark background--a foreground--a p-6 rounded-lg">
 *   This stays dark even when page is in light mode
 * </div>
 * ```
 *
 * Tailwind Configuration File Usage:
 *
 * This file should remain minimal and only contain:
 * - Content paths (for class scanning)
 * - Container settings
 * - Project-agnostic plugins
 *
 * Do not add colors, spacing, or utilities here - use the .css files instead.
 */

// Dependencies - Project
// Have to use relative paths for tailwind.config.js
import { ProjectSettings } from './../../../../ProjectSettings';

// Dependencies - Theme
import type { Config as TailwindConfigurationInterface } from 'tailwindcss';
// import tailwindPlugin from 'tailwindcss/plugin';

// Tailwind Configuration - Base configuration to be extended by projects
export const TailwindConfiguration = {
    // Content paths for Tailwind to scan for class names
    content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './libraries/**/*.{js,ts,jsx,tsx,mdx}'],

    theme: {
        // For the "container" className, center and add horizontal padding
        container: {
            center: true,
            padding: {
                DEFAULT: '1.5rem', // Tailwind just applies this padding horizontally
            },
        },
        // Utility classes are defined in global.css using @layer utilities
        // Animations and keyframes are defined in animations.css
        // Use CSS files to define utilities, not the Tailwind configuration file
        extend: {
            // Custom background images for logos using className "bg-logo-light" or "bg-logo-dark"
            backgroundImage: {
                'logo-light': 'url(' + ProjectSettings.assets.logo.light.location + ')',
                'logo-dark': 'url(' + ProjectSettings.assets.logo.dark.location + ')',
            },
        },
    },
    // Plugins used across all projects
    plugins: [],
} satisfies TailwindConfigurationInterface;
