// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Assets
import ChevronRightFilledIcon from '@structure/assets/icons/interface/ChevronRightFilledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// const colors = {
//     keys: {
//         light: '#3B82F6',
//         dark: '#93C5FD',
//     },
//     keysCollapsed: {
//         light: '#1E293B',
//         dark: '#94A3B8',
//     },
//     numbers: {
//         light: '#0891B2',
//         dark: '#22D3EE',
//     },
//     objects: {
//         light: '#0891B2',
//         dark: '#22D3EE',
//     },
//     strings: {
//         light: '#D97706',
//         dark: '#FCD34D',
//     },
// };

// Component - JsonNode
export interface JsonNodeInterface {
    data: unknown;
    level: number;
    initialExpansionDepth: number;
    keyName?: string;
}
export function JsonNode(properties: JsonNodeInterface) {
    const { data, level, initialExpansionDepth, keyName } = properties;
    const [isExpanded, setIsExpanded] = React.useState(level < initialExpansionDepth);

    const maximumPreviewItems = 4;

    const isObject = data !== null && typeof data === 'object';
    const isArray = Array.isArray(data);
    const isEmpty = isObject && (isArray ? (data as unknown[]).length === 0 : Object.keys(data as object).length === 0);

    // Remove the indentationStyle
    // const indentationStyle = {
    //     paddingLeft: level * 12,
    // };

    // Toggles expansion state
    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Renders different value types with appropriate styling
    function renderPrimitiveValue(value: unknown) {
        switch(typeof value) {
            case 'string':
                return (
                    <span className={mergeClassNames('text-[#D97706] dark:text-[#FCD34D]')}>&quot;{value}&quot;</span>
                );
            case 'number':
                return <span className={mergeClassNames('text-[#0891B2] dark:text-[#22D3EE]')}>{value}</span>;
            case 'boolean':
                return (
                    <span className={mergeClassNames('italic text-[#0891B2] dark:text-[#22D3EE]')}>
                        {value.toString()}
                    </span>
                );
            case 'object':
                if(value === null)
                    return <span className={mergeClassNames('italic text-[#0891B2] dark:text-[#22D3EE]')}>null</span>;
                // Objects/arrays handled separately
                return null;
            default:
                return <span className={mergeClassNames('text-[#0891B2] dark:text-[#22D3EE]')}>{String(value)}</span>;
        }
    }

    // Creates a preview string for collapsed objects/arrays
    function renderCollapsedPreview(): JSX.Element {
        if(!isObject || isEmpty) {
            // If it's just a primitive, just render the value
            return <> {renderPrimitiveValue(data)} </>;
        }

        let entries: [string, unknown][] = [];
        if(isArray) {
            const arrData = data as unknown[];
            entries = arrData.map((val, i) => [String(i), val]);
        }
        else {
            entries = Object.entries(data as object);
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
                    <span className="text-[#1E293B] dark:text-[#94A3B8]">{key}:</span> {renderPreviewValue(value)}
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
                return (
                    <span className="json-preview italic text-[#1E293B] dark:text-[#94A3B8]">
                        Array({value.length})
                    </span>
                );
            return <span className="json-preview italic text-[#1E293B] dark:text-[#94A3B8]">Object</span>;
        }
        return renderPrimitiveValue(value);
    }

    // Render fully expanded objects/arrays
    function renderExpandedContent() {
        if(isArray) {
            const arr = data as unknown[];
            return arr.map((value, index) => (
                <JsonNode
                    key={index}
                    data={value}
                    level={level + 1}
                    initialExpansionDepth={initialExpansionDepth}
                    keyName={String(index)}
                />
            ));
        }
        else {
            const obj = data as object;
            return Object.entries(obj).map(([k, v]) => (
                <JsonNode
                    key={k}
                    data={v}
                    keyName={k}
                    level={level + 1}
                    initialExpansionDepth={initialExpansionDepth}
                />
            ));
        }
    }

    // Render root level (special case)
    if(level === 0) {
        if(!isObject) {
            // Just a primitive at root
            return <div>{renderPrimitiveValue(data)}</div>;
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
    const lineClasses = 'json-line hover:bg-dark-2 cursor-pointer flex items-start items-center';
    const keyClasses = 'json-key text-[#3B82F6] dark:text-[#93C5FD]';
    const toggleAreaClasses = 'items-center transform transition-transform mr-0.5';
    const placeholderToggleWidth = 6; // Same width as the toggle

    // Render the component
    return (
        <div className={mergeClassNames(level > 1 ? 'ml-3.5' : '')}>
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
                {keyName && <span className={keyClasses}>{keyName}:&nbsp;</span>}

                {/* Value or expanded/collapsed structure */}
                {isObject ? (
                    isExpanded ? (
                        // Expanded
                        <span className="text-[#1E293B] dark:text-[#94A3B8]">
                            {isArray ? 'Array(' + data.length + ')' : ''}
                        </span>
                    ) : (
                        // Collapsed with preview
                        <span>{renderCollapsedPreview()},</span>
                    )
                ) : (
                    // Primitive
                    <span>{renderPrimitiveValue(data)}</span>
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
