'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js

// Dependencies - Main Components

// Component - HomePage
export function HomePage() {
    // Render the component
    return (
        <>
            <h1>{ProjectSettings.title}</h1>
        </>
    );
}

// Export - Default
export default HomePage;
