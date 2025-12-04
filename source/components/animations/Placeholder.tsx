'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { motion } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Placeholder
export interface PlaceholderProperties {
    className?: string;
}
export function Placeholder(properties: PlaceholderProperties) {
    // Render the component
    return (
        <motion.div
            className={mergeClassNames('rounded-[inherit] background--3', properties.className)}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
            }}
        />
    );
}
