'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useInputFileContext } from './InputFileContext';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { InputFileDrop } from './InputFileDrop';
import { InputFileList } from './InputFileList';

// Dependencies - Assets
import { PaperclipIcon, TrashSimpleIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { iconForFileType, bytesToScaledUnits } from '@structure/source/utilities/file/File';

// Interface - FileListItemRenderProperties
export interface FileListItemRenderProperties {
    file: File;
    index: number;
    removeFile: (index: number) => void;
}

// Interface - DropZoneRenderProperties
export interface DropZoneRenderProperties {
    isDragging: boolean;
}

// Component - InputFileContent
// Internal component that uses InputFileContext
function InputFileContent(properties: {
    id: string;
    multiple?: boolean;
    className?: string;
    description?: string;
    renderDropZone?: (properties: DropZoneRenderProperties) => React.ReactNode;
    renderFileListItem?: (properties: FileListItemRenderProperties) => React.ReactNode;
}) {
    // Get context from InputFileDrop
    const inputFileContext = useInputFileContext();
    const inputReference = React.useRef<HTMLInputElement>(null);

    // Default drop zone renderer
    const defaultDropZoneRenderer = function (dropZoneProperties: DropZoneRenderProperties) {
        return (
            <div
                className={mergeClassNames(
                    'group flex h-36 w-full flex-col items-center justify-center rounded-md border border-dashed px-6 py-5 text-sm transition-colors duration-200',
                    dropZoneProperties.isDragging ? 'border--focus' : 'border--0',
                )}
            >
                <p className="font-medium">Drag and drop or select files to upload.</p>
                {properties.description && (
                    <p className="mt-2 content--1 transition-colors">{properties.description}</p>
                )}
                <Button variant="A" size="Small" iconLeft={PaperclipIcon} className="mt-6">
                    Select Files
                </Button>
            </div>
        );
    };

    // Default file list item renderer
    const defaultFileListItemRenderer = function (itemProperties: FileListItemRenderProperties) {
        const FileTypeIcon = iconForFileType(itemProperties.file.type);

        return (
            <div className="flex items-center justify-between rounded-md background--1 px-4 py-2">
                <FileTypeIcon className="mr-4 size-5" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium content--0">{itemProperties.file.name}</p>
                </div>
                <div className="flex items-center gap-3 pl-2">
                    <p className="text-sm content--1">{bytesToScaledUnits(itemProperties.file.size)}</p>
                    <Button
                        variant="Ghost"
                        icon={TrashSimpleIcon}
                        size="IconSmall"
                        onClick={function (event) {
                            event.stopPropagation();
                            itemProperties.removeFile(itemProperties.index);
                        }}
                        className="hover:content--negative focus:content--negative"
                        aria-label="Remove file"
                    />
                </div>
            </div>
        );
    };

    const dropZoneRenderer = properties.renderDropZone ?? defaultDropZoneRenderer;
    const fileListItemRenderer = properties.renderFileListItem ?? defaultFileListItemRenderer;

    const handleFileChange = function (event: React.ChangeEvent<HTMLInputElement>) {
        const fileList = event.target.files;
        if(fileList) {
            inputFileContext.addFiles(Array.from(fileList));
        }

        // Reset the input value so the same file can be selected again
        if(inputReference.current) {
            inputReference.current.value = '';
        }
    };

    const handleDragOver = function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        inputFileContext.onDragChange(true);
    };

    const handleDragLeave = function () {
        inputFileContext.onDragChange(false);
    };

    const handleDrop = function (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        inputFileContext.onDragChange(false);

        if(event.dataTransfer.files) {
            inputFileContext.addFiles(Array.from(event.dataTransfer.files));
        }
    };

    const handleClick = function () {
        inputReference.current?.click();
    };

    return (
        <>
            <div
                className={mergeClassNames(
                    'relative rounded-md transition select-none hover:cursor-pointer',
                    properties.className,
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    id={properties.id}
                    type="file"
                    ref={inputReference}
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={inputFileContext.accept?.join(',')}
                    multiple={properties.multiple ?? false}
                />
                {dropZoneRenderer({ isDragging: inputFileContext.isDragging })}
            </div>
            <InputFileList className="mt-4 flex flex-col items-stretch gap-2" component={fileListItemRenderer} />
        </>
    );
}

// Component - InputFile
// Complete file upload component with drop zone and file list
export interface InputFileProperties {
    id: string;
    files?: File[];
    onFilesChange?: (files: File[]) => void;
    accept?: string[];
    multiple?: boolean;
    className?: string;
    description?: string;
    renderDropZone?: (properties: DropZoneRenderProperties) => React.ReactNode;
    renderFileListItem?: (properties: FileListItemRenderProperties) => React.ReactNode;
}
export function InputFile(properties: InputFileProperties) {
    return (
        <InputFileDrop files={properties.files} onFilesChange={properties.onFilesChange} accept={properties.accept}>
            <InputFileContent
                id={properties.id}
                multiple={properties.multiple}
                className={properties.className}
                description={properties.description}
                renderDropZone={properties.renderDropZone}
                renderFileListItem={properties.renderFileListItem}
            />
        </InputFileDrop>
    );
}
