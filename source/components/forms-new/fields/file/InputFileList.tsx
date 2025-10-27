'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useInputFileContext } from './InputFileContext';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - InputFileList
export type InputFileListProperties = {
    className?: string;
    component: React.ComponentType<{ file: File; removeFile: (index: number) => void; index: number }>;
};
export function InputFileList(properties: InputFileListProperties) {
    const inputFileContext = useInputFileContext();

    if(!inputFileContext.files || inputFileContext.files.length === 0) {
        return null;
    }

    return (
        <ul className={mergeClassNames('', properties.className)}>
            {inputFileContext.files.map((file, index) => (
                <li key={index}>
                    <properties.component file={file} removeFile={inputFileContext.removeFile} index={index} />
                </li>
            ))}
        </ul>
    );
}
