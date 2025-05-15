import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import {
  TOGGLE_LINK_COMMAND,
  $isLinkNode,
  LinkNode,
} from "@lexical/link";
import { $getNearestNodeOfType } from "@lexical/utils";

const FloatingLinkEditor = () => {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = $getNearestNodeOfType(selection.anchor.getNode(), LinkNode);
      if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
        setIsVisible(true);

        // Get the selection's DOM range and position the UI
        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          const range = nativeSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        }
      } else {
        setIsVisible(false);
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(updateLinkEditor);
    });
  }, [editor, updateLinkEditor]);

  const updateLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    setIsVisible(false);
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="floating-link-editor"
      style={{ top: position.top, left: position.left, position: "absolute" }}
    >
      <input
        type="text"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={updateLink}>Update</button>
      <button onClick={removeLink}>Remove</button>
    </div>
  );
};

export default FloatingLinkEditor;