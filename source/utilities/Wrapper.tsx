// Dependencies - React and Next.js
import React from 'react';

// Component - Wrapper
export interface WrapperProperties {
    children: React.ReactNode;
}
export function Wrapper(properties: WrapperProperties) {
    // Render the component
    return properties.children;
}
