'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Animation
// import LoadingAnimation from '@structure/source/common/animations/LoadingAnimation';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Notifications',
    };
}

// Component - NotificationsPage
export function NotificationsPage() {
    // Render the component
    return (
        <>
            {/* {false ? (
                // Loading
                <LoadingAnimation />
            ) : (
                // Data
                <div>
                    <h1>Notifications</h1>
                </div>
            )} */}
        </>
    );
}

// Export - Default
export default NotificationsPage;
