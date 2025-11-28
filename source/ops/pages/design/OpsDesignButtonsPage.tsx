'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Component - OpsDesignButtonsPage
export function OpsDesignButtonsPage() {
    // Render the component
    return (
        <div className="space-y-8">
            {/* A Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">A Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="A">A</Button>
                    <Button variant="A" disabled>
                        A Disabled
                    </Button>
                </div>
            </div>

            {/* B Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">B Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="B">B</Button>
                    <Button variant="B" disabled>
                        B Disabled
                    </Button>
                </div>
            </div>

            {/* Common Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">Common Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="Common">Common</Button>
                    <Button variant="Common" disabled>
                        Common Disabled
                    </Button>
                </div>
            </div>

            {/* Outline Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">Outline Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="Outline">Outline</Button>
                    <Button variant="Outline" disabled>
                        Outline Disabled
                    </Button>
                </div>
            </div>

            {/* Contrast Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">Contrast Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="Contrast">Contrast</Button>
                    <Button variant="Contrast" disabled>
                        Contrast Disabled
                    </Button>
                </div>
            </div>

            {/* Ghost Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">Ghost Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="Ghost">Ghost</Button>
                    <Button variant="Ghost" disabled>
                        Ghost Disabled
                    </Button>
                </div>
            </div>

            {/* Destructive Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">Destructive Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="Destructive">Destructive</Button>
                    <Button variant="Destructive" disabled>
                        Destructive Disabled
                    </Button>
                </div>
            </div>

            {/* GhostDestructive Buttons */}
            <div>
                <h2 className="mb-4 text-sm font-medium content--2">Ghost Destructive Buttons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button variant="GhostDestructive">Ghost Destructive</Button>
                    <Button variant="GhostDestructive" disabled>
                        Ghost Destructive Disabled
                    </Button>
                </div>
            </div>
        </div>
    );
}
