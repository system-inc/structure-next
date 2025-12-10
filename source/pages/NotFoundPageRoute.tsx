// Dependencies - Next.js
import { Metadata } from 'next';

// Dependencies - Main Components
import { NotFoundPage } from '@structure/source/pages/NotFoundPage';

// Next.js Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Not Found',
    };
}

// Component - NotFoundPageRoute
// This is for use within route groups that already have a layout (e.g., main-layout).
// The layout wrapper is not included here since it's provided by the parent layout.
export interface NotFoundPageRouteProperties {
    className?: string;
}
export function NotFoundPageRoute(properties: NotFoundPageRouteProperties) {
    // Render the component
    return <NotFoundPage className={properties.className} />;
}
