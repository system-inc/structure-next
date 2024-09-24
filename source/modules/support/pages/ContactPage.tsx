'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';

// Component - ContactPage
export function ContactPage() {
    // Render the component
    return (
        <div className="container pb-32 pt-8">
            <div className="">
                <h1 className="mb-6 text-3xl font-medium">Contact</h1>

                <p className="">We look forward to hearing from you.</p>
            </div>

            <div className="mt-12">Contact form</div>
        </div>
    );
}

// Export - Default
export default ContactPage;
