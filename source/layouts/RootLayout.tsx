// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';

// Dependencies - Main Components
import { Providers } from '@structure/source/layouts/providers/Providers';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Theme
import { Theme, ThemeClassName, OperatingSystemTheme } from '@structure/source/theme/ThemeTypes';
import { themeKey, operatingSystemThemeKey } from '@structure/source/theme/ThemeSettings';

// Dependencies - Theme - Styles
import '@structure/source/theme/styles/global.css';
import '@project/app/_theme/styles/theme.css';

// Next.js Metadata
export async function generateMetadata(): Promise<Metadata> {
    const icons: Metadata['icons'] = [];

    // Add dark mode favicon
    if(ProjectSettings.assets?.favicon?.dark?.location) {
        icons.push({
            rel: 'icon',
            url: ProjectSettings.assets.favicon.dark.location,
            media: '(prefers-color-scheme: dark)',
        });
    }

    // Add light mode favicon
    if(ProjectSettings.assets?.favicon?.light?.location) {
        icons.push({
            rel: 'icon',
            url: ProjectSettings.assets.favicon.light.location,
            media: '(prefers-color-scheme: light)',
        });
    }

    return {
        title: {
            template: '%s • ' + ProjectSettings.title,
            default: ProjectSettings.title + ' • ' + ProjectSettings.tagline, // default is required when creating a template
        },
        description: ProjectSettings.description,
        icons: icons.length > 0 ? icons : undefined,
    };
}

// Viewport
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // This makes it easier to enter form fields on mobile without the page zooming in
    userScalable: true,
};

// Component - RootLayout
export interface RootLayoutProperties extends React.HTMLProps<HTMLHtmlElement> {
    htmlClassName?: string;
    bodyClassName?: string;
    mainClassName?: string;
    providersComponent?: React.ComponentType<{
        accountSignedIn: boolean;
        children: React.ReactNode;
    }>;
    children: React.ReactNode;
}
export async function RootLayout(properties: RootLayoutProperties) {
    // Use the default Providers component if one is not provided
    const ProvidersComponent = properties.providersComponent || Providers;

    // Get the cookies from the response headers
    const cookieStore = await cookies();
    // console.log('cookieStore', cookieStore);

    // Determine if the account is signed in based on if the sessionId HTTP-only cookie is set
    // We use this to prevent unnecessary client-side calls to the server to check if the account is signed in
    const accountSignedIn = cookieStore.get('sessionId')?.value ? true : false;
    // This will log to terminal, not the browser console, as it is server-side
    // console.log('RootLayout: accountSignedIn', accountSignedIn, 'sessionId:', cookieStore.get('sessionId')?.value);

    // Read the theme from the cookies, falling back to the project's default theme
    const theme = (cookieStore.get(themeKey)?.value ?? ProjectSettings.theme?.defaultTheme) as Theme;

    // Map the theme to its corresponding scheme-* utility class
    // For OperatingSystem theme, use the actual OS preference from cookie
    let schemeClass: string;
    if(theme === Theme.OperatingSystem) {
        const osTheme = cookieStore.get(operatingSystemThemeKey)?.value as OperatingSystemTheme | undefined;
        schemeClass = osTheme === OperatingSystemTheme.Dark ? 'scheme-dark' : 'scheme-light';
    }
    else {
        schemeClass = ThemeClassName[theme] ?? 'scheme-light';
    }

    // Render the component
    return (
        <html lang="en" className={mergeClassNames(properties.htmlClassName, schemeClass)}>
            <body
                className={mergeClassNames(
                    'background--0 font-sans content--0 transition-colors',
                    properties.bodyClassName,
                )}
            >
                {/* Add a <main> tag so that any Radix-UI Portal elements get appended outside the main content */}
                {/* Fixes any z-index issues with Popovers, etc. */}
                <main
                    className={mergeClassNames(
                        'relative isolate z-0 h-[100dvh] overflow-x-clip overflow-y-auto',
                        properties.mainClassName,
                    )}
                >
                    {/* Providers use React's Context API to make values accessible to all components within their subtree */}
                    <ProvidersComponent accountSignedIn={accountSignedIn}>{properties.children}</ProvidersComponent>
                </main>
            </body>
        </html>
    );
}
