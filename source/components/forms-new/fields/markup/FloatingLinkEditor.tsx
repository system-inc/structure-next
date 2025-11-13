import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, LexicalNode } from 'lexical';
import { TOGGLE_LINK_COMMAND, $isLinkNode, LinkNode } from '@lexical/link';
import { $getNearestNodeOfType } from '@lexical/utils';

export function FloatingLinkEditor() {
    const [editor] = useLexicalComposerContext();
    const [linkUrl, setLinkUrl] = React.useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });

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

    React.useEffect(
        function () {
            return editor.registerUpdateListener(function (listener) {
                listener.editorState.read(updateLinkEditor);
            });
        },
        [editor, updateLinkEditor],
    );

    const updateLink = function () {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
        setIsVisible(false);
    };

    const removeLink = function () {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        setIsVisible(false);
    };

    if(!isVisible) return null;

    return (
        <div className="" style={{ top: position.top, left: position.left, position: 'absolute' }}>
            <input
                type="text"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="Enter URL"
            />
            <button onClick={updateLink}>Update</button>
            <button onClick={removeLink}>Remove</button>
        </div>
    );
}
