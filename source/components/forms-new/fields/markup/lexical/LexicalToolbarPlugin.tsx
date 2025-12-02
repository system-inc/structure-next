'use client'; // This component uses client-only features

// Dependencies - React
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
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';

// Dependencies - Main Components
import { Toggle } from '@structure/source/components/buttons/Toggle';
import { Button } from '@structure/source/components/buttons/Button';
import { InputMarkupAttachmentsDialog } from '../attachments/InputMarkupAttachmentsDialog';
import { InputMarkupAttachments } from '../attachments/InputMarkupAttachments';

// Dependencies - Assets
import {
    ArrowClockwiseIcon,
    ArrowCounterClockwiseIcon,
    TextBIcon,
    TextItalicIcon,
    TextUnderlineIcon,
    PaperclipIcon,
    SpinnerIcon,
    CodeIcon,
    EyeIcon,
} from '@phosphor-icons/react';

// Dependencies - Theme
import { InputMarkupMode } from '../InputMarkupTheme';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

const LowPriority = 1;

// Component - LexicalToolbarPlugin
export interface LexicalToolbarPluginProperties {
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;

    // Visibility controls
    showFormatting?: boolean; // Default: true
    showHistory?: boolean; // Default: true
    showAttachments?: boolean; // Default: false
    showSubmit?: boolean; // Default: false

    // Mode toggle - Source (raw markdown) vs Visual (rich text)
    mode?: InputMarkupMode;
    onModeChange?: (mode: InputMarkupMode) => void;

    // Submit button config
    submitLabel?: string;
    submitLoadingLabel?: string;
    onSubmit?: () => void;

    // File handling
    attachedFiles?: File[];
    onSaveFiles?: (files: File[]) => void;
    onRemoveFile?: (index: number) => void;
}
export function LexicalToolbarPlugin(properties: LexicalToolbarPluginProperties) {
    // Apply defaults
    const showFormatting = properties.showFormatting !== false;
    const showHistory = properties.showHistory !== false;
    const showAttachments = properties.showAttachments === true;
    const showSubmit = properties.showSubmit === true;

    const attachedFiles = properties.attachedFiles ?? [];

    const [editor] = useLexicalComposerContext();

    const [canUndo, setCanUndo] = React.useState(false);
    const [canRedo, setCanRedo] = React.useState(false);
    const [isBold, setIsBold] = React.useState(false);
    const [isItalic, setIsItalic] = React.useState(false);
    const [isUnderline, setIsUnderline] = React.useState(false);
    const [isEmpty, setIsEmpty] = React.useState(true);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = React.useState(false);

    const $updateToolbar = React.useCallback(function () {
        const selection = $getSelection();
        if($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
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

    // Mode toggle is always shown when mode prop is provided
    const hasModeToggle = properties.mode !== undefined;

    // Check if any content should be shown
    const hasLeftContent = showHistory || showFormatting;
    const hasRightContent = showAttachments || showSubmit || hasModeToggle;
    const hasAnyContent = hasLeftContent || hasRightContent;

    // If nothing to show, render nothing
    if(!hasAnyContent && attachedFiles.length === 0) {
        return null;
    }

    // Determine if formatting controls should be disabled (disabled in Source mode)
    const isSourceMode = properties.mode === 'Source';
    const formattingDisabled = properties.disabled || isSourceMode;

    // Render the component
    return (
        <div>
            {/* Attachments */}
            {attachedFiles.length > 0 && (
                <InputMarkupAttachments
                    files={attachedFiles}
                    onRemoveFile={function (index) {
                        properties.onRemoveFile?.(index);
                    }}
                    isDisabled={properties.disabled}
                />
            )}

            {hasAnyContent && (
                <div
                    className={mergeClassNames(
                        'flex w-full shrink-0 items-center justify-between gap-4 overflow-x-auto',
                        properties.className,
                    )}
                >
                    {/* Left side: History and Formatting */}
                    <div className="flex items-center gap-1">
                        {showHistory && (
                            <>
                                <Button
                                    className="rounded-xl"
                                    icon={ArrowCounterClockwiseIcon}
                                    size="Icon"
                                    disabled={!canUndo || properties.disabled}
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
                                    disabled={!canRedo || properties.disabled}
                                    onClick={function () {
                                        editor.dispatchCommand(REDO_COMMAND, undefined);
                                    }}
                                    aria-label="Redo"
                                    variant="Ghost"
                                />
                            </>
                        )}

                        {/* Add a spacer div if history and formatting are both shown */}
                        {showHistory && showFormatting && <div />}

                        {showFormatting && (
                            <>
                                <Toggle
                                    className="rounded-xl"
                                    isPressed={isBold}
                                    onClick={function () {
                                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                                    }}
                                    aria-label="Format Bold"
                                    variant="Ghost"
                                    disabled={formattingDisabled}
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
                                    disabled={formattingDisabled}
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
                                    disabled={formattingDisabled}
                                >
                                    <TextUnderlineIcon weight="bold" />
                                </Toggle>
                            </>
                        )}
                    </div>

                    {/* Right side: Mode toggle, Attachments, and Submit */}
                    <div className="flex items-center gap-1">
                        {/* Mode toggle - Source (code icon) vs Visual (eye icon) */}
                        {hasModeToggle && (
                            <Button
                                className="rounded-xl"
                                size="Icon"
                                variant="Ghost"
                                icon={isSourceMode ? EyeIcon : CodeIcon}
                                onClick={function () {
                                    const newMode = isSourceMode ? 'Visual' : 'Source';
                                    properties.onModeChange?.(newMode);
                                }}
                                aria-label={isSourceMode ? 'Switch to Visual mode' : 'Switch to Source mode'}
                                disabled={properties.disabled}
                            />
                        )}

                        {showAttachments && (
                            <>
                                <Button
                                    className="rounded-xl"
                                    icon={PaperclipIcon}
                                    size="Icon"
                                    aria-label="Attach file"
                                    variant="Ghost"
                                    onClick={function () {
                                        setIsAttachmentModalOpen(true);
                                    }}
                                    disabled={properties.disabled}
                                />
                                <InputMarkupAttachmentsDialog
                                    open={isAttachmentModalOpen}
                                    onOpenChange={setIsAttachmentModalOpen}
                                    onSave={function (files) {
                                        properties.onSaveFiles?.(files);
                                    }}
                                />
                            </>
                        )}

                        {showSubmit && (
                            <Button
                                type={properties.onSubmit ? 'button' : 'submit'}
                                variant="A"
                                className="rounded-2xl"
                                disabled={isEmpty || properties.disabled}
                                aria-label={properties.submitLabel ?? 'Send'}
                                onClick={properties.onSubmit}
                            >
                                {properties.isLoading ? (
                                    <>
                                        {properties.submitLoadingLabel ?? 'Sending'}
                                        <SpinnerIcon className="animate-spin" />
                                    </>
                                ) : (
                                    properties.submitLabel ?? 'Send'
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
