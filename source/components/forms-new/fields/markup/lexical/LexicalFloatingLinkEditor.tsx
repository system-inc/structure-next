'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Lexical
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, LexicalNode } from 'lexical';
import { TOGGLE_LINK_COMMAND, $isLinkNode, LinkNode } from '@lexical/link';
import { $getNearestNodeOfType } from '@lexical/utils';

// Component - LexicalFloatingLinkEditor
export function LexicalFloatingLinkEditor() {
    // Hooks
    const [editor] = useLexicalComposerContext();

    // State
    const [linkUrl, setLinkUrl] = React.useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });

    // Function to update the link editor state based on current selection
    const updateLinkEditor = React.useCallback(function () {
        const selection = $getSelection();
        if($isRangeSelection(selection)) {
            const node = $getNearestNodeOfType(selection.anchor.getNode() as LexicalNode, LinkNode);
            if($isLinkNode(node)) {
                setLinkUrl(node.getURL());
                setIsVisible(true);

                // Get the selection's DOM range and position the UI
                const nativeSelection = window.getSelection();
                if(nativeSelection && nativeSelection.rangeCount > 0) {
                    const range = nativeSelection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    setPosition({ top: rect.bottom + window.scrollY, left: rect.left });
                }
            }
            else {
                setIsVisible(false);
            }
        }
    }, []);

    // Effect to listen for editor updates
    React.useEffect(
        function () {
            return editor.registerUpdateListener(function (listener) {
                listener.editorState.read(updateLinkEditor);
            });
        },
        [editor, updateLinkEditor],
    );

    // Function to update the link URL
    function handleUpdateLink() {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
        setIsVisible(false);
    }

    // Function to remove the link
    function handleRemoveLink() {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        setIsVisible(false);
    }

    // Don't render if not visible
    if(!isVisible) {
        return null;
    }

    // Render the component
    return (
        <div className="" style={{ top: position.top, left: position.left, position: 'absolute' }}>
            <input
                type="text"
                value={linkUrl}
                onChange={function (event) {
                    setLinkUrl(event.target.value);
                }}
                placeholder="Enter URL"
            />
            <button onClick={handleUpdateLink}>Update</button>
            <button onClick={handleRemoveLink}>Remove</button>
        </div>
    );
}
