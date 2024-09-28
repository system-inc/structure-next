// TODO: make pretty and use full layout

// Dependencies - React and Next.js
import React from 'react';

// Component - NotFoundPage
export function NotFoundPage() {
    // Render the component
    return (
        <div>
            <h1 className="mb-6 text-3xl font-medium">Page Not Found</h1>

            <div className="mb-4">
                <p>The page you are looking for could not be found.</p>
            </div>
        </div>
    );
}

// Export - Default
export default NotFoundPage;
