// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Assets
import ChevronRightFilledIcon from '@structure/assets/icons/interface/ChevronRightFilledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - JsonNode
export interface JsonNodeProperties {
    data: unknown;
    level: number;
    initialExpansionDepth: number;
    keyName?: string;
}
export function JsonNode(properties: JsonNodeProperties) {
    const [isExpanded, setIsExpanded] = React.useState(properties.level < properties.initialExpansionDepth);

    const maximumPreviewItems = 4;

    const isObject = properties.data !== null && typeof properties.data === 'object';
    const isArray = Array.isArray(properties.data);
    const isEmpty =
        isObject &&
        (isArray ? (properties.data as unknown[]).length === 0 : Object.keys(properties.data as object).length === 0);

    // Remove the indentationStyle
    // const indentationStyle = {
    //     paddingLeft: level * 12,
    // };

    // Toggles expansion state
    const toggleExpand = function () {
        setIsExpanded(!isExpanded);
    };

    // Renders different value types with appropriate styling
    function renderPrimitiveValue(value: unknown) {
        switch(typeof value) {
            case 'string':
                return (
                    <span className={mergeClassNames('text-amber-600 dark:text-amber-300')}>&quot;{value}&quot;</span>
                );
            case 'number':
                return <span className={mergeClassNames('text-cyan-600 dark:text-cyan-400')}>{value}</span>;
            case 'boolean':
                return (
                    <span className={mergeClassNames('text-cyan-600 italic dark:text-cyan-400')}>
                        {value.toString()}
                    </span>
                );
            case 'object':
                if(value === null)
                    return <span className={mergeClassNames('text-cyan-600 italic dark:text-cyan-400')}>null</span>;
                // Objects/arrays handled separately
                return null;
            default:
                return <span className={mergeClassNames('text-cyan-600 dark:text-cyan-400')}>{String(value)}</span>;
        }
    }

    // Creates a preview string for collapsed objects/arrays
    function renderCollapsedPreview(): React.JSX.Element {
        if(!isObject || isEmpty) {
            // If it's just a primitive, just render the value
            return <> {renderPrimitiveValue(properties.data)} </>;
        }

        let entries: [string, unknown][] = [];
        if(isArray) {
            const arrData = properties.data as unknown[];
            entries = arrData.map((val, i) => [String(i), val]);
        }
        else {
            entries = Object.entries(properties.data as object);
        }

        const previewEntries = entries.slice(0, maximumPreviewItems);
        const previewContent = previewEntries.map(([key, value], index) => {
            if(isArray) {
                return (
                    <React.Fragment key={index}>
                        {renderPreviewValue(value)}
                        {index < previewEntries.length - 1 ? ', ' : ''}
                    </React.Fragment>
                );
            }
            return (
                <React.Fragment key={key}>
                    <span className="text-gray-800 dark:text-gray-400">{key}:</span> {renderPreviewValue(value)}
                    {index < previewEntries.length - 1 ? ', ' : ''}
                </React.Fragment>
            );
        });

        // Indicate if there is more
        const hasMore = entries.length > maximumPreviewItems;
        const openChar = isArray ? '[' : '{';
        const closeChar = isArray ? ']' : '}';
        return (
            <>
                {openChar} {previewContent}
                {hasMore && ', ...'}
                &nbsp;
                {closeChar}
            </>
        );
    }

    // Helper to render a value for preview (primitive or a simple inline)
    function renderPreviewValue(value: unknown) {
        if(typeof value === 'object' && value !== null) {
            if(Array.isArray(value))
                return <span className="text-gray-800 italic dark:text-gray-400">Array({value.length})</span>;
            return <span className="text-gray-800 italic dark:text-gray-400">Object</span>;
        }
        return renderPrimitiveValue(value);
    }

    // Render fully expanded objects/arrays
    function renderExpandedContent() {
        if(isArray) {
            const arr = properties.data as unknown[];
            return arr.map((value, index) => (
                <JsonNode
                    key={index}
                    data={value}
                    level={properties.level + 1}
                    initialExpansionDepth={properties.initialExpansionDepth}
                    keyName={String(index)}
                />
            ));
        }
        else {
            const obj = properties.data as object;
            return Object.entries(obj).map(([k, v]) => (
                <JsonNode
                    key={k}
                    data={v}
                    keyName={k}
                    level={properties.level + 1}
                    initialExpansionDepth={properties.initialExpansionDepth}
                />
            ));
        }
    }

    // Render root level (special case)
    if(properties.level === 0) {
        if(!isObject) {
            // Just a primitive at root
            return <div>{renderPrimitiveValue(properties.data)}</div>;
        }

        if(isEmpty) {
            return <div>{isArray ? '[]' : '{}'}</div>;
        }

        // Root objects/arrays always expanded initially (based on isExpanded)
        return (
            <div>
                {/* <div>{isArray ? '[' : '{'}</div> */}
                <div className="">{renderExpandedContent()}</div>
                {/* <div>{isArray ? ']' : '}'}</div> */}
            </div>
        );
    }

    // Non-root nodes:
    // Determine if there's a toggle button
    const hasChildren = isObject && !isEmpty;

    // Line classes for hover and click
    const lineClasses =
        'json-line hover:background--c dark:hover:bg-dark-2 cursor-pointer flex items-start items-center';
    const keyClasses = 'json-key text-blue-500 dark:text-blue-300';
    const toggleAreaClasses = 'items-center transform transition-transform mr-0.5';
    const placeholderToggleWidth = 6; // Same width as the toggle

    // Render the component
    return (
        <div className={mergeClassNames(properties.level > 1 ? 'ml-3.5' : '')}>
            <div className={lineClasses} onClick={toggleExpand}>
                {/* Toggle button or placeholder */}
                <span
                    className={mergeClassNames(
                        toggleAreaClasses,
                        !hasChildren && 'opacity-0',
                        // Rotate the arrow
                        isExpanded && 'rotate-90 transform',
                    )}
                >
                    <ChevronRightFilledIcon className="h-2.5 w-2.5" />
                </span>

                {/* Key name */}
                {properties.keyName && <span className={keyClasses}>{properties.keyName}:&nbsp;</span>}

                {/* Value or expanded/collapsed structure */}
                {isObject ? (
                    isExpanded ? (
                        // Expanded
                        <span className="text-gray-800 dark:text-gray-400">
                            {isArray ? 'Array(' + (properties.data as unknown[]).length + ')' : ''}
                        </span>
                    ) : (
                        // Collapsed with preview
                        <span>{renderCollapsedPreview()},</span>
                    )
                ) : (
                    // Primitive
                    <span>{renderPrimitiveValue(properties.data)}</span>
                )}
            </div>

            {/* If expanded, render children */}
            {isExpanded && hasChildren && <div className="">{renderExpandedContent()}</div>}

            {/* Closing bracket if expanded */}
            {isExpanded && hasChildren && (
                <div className={lineClasses} onClick={toggleExpand}>
                    <span
                        className={toggleAreaClasses}
                        style={{ display: 'inline-block', width: placeholderToggleWidth, marginRight: 4 }}
                    ></span>
                    {/* <span>{isArray ? ']' : '}'},</span> */}
                </div>
            )}
        </div>
    );
}
