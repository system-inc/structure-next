// TODO: make pretty and use full layout

// Dependencies - React and Next.js
import React from 'react';

// Component - NotFoundPage
export type NotFoundPageProperties = {};
export function NotFoundPage(properties: NotFoundPageProperties) {
    // Render the component
    return (
        <div>
            <h1>Error 404: Not Found</h1>
        </div>
    );
}

// Export - Default
export default NotFoundPage;
