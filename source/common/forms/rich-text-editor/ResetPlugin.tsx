// Dependency - React
import React from 'react';

// Dependencies - Lexical
import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface ResetPluginProps {
    shouldReset?: boolean;
    onResetComplete?: () => void;
}
export default function ResetPlugin(properties: ResetPluginProps) {
    const [editor] = useLexicalComposerContext();
  
    const propertiesShouldReset = properties.shouldReset;
    const propertiesOnResetComplete = properties.onResetComplete;
    
    React.useEffect(
        function() {
            if (propertiesShouldReset) {
                editor.update(() => {
                    $getRoot().clear();
                });
                propertiesOnResetComplete?.();
            }
        },
        [propertiesShouldReset, propertiesOnResetComplete, editor]
    );
  
    return null;
}