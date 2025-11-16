// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - HorizontalRule
export interface HorizontalRuleProperties {
    className?: string;
}
export function HorizontalRule(properties: HorizontalRuleProperties) {
    // Render the component
    // Rounded-full gives the line nice rounded end caps (like strokeLinecap="round" in SVG)
    return <div className={mergeClassNames('h-px rounded-full background-border--0', properties.className)} />;
}
