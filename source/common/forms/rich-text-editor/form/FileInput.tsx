'use client';

import { mergeClassNames } from '@structure/source/utilities/Style';
import React from 'react';
import { useFileContext } from './FileContext';

// Component - FileInput
export type FileInputProperties = {
    multiple?: boolean;
    children?: React.ReactNode;
    className?: string;
};
export function FileInput(properties: FileInputProperties) {
    const multiple = properties.multiple ?? false;
    const { addFiles, onDragChange, accept } = useFileContext();
    const inputReference = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if(fileList) {
            addFiles(Array.from(fileList));
        }

        // Reset the input value so the same file can be selected again
        if(inputReference.current) {
            inputReference.current.value = '';
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDragChange(true);
    };

    const handleDragLeave = () => {
        onDragChange(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDragChange(false);

        if(event.dataTransfer.files) {
            addFiles(Array.from(event.dataTransfer.files));
        }
    };

    const handleClick = () => {
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
                accept={`${accept?.join(',')}`}
                multiple={multiple}
            />
            {properties.children}
        </div>
    );
}