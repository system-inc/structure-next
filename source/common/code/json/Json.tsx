// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { JsonNode } from '@structure/source/common/code/json/JsonNode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Json
export interface JsonInterface {
    data: unknown;
    defaultExpandLevel?: number;
    className?: string;
}
export function Json(properties: JsonInterface) {
    // Defaults
    const defaultExpandLevel = properties.defaultExpandLevel || 3;

    const data = typeof properties.data === 'string' ? JSON.parse(properties.data) : properties.data;

    // Render the component
    return (
        <pre className={mergeClassNames('font-mono text-sm', properties.className)}>
            <JsonNode data={data} level={0} defaultExpandLevel={defaultExpandLevel} />
        </pre>
    );
}

// Export - Default
export default Json;
