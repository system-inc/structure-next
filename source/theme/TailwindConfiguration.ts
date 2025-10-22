/**
 * Structure Theme System
 *
 * Philosophy:
 * This theme system uses a numeric hierarchy (--0-10) for visual levels and
 * semantic words (positive/negative/disabled) for meaningful states. This approach provides:
 * - Intuitive scaling: --0 is base, --10 is maximum, ---1/---2/---3 extend beyond base
 * - Brevity: Short class names (background--5 vs bg-opsis-background-primary)
 * - Consistency: Same pattern across backgrounds, borders, and content
 * - Mental model: "How far from base?" with numbers everyone understands
 *
 * Double-Dash Naming Convention:
 * We use double-dash (--) in our utility class names (background--0, border--5, content--3)
 * to avoid conflicts with Tailwind's built-in utilities:
 * - border-1 (Tailwind) = 1px border width
 * - border--1 (Ours) = border variant 1
 * The double-dash also signals "this is a custom design token" and follows BEM-style conventions
 * where -- indicates a variant/modifier. It provides clear visual distinction when scanning code.
 *
 * Architecture:
 *
 * 1. Theme Variables Layer (0-1000 Scales) - Primitive building blocks
 *    Location: ./styles/variables.css (@theme block)
 *    - light-0 to light-1000 (transparent whites)
 *    - dark-0 to dark-1000 (transparent blacks)
 *    - black-0 to black-1000 (opaque grays to pure black)
 *    - white-0 to white-1000 (opaque grays to pure white)
 *    - gray-0 to gray-1000 (opaque middle grays)
 *    Use: These auto-generate Tailwind utilities (bg-*, text-*, border-*, etc.)
 *    Can be accessed as CSS variable (var(--color-gray-500)) or utility class
 *    (bg-gray-500, text-gray-500, border-gray-500, etc.)
 *
 * 2. Custom Utility Layer - Semantic design utilities
 *    Location: ./styles/utilities.css
 *    - background--0 through background--10 (0=base, 10=maximum, 50-step progression)
 *    - background---1, ---2, ---3 (extend beyond base in reverse direction)
 *    - content--0 through content--10 (0=primary, 10=lowest emphasis)
 *    - content---1, ---2, ---3 (extend beyond primary in reverse)
 *    - border--0 through border--10 (0=primary, 10=most subtle)
 *    - border---1, ---2, ---3 (extend beyond primary in reverse)
 *    - Semantic utilities: content--positive, content--negative, content--disabled, etc.
 *    Use: These are defined with inline light-dark() in utilities.css, no CSS variables needed.
 *
 * Usage in Components:
 *
 * ```tsx
 * // Numeric hierarchy with double-dash
 * <div className="background--0 content--0 border border--0">
 *   Primary background, primary content, primary border
 * </div>
 *
 * // With Tailwind modifiers
 * <div className="background--0 hover:background--1 focus:background--2">
 *   Theme colors with hover and focus states (0 → 1 → 2)
 * </div>
 *
 * // Using the full range (--0-10 + reverse ---1/---2/---3)
 * <div className="background---1">Lighter/darker than base</div>
 * <div className="background--0">Base background</div>
 * <div className="background--5">Medium emphasis</div>
 * <div className="background--10">Maximum emphasis</div>
 *
 * // Semantic states
 * <input className="border--focus content--placeholder" />
 * <span className="content--positive">Success!</span>
 * <span className="content--negative">Error!</span>
 *
 * // Mixing Tailwind and custom utilities
 * <div className="flex items-center p-4 background--2 border border--0">
 *   Tailwind (flex, items-center, p-4, border) + Custom (background--2, border--0)
 * </div>
 * ```
 *
 * Design System Scale:
 *
 * The numeric scale (--0-10) provides 11 options with intuitive progression:
 * - --0: Base/primary
 * - --1-3: Slight progression from base
 * - --4-7: Medium range
 * - --8-10: Maximum range
 * - ---1, ---2, ---3: Reverse direction (lighter in light mode, darker in dark mode (for backgrounds))
 *
 * Total: 14 utilities per category (background, border, content)
 * Plus semantic utilities (positive, negative, warning, informative, disabled, etc.)
 *
 * Adding New Utilities (Structure Layer):
 *
 * Simply add to utilities.css with inline light-dark():
 *    @utility background--new {
 *        background-color: light-dark(var(--color-white-500), var(--color-black-500));
 *    }
 *
 * That's it! Tailwind automatically generates hover:background--new, md:background--new, etc.
 * No CSS variables needed - everything is defined in one place.
 *
 * Project-specific Extensions:
 *
 * Projects can add their own utilities in /app/_theme/styles/:
 *
 * 1. variables.css - Define project-specific Theme Variables (in @theme block)
 *    Example: --color-brand-500: #ff6b6b;
 *
 * 2. utilities.css - Create project-specific utility classes
 *    Example: @utility background--positive {
 *        background-color: light-dark(var(--color-green-600), var(--color-green-400));
 *    }
 *
 * 3. animations.css - Add project-specific animations
 *    Example: @keyframes borderGlow { ... }
 *
 * Projects automatically inherit all Structure utilities via CSS @import in theme.css
 *
 * Why use .css Files Instead of the Tailwind Configuration?
 *
 * We define utilities in CSS using @utility rather than Tailwind configuration files because:
 * ✅ Handles complex states (link hover/active) in one class
 * ✅ Single source of truth (utilities.css has both definition and values)
 * ✅ Less duplication (no separate CSS variables file for single-use values)
 * ✅ More explicit (you see exactly what utilities exist and their values)
 * ✅ All Tailwind modifiers still work (hover:, md:, etc.)
 *
 * Light and Dark Mode:
 *
 * We use modern CSS `light-dark()` with Tailwind v4's `scheme-*` utilities for theme control:
 *
 * How It Works:
 * 1. Semantic tokens use `light-dark(lightValue, darkValue)` in variables.css
 *    Example: --background--0: light-dark(var(--color-white-1000), var(--color-black-700));
 *
 * 2. The `scheme-*` classes on <html> control which value is used:
 *    - scheme-light: Forces light mode (uses first value in light-dark())
 *    - scheme-dark: Forces dark mode (uses second value in light-dark())
 *    - scheme-light-dark: Respects system preference (prefers-color-scheme)
 *
 * 3. Users toggle theme via ThemeToggle component, which updates the <html> class
 *
 * Light Islands (Components that stay light regardless of page theme):
 *
 * Apply `scheme-light` to any container along with background/foreground tokens:
 *
 * ```tsx
 * <div className="scheme-light background--0 content--0 p-6 rounded-lg">
 *   This stays light even when page is in dark mode
 * </div>
 * ```
 *
 * The `scheme-light` class overrides the parent's color-scheme, making all `light-dark()`
 * functions within that container use the light value. Works with any nesting depth.
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

    // Dark mode strategy, use class selector instead of media query (so dark: works)
    darkMode: ['selector', '.scheme-dark'],

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
