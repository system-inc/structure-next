'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import CodeEditor from '@project/source/modules/common/text/CodeView';

// Component - DevelopersPage
export type DevelopersPageProperties = {};
export function DevelopersPage(properties: DevelopersPageProperties) {
    const [code, setCode] = React.useState<string>(`// Code goes here
const [state, setState] = React.useState<string>('');`);

    // Render the component
    return (
        <>
            <InternalNavigationTrail />

            <h1>Developers</h1>

            <CodeEditor code={code} setCode={setCode} language="ts" className="text-sm" edit />
        </>
    );
}

// Export - Default
export default DevelopersPage;
