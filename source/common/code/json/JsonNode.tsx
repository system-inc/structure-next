// Dependencies - React and Next.js
import React from 'react';

// Component - JsonNode
export interface JsonNodeInterface {
    data: any;
    level: number;
    defaultExpandLevel: number;
}
export function JsonNode(properties: JsonNodeInterface) {
    // State
    const [isExpanded, setIsExpanded] = React.useState(properties.level < properties.defaultExpandLevel);

    // Function to render value
    function renderValue() {
        if(properties.data === null) return <span className="">null</span>;
        if(typeof properties.data === 'string') return <span className="">&quot;{properties.data}&quot;</span>;
        if(typeof properties.data === 'number') return <span className="">{properties.data}</span>;
        if(typeof properties.data === 'boolean') return <span className="">{properties.data.toString()}</span>;

        return properties.data;
    }

    // Render complex types (objects and arrays)
    if(typeof properties.data === 'object' && properties.data !== null) {
        const isArray = Array.isArray(properties.data);
        const isEmpty = Object.keys(properties.data).length === 0;

        if(isEmpty) {
            return <span>{isArray ? '[]' : '{}'}</span>;
        }

        return (
            <div className="group">
                <div className="inline-flex cursor-pointer items-center" onClick={() => setIsExpanded(!isExpanded)}>
                    <span className="inline-block w-4">{isExpanded ? '−' : '+'}</span>
                    <span>{isArray ? (isExpanded ? '[' : '[...],') : isExpanded ? '{' : '{...},'}</span>
                </div>
                {isExpanded && (
                    <div className="ml-4 group-hover:bg-light-2 dark:group-hover:bg-dark-2">
                        {Object.entries(properties.data).map(([key, value], index) => (
                            <div key={key}>
                                <span className="">{isArray ? '' : `"${key}": `}</span>
                                <JsonNode
                                    data={value}
                                    level={properties.level + 1}
                                    defaultExpandLevel={properties.defaultExpandLevel}
                                />
                                {index < Object.keys(properties.data).length - 1 && ','}
                            </div>
                        ))}
                    </div>
                )}
                <div>{isExpanded && (isArray ? ']' : '}')}</div>
            </div>
        );
    }

    // Render primitive values
    return renderValue();
}
