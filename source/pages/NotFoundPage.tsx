// TODO: make pretty and use full layout

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { HorizontalRule } from '@structure/source/components/layout/HorizontalRule';

// Component - NotFoundPage
export function NotFoundPage() {
    // Render the component
    return (
        <div>
            <h1>Page Not Found</h1>

            <HorizontalRule className="my-6" />

            <div className="">
                <p>The page you are looking for could not be found.</p>
            </div>
        </div>
    );
}
