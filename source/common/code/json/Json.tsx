// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { JsonNode } from '@structure/source/common/code/json/JsonNode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Json
export interface JsonInterface {
    data: unknown;
    initialExpansionDepth?: number;
    className?: string;
}
export function Json(properties: JsonInterface) {
    // Defaults
    const defaultExpandLevel = properties.initialExpansionDepth || 4;

    const data = typeof properties.data === 'string' ? JSON.parse(properties.data) : properties.data;

    // Render the component
    return (
        <pre className={mergeClassNames('font-mono', properties.className)}>
            <JsonNode data={data} level={0} initialExpansionDepth={defaultExpandLevel} />
        </pre>
    );
}

// Export - Default
export default Json;
