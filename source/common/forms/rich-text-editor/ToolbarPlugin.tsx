/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @link(https://github.com/facebook/lexical/blob/5bb4f7565974b0c91c0ea9d321a699ecd64c2efc/examples/react-rich/src/plugins/ToolbarPlugin.tsx)
 */

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Lexical
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    // FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
// import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
// import { AutoLinkNode, LinkNode } from '@lexical/link';
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';

// Dependencies - Main Components
import { Toggle, toggleVariants } from '@structure/source/common/buttons/Toggle';
import { Button } from './Button';
import { AttachmentModal } from './AttachmentModal';
import { AttachmentBar } from './AttachmentBar';

// Dependencies - Assets
import {
    ArrowClockwise,
    ArrowCounterClockwise,
    // TextAlignCenter,
    // TextAlignJustify,
    // TextAlignLeft,
    // TextAlignRight,
    TextB,
    TextItalic,
    // TextStrikethrough,
    TextUnderline,
    // LinkSimpleHorizontal,
    Paperclip,
    ArrowUp,
    Spinner,
} from '@phosphor-icons/react';

const LowPriority = 1;

function Divider() {
    return <div className="divider" />;
}

interface ToolbarPluginProps {
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;
    isDisabled?: boolean;
    showLoading?: boolean;
    // loadingProgress?: number | null;
}
export default function ToolbarPlugin(properties: ToolbarPluginProps) {
    const { attachedFiles = [], onSaveFiles, onRemoveFile } = properties;

    const [editor] = useLexicalComposerContext();

    // const toolbarRef = React.useRef(null);
    const [canUndo, setCanUndo] = React.useState(false);
    const [canRedo, setCanRedo] = React.useState(false);
    const [isBold, setIsBold] = React.useState(false);
    const [isItalic, setIsItalic] = React.useState(false);
    const [isUnderline, setIsUnderline] = React.useState(false);
    // Link functionality currently commented out
    // const [linkUrl, setLinkUrl] = React.useState('');
    // const [isLinkActive, setIsLinkActive] = React.useState(false);

    // const [isDirty, setIsDirty] = React.useState(false);
    const [isEmpty, setIsEmpty] = React.useState(true);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = React.useState(false);

    const $updateToolbar = React.useCallback(() => {
        const selection = $getSelection();
        if($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));

            // const node = selection.getNodes().find(n => $isLinkNode(n));
            // if (node) {
            //     setIsLinkActive(true);
            //     setLinkUrl(node.getURL());
            // } else {
            //     setIsLinkActive(false);
            //     setLinkUrl('');
            // }
        }
    }, []);

    React.useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener((listener) => {
                listener.editorState.read(() => {
                    $updateToolbar();
                    const isNowEmpty = $getRoot().getTextContent().trim() === '';
                    setIsEmpty(isNowEmpty);
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, $updateToolbar]);

    // Function to handle saving files
    function handleSaveFiles(files: File[]) {
        onSaveFiles?.(files);
    }

    // Function to remove a file
    function handleRemoveFile(index: number) {
        onRemoveFile?.(index);
    }

    return (
        <div>
            {/* Attachment Bar */}
            {attachedFiles.length > 0 && (
                <AttachmentBar
                    files={attachedFiles}
                    onRemoveFile={handleRemoveFile}
                    isDiabled={properties.isDisabled}
                />
            )}
            <div className="item-center bg-opsis-background-primary flex w-full shrink-0 justify-between gap-4 overflow-x-auto border-t px-4 py-2">
                <div className="flex items-center gap-1">
                    <Button
                        className={toggleVariants({
                            size: 'sm',
                            className: 'rounded-sm',
                            variant: 'ghost',
                        })}
                        disabled={!canUndo || properties.isDisabled}
                        onClick={() => {
                            editor.dispatchCommand(UNDO_COMMAND, undefined);
                        }}
                        aria-label="Undo"
                        variant="ghost"
                    >
                        <ArrowCounterClockwise />
                    </Button>
                    <Button
                        className={toggleVariants({
                            size: 'sm',
                            className: 'rounded-sm',
                            variant: 'ghost',
                        })}
                        disabled={!canRedo || properties.isDisabled}
                        onClick={() => {
                            editor.dispatchCommand(REDO_COMMAND, undefined);
                        }}
                        aria-label="Redo"
                        variant="ghost"
                    >
                        <ArrowClockwise />
                    </Button>
                    <Divider />
                    <Toggle
                        className="rounded-sm"
                        size="sm"
                        pressed={isBold}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                        }}
                        aria-label="Format Bold"
                        variant="ghost"
                        disabled={properties.isDisabled}
                    >
                        <TextB />
                    </Toggle>
                    <Toggle
                        className="rounded-sm"
                        size="sm"
                        pressed={isItalic}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                        }}
                        aria-label="Format Italics"
                        variant="ghost"
                        disabled={properties.isDisabled}
                    >
                        <TextItalic />
                    </Toggle>
                    <Toggle
                        className="rounded-sm"
                        size="sm"
                        pressed={isUnderline}
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                        }}
                        aria-label="Format Underline"
                        variant="ghost"
                        disabled={properties.isDisabled}
                    >
                        <TextUnderline />
                    </Toggle>
                    {/* <Divider />
                    <Button
                        className={toggleVariants({
                            size: 'sm',
                            className: 'rounded-sm',
                            variant: 'ghost',
                        })}
                        onClick={() => setIsLinkActive(!isLinkActive)}
                        aria-label="Insert Link"
                        variant="ghost"
                    >
                        <LinkSimpleHorizontal />
                    </Button> */}
                </div>
                <div className="flex items-center gap-1">
                    {/* Attachments */}
                    <Button
                        className={toggleVariants({
                            size: 'sm',
                            className: 'rounded-sm',
                            variant: 'ghost',
                        })}
                        aria-label="Undo"
                        variant="ghost"
                        onClick={() => setIsAttachmentModalOpen(true)}
                        disabled={properties.isDisabled}
                    >
                        <Paperclip />
                    </Button>

                    {/* Submit form */}
                    <Button
                        type="submit"
                        className={toggleVariants({
                            size: 'sm',
                            className: 'rounded-sm',
                        })}
                        disabled={isEmpty || properties.isDisabled}
                        aria-label="Send"
                        variant="secondary"
                    >
                        Send{properties.showLoading ? 'ing' : ''}
                        {properties.showLoading ? <Spinner className="animate-spin" /> : <ArrowUp />}
                    </Button>

                    {/* Attachment Modal */}
                    <AttachmentModal
                        isOpen={isAttachmentModalOpen}
                        onClose={() => setIsAttachmentModalOpen(false)}
                        onSave={handleSaveFiles}
                    />
                </div>
            </div>
        </div>
    );
}
