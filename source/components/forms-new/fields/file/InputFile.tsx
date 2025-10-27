'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useInputFileContext } from './InputFileContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - InputFile
export type InputFileProperties = {
    multiple?: boolean;
    children?: React.ReactNode;
    className?: string;
};
export function InputFile(properties: InputFileProperties) {
    const multiple = properties.multiple ?? false;
    const inputFileContext = useInputFileContext();
    const inputReference = React.useRef<HTMLInputElement>(null);

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
        <div
            className={mergeClassNames(`relative`, properties.className)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={inputReference}
                className="sr-only"
                onChange={handleFileChange}
                accept={`${inputFileContext.accept?.join(',')}`}
                multiple={multiple}
            />
            {properties.children}
        </div>
    );
}
