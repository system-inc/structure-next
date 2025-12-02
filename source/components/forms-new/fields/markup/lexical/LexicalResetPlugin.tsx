'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Lexical
import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Component - LexicalResetPlugin
export interface LexicalResetPluginProperties {
    shouldReset?: boolean;
    onResetComplete?: () => void;
}
export function LexicalResetPlugin(properties: LexicalResetPluginProperties) {
    // Hooks
    const [editor] = useLexicalComposerContext();

    // Extract properties for effect dependencies
    const propertiesShouldReset = properties.shouldReset;
    const propertiesOnResetComplete = properties.onResetComplete;

    // Effect to reset the editor when shouldReset is true
    React.useEffect(
        function () {
            if(propertiesShouldReset) {
                editor.update(function () {
                    $getRoot().clear();
                });
                propertiesOnResetComplete?.();
            }
        },
        [propertiesShouldReset, propertiesOnResetComplete, editor],
    );

    return null;
}
