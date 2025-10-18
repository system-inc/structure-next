'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Posts } from '@structure/source/modules/post/components/Posts';

// Dependencies - Assets
import PlusIcon from '@structure/assets/icons/interface/PlusIcon.svg';

// Component - IdeasPage
export function IdeasPage() {
    // Render the component
    return (
        <div className="container items-center justify-center pt-12 pb-32">
            <div className="float-end">
                <Button className="pl-3" iconLeft={PlusIcon} href="/ideas/submit">
                    Submit an Idea
                </Button>
            </div>

            <h1 className="mb-8">Ideas</h1>

            <Posts type="Idea" itemsPerPage={10} />
        </div>
    );
}
