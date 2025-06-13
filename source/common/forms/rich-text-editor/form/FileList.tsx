'use client';

import { mergeClassNames } from '@structure/source/utilities/Style';
import React from 'react';
import { useFileContext } from './FileContext';

// Component - FileList
export type FileListProperties = {
    className?: string;
    component: React.ComponentType<{ file: File; removeFile: (index: number) => void; index: number }>;
};
export function FileList(properties: FileListProperties) {
    const { files, removeFile } = useFileContext();

    if(files.length === 0) {
        return null;
    }

    return (
        <ul className={mergeClassNames('', properties.className)}>
            {files.map((file, index) => (
                <li key={index}>
                    <properties.component file={file} removeFile={removeFile} index={index} />
                </li>
            ))}
        </ul>
    );
}