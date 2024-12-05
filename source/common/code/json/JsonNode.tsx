// Dependencies - React and Next.js
import React from 'react';

// Component - JsonNode
export interface JsonNodeInterface {
    // Data to display (replacing 'any' with 'unknown')
    data: unknown;
    level: number;
    defaultExpandLevel: number;
    keyName?: string;
}
export function JsonNode(properties: JsonNodeInterface) {
    // State
    const [isExpanded, setIsExpanded] = React.useState(properties.level < properties.defaultExpandLevel);

    // Calculate indentation style
    const indentationStyle = {
        paddingLeft: properties.level * 20, // Adjust '20' to desired indentation width
    };

    // Function to render primitive values
    function renderValue() {
        // Render 'null' value
        if(properties.data === null) return <span className="">null</span>;

        // Render string values with quotes
        if(typeof properties.data === 'string') return <span className="">&quot;{properties.data}&quot;</span>;

        // Render number values
        if(typeof properties.data === 'number') return <span className="">{properties.data}</span>;

        // Render boolean values as strings
        if(typeof properties.data === 'boolean') return <span className="">{properties.data.toString()}</span>;

        // Render other types as strings
        return <span>{String(properties.data)}</span>;
    }

    // Render the component

    // If at the root level, render without toggle
    if(properties.level === 0) {
        const isArray = Array.isArray(properties.data);
        const isEmpty = isArray
            ? (properties.data as unknown[]).length === 0
            : Object.keys(properties.data as object).length === 0;

        // Render empty arrays or objects
        if(isEmpty) {
            return <span>{isArray ? '[]' : '{}'}</span>;
        }

        // Render root level arrays or objects
        return (
            <div>
                {/* Opening bracket */}
                <span>{isArray ? '[' : '{'}</span>
                {/* Render child nodes */}
                <div className="ml-4">
                    {isArray
                        ? (properties.data as unknown[]).map((value, index) => (
                              <JsonNode
                                  key={index}
                                  data={value}
                                  level={properties.level + 1}
                                  defaultExpandLevel={properties.defaultExpandLevel}
                              />
                          ))
                        : Object.entries(properties.data as object).map(([key, value]) => (
                              <JsonNode
                                  key={key}
                                  data={value}
                                  level={properties.level + 1}
                                  defaultExpandLevel={properties.defaultExpandLevel}
                                  keyName={key}
                              />
                          ))}
                </div>
                {/* Closing bracket */}
                <span>{isArray ? ']' : '}'}</span>
            </div>
        );
    }

    // Render primitive values
    if(typeof properties.data !== 'object' || properties.data === null) {
        return (
            <div className="inline-flex items-center">
                {/* Render key name if available */}
                {properties.keyName && <span>{properties.keyName}: </span>}
                {/* Render the value */}
                {renderValue()},
            </div>
        );
    }

    // Determine if data is an array or object
    const isArray = Array.isArray(properties.data);
    const isEmpty = isArray
        ? (properties.data as unknown[]).length === 0
        : Object.keys(properties.data as object).length === 0;

    // Render empty arrays or objects
    if(isEmpty) {
        return (
            <div className="inline-flex items-center">
                {/* Render key name if available */}
                {properties.keyName && <span>{properties.keyName}: </span>}
                {/* Render empty brackets */}
                <span>{isArray ? '[]' : '{}'}</span>,
            </div>
        );
    }

    // Render complex types (arrays and objects) with expand/collapse functionality
    return (
        <div style={indentationStyle}>
            <div className="flex items-center">
                {/* Toggle expansion */}
                <span
                    className="inline-block cursor-pointer"
                    style={{ width: 20 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '−' : '+'}
                </span>
                {/* Render key name if available */}
                {properties.keyName && <span>{properties.keyName}: </span>}
                {/* Render opening bracket */}
                <span>
                    {isArray ? (isExpanded ? '[' : '[...]') : isExpanded ? '{' : '{...}'}
                    {!isExpanded && ','}
                </span>
            </div>
            {/* Render child nodes if expanded */}
            {isExpanded && (
                <div>
                    {isArray
                        ? (properties.data as unknown[]).map((value, index) => (
                              <JsonNode
                                  key={index}
                                  data={value}
                                  level={properties.level + 1}
                                  defaultExpandLevel={properties.defaultExpandLevel}
                              />
                          ))
                        : Object.entries(properties.data as object).map(([key, value]) => (
                              <JsonNode
                                  key={key}
                                  data={value}
                                  level={properties.level + 1}
                                  defaultExpandLevel={properties.defaultExpandLevel}
                                  keyName={key}
                              />
                          ))}
                </div>
            )}
            {/* Closing bracket */}
            {isExpanded && <div style={indentationStyle}>{isArray ? ']' : '}'},</div>}
        </div>
    );
}
