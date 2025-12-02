'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Lexical
import { $getRoot, $insertNodes } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM, $generateHtmlFromNodes } from '@lexical/html';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

// Interface - InputMarkupReferenceInterface
// Exposes imperative methods for controlling the editor externally
export interface InputMarkupReferenceInterface {
    setContent: (content: string) => void;
    getContent: () => string;
    clear: () => void;
    focus: () => void;
}

// Component - LexicalImperativeHandle
// Exposes an imperative handle for controlling the Lexical editor from outside
// Must be rendered inside a LexicalComposer
export interface LexicalImperativeHandleProperties {
    reference: React.ForwardedRef<InputMarkupReferenceInterface>;
    type: 'Markdown' | 'Html' | 'Json';
}
export function LexicalImperativeHandle(properties: LexicalImperativeHandleProperties) {
    const [editor] = useLexicalComposerContext();

    React.useImperativeHandle(
        properties.reference,
        function () {
            return {
                setContent(content: string) {
                    editor.update(function () {
                        $getRoot().clear();

                        if(content) {
                            if(properties.type === 'Markdown') {
                                $convertFromMarkdownString(content, TRANSFORMERS);
                            }
                            else if(properties.type === 'Html') {
                                const parser = new DOMParser();
                                const dom = parser.parseFromString(content, 'text/html');
                                const nodes = $generateNodesFromDOM(editor, dom);
                                $getRoot().select();
                                $insertNodes(nodes);
                            }
                            else if(properties.type === 'Json') {
                                $getRoot().updateFromJSON(JSON.parse(content));
                            }
                        }
                    });
                },
                getContent() {
                    let content = '';
                    editor.getEditorState().read(function () {
                        if(properties.type === 'Markdown') {
                            content = $convertToMarkdownString(TRANSFORMERS);
                        }
                        else if(properties.type === 'Html') {
                            content = $generateHtmlFromNodes(editor, null);
                        }
                        else if(properties.type === 'Json') {
                            content = JSON.stringify(editor.getEditorState().toJSON());
                        }
                    });
                    return content;
                },
                clear() {
                    editor.update(function () {
                        $getRoot().clear();
                    });
                },
                focus() {
                    editor.focus();
                },
            };
        },
        [editor, properties.type],
    );

    return null;
}
