// Dependencies - React
import React from 'react';

// Component - ClientOnly
export interface ClientOnlyProperties {
    children: React.ReactNode;
}
export function ClientOnly(properties: ClientOnlyProperties) {
    // State
    const [isClient, setIsClient] = React.useState(false);

    // Effect to set client state
    React.useEffect(function () {
        setIsClient(true);
    }, []);

    // Render the component
    return isClient ? properties.children : null;
}
