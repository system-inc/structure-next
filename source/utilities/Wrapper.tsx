// Dependencies - React and Next.js
import React from 'react';

// Component - Wrapper
export interface WrapperInterface {
    children: React.ReactNode;
}
export function Wrapper(properties: WrapperInterface) {
    // Render the component
    return properties.children;
}

// Export - Default
export default Wrapper;
