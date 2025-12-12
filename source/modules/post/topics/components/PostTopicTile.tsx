'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { Theme } from '@structure/source/theme/ThemeTypes';

// Dependencies - Hooks
import { useThemeSettings } from '@structure/source/theme/hooks/useThemeSettings';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Utilities
import { getRainbowHexColorForTheme, lightenColor } from '@structure/source/utilities/style/Color';

// Component - PostTopicTile
export interface PostTopicTileProperties {
    href: string;
    title: string;
    description?: string | null;
    postCount?: number;
    icon?: React.ReactElement<{ className?: string; style?: React.CSSProperties }>;
    rainbowPosition: number; // 0-1 value for rainbow color position
}
export function PostTopicTile(properties: PostTopicTileProperties) {
    // Hooks
    const themeSettings = useThemeSettings();

    // Calculate rainbow colors
    const rainbowHexColorForTheme = getRainbowHexColorForTheme(properties.rainbowPosition, themeSettings.theme);
    const lightenedRainbowHexColorForTheme = lightenColor(
        rainbowHexColorForTheme,
        // Darken for dark theme, lighten for light theme
        0.2 * (themeSettings.theme === Theme.Light ? -1 : 1),
    );

    // Render the component
    return (
        <Link
            href={properties.href}
            className="flex flex-col rounded-2xl border border--3 p-5 active:border--4"
            // We have to use the event handlers to change the colors because of the way Tailwind CSS works
            onMouseEnter={function (event) {
                event.currentTarget.style.borderColor = rainbowHexColorForTheme;
            }}
            onMouseLeave={function (event) {
                event.currentTarget.style.borderColor = '';
            }}
            onMouseDown={function (event) {
                event.currentTarget.style.borderColor = lightenedRainbowHexColorForTheme;
            }}
            onMouseUp={function (event) {
                event.currentTarget.style.borderColor = rainbowHexColorForTheme;
            }}
        >
            {properties.icon &&
                React.cloneElement(properties.icon, {
                    className: 'h-6 w-6',
                    style: { color: rainbowHexColorForTheme },
                })}

            <h2 className={properties.icon ? 'mt-4 text-base' : 'text-base'}>{properties.title}</h2>

            {properties.description && <p className="mt-2 text-sm">{properties.description}</p>}

            <span className="grow" />

            {properties.postCount !== undefined && (
                <p className="mt-5 align-bottom text-sm content--4">{properties.postCount} articles</p>
            )}
        </Link>
    );
}
