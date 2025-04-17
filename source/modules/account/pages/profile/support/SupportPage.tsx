'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Support',
    };
}

// Component - SupportPage
export function SupportPage() {
    // Hooks

    // Render the component
    return (
        <div>
            <p>Support page content goes here.</p>
        </div>
    );
}
export default SupportPage;