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
import { Toggle } from '@structure/source/components/buttons/Toggle';
import { Button } from '@structure/source/components/buttons/Button';
import { AttachmentModal } from './AttachmentModal';
import { AttachmentBar } from './AttachmentBar';

// Dependencies - Assets
import {
    ArrowClockwiseIcon,
    ArrowCounterClockwiseIcon,
    // TextAlignCenter,
    // TextAlignJustify,
    // TextAlignLeft,
    // TextAlignRight,
    TextBIcon,
    TextItalicIcon,
    // TextStrikethrough,
    TextUnderlineIcon,
    // LinkSimpleHorizontal,
    PaperclipIcon,
    SpinnerIcon,
} from '@phosphor-icons/react';

const LowPriority = 1;

function Divider() {
    return <div className="" />;
}

// Component - ToolbarPlugin
interface ToolbarPluginProperties {
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;
    isDisabled?: boolean;
    showLoading?: boolean;
    // loadingProgress?: number | null;
}
export function ToolbarPlugin(properties: ToolbarPluginProperties) {
    const attachedFiles = properties.attachedFiles || [];

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

    const $updateToolbar = React.useCallback(function () {
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

    React.useEffect(
        function () {
            return mergeRegister(
                editor.registerUpdateListener(function (listener) {
                    listener.editorState.read(function () {
                        $updateToolbar();
                        const isNowEmpty = $getRoot().getTextContent().trim() === '';
                        setIsEmpty(isNowEmpty);
                    });
                }),
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    function () {
                        $updateToolbar();
                        return false;
                    },
                    LowPriority,
                ),
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    function (payload) {
                        setCanUndo(payload as boolean);
                        return false;
                    },
                    LowPriority,
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    function (payload) {
                        setCanRedo(payload as boolean);
                        return false;
                    },
                    LowPriority,
                ),
            );
        },
        [editor, $updateToolbar],
    );

    // Function to handle saving files
    function handleSaveFiles(files: File[]) {
        properties.onSaveFiles?.(files);
    }

    // Function to remove a file
    function handleRemoveFile(index: number) {
        properties.onRemoveFile?.(index);
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
            <div className="flex w-full shrink-0 items-center justify-between gap-4 overflow-x-auto px-3 pt-1 pb-3">
                <div className="flex items-center gap-1">
                    <Button
                        className="rounded-xl"
                        icon={ArrowCounterClockwiseIcon}
                        size="Icon"
                        disabled={!canUndo || properties.isDisabled}
                        onClick={function () {
                            editor.dispatchCommand(UNDO_COMMAND, undefined);
                        }}
                        aria-label="Undo"
                        variant="Ghost"
                    />
                    <Button
                        icon={ArrowClockwiseIcon}
                        className="rounded-xl"
                        size="Icon"
                        disabled={!canRedo || properties.isDisabled}
                        onClick={function () {
                            editor.dispatchCommand(REDO_COMMAND, undefined);
                        }}
                        aria-label="Redo"
                        variant="Ghost"
                    />
                    <Divider />
                    <Toggle
                        className="rounded-xl"
                        isPressed={isBold}
                        onClick={function () {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                        }}
                        aria-label="Format Bold"
                        variant="Ghost"
                        disabled={properties.isDisabled}
                    >
                        <TextBIcon weight="bold" />
                    </Toggle>
                    <Toggle
                        className="rounded-xl"
                        isPressed={isItalic}
                        onClick={function () {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                        }}
                        aria-label="Format Italics"
                        variant="Ghost"
                        disabled={properties.isDisabled}
                    >
                        <TextItalicIcon weight="bold" />
                    </Toggle>
                    <Toggle
                        className="rounded-xl"
                        isPressed={isUnderline}
                        onClick={function () {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                        }}
                        aria-label="Format Underline"
                        variant="Ghost"
                        disabled={properties.isDisabled}
                    >
                        <TextUnderlineIcon weight="bold" />
                    </Toggle>
                    {/* <Divider />
                    <Button
                        className={toggleVariants({
                            size: 'sm',
                            className: 'rounded-xl',
                            variant: 'ghost',
                        })}
                        onClick={() => setIsLinkActive(!isLinkActive)}
                        aria-label="Insert Link"
                        variant="Ghost"
                    >
                        <LinkSimpleHorizontal />
                    </Button> */}
                </div>
                <div className="flex items-center gap-1">
                    {/* Attachments */}
                    <Button
                        className="rounded-xl"
                        icon={PaperclipIcon}
                        size="Icon"
                        aria-label="Attach file"
                        variant="Ghost"
                        onClick={() => setIsAttachmentModalOpen(true)}
                        disabled={properties.isDisabled}
                    />

                    {/* Submit form */}
                    <Button
                        type="submit"
                        variant="A"
                        className="rounded-2xl"
                        // className={toggleVariants({
                        //     size: 'sm',
                        //     className: 'rounded-xl',
                        // })}
                        disabled={isEmpty || properties.isDisabled}
                        aria-label="Send"
                    >
                        {properties.showLoading ? (
                            <>
                                Sending
                                <SpinnerIcon className="animate-spin" />
                            </>
                        ) : (
                            'Send'
                        )}
                    </Button>

                    {/* Attachment Modal */}
                    <AttachmentModal
                        open={isAttachmentModalOpen}
                        onOpenChange={setIsAttachmentModalOpen}
                        onSave={handleSaveFiles}
                    />
                </div>
            </div>
        </div>
    );
}
