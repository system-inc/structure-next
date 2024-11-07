// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { Popover } from '@structure/source/common/popovers/Popover';

// Dependencies - Assets
import InformationCircledIcon from '@structure/assets/icons/status/InformationCircledIcon.svg';
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { isImageFile } from '@structure/source/utilities/File';

// Component - MetadataContent
export interface MetadataContentInterface {
    metadata: { [key: string]: string | number };
}
export function MetadataContent(properties: MetadataContentInterface) {
    return (
        <div className="p-2 text-sm">
            {Object.entries(properties.metadata).map(([key, value]) => (
                <div key={key}>
                    <strong>{key}:</strong> {value}
                </div>
            ))}
        </div>
    );
}

// Component - FileCarousel
export interface FileCarouselInterface {
    files: {
        url: string;
        metadata?: { [key: string]: string | number };
    }[];
    className?: string;
    startIndex?: number;
}
export function FileCarousel(properties: FileCarouselInterface) {
    // State
    const [currentFileIndex, setCurrentFileIndex] = React.useState(properties.startIndex || 0);
    const currentFile = properties.files[currentFileIndex];

    // Update currentFileIndex when startIndex changes
    React.useEffect(() => {
        if(properties.startIndex !== undefined) {
            setCurrentFileIndex(properties.startIndex);
        }
    }, [properties.startIndex]);

    // Function to navigate to the previous file
    function previousFile() {
        setCurrentFileIndex((currentFileIndex - 1 + properties.files.length) % properties.files.length);
    }

    // Function to navigate to the next file
    function nextFile() {
        setCurrentFileIndex((currentFileIndex + 1) % properties.files.length);
    }

    // Render the component
    return (
        <>
            {currentFile && (
                <div className={mergeClassNames('relative', properties.className)}>
                    {/* Previous Button */}
                    {properties.files.length > 1 && (
                        <button onClick={previousFile} className="absolute left-0 top-1/2 -translate-y-1/2 transform">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                    )}

                    {/* File Preview */}
                    <div className="flex items-center justify-center">
                        {isImageFile(currentFile.url) ? (
                            <Image src={currentFile.url} alt="File" width={400} height={400} />
                        ) : (
                            <a href={currentFile.url} target="_blank" rel="noopener noreferrer">
                                Download
                            </a>
                        )}
                    </div>

                    {/* Next Button */}
                    {properties.files.length > 1 && (
                        <button onClick={nextFile} className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    )}

                    {/* Metadata Popover */}
                    {currentFile.metadata && (
                        <Popover content={<MetadataContent metadata={currentFile.metadata} />} side="top" align="end">
                            <button className="absolute right-0 top-0 m-2">
                                <InformationCircledIcon className="h-5 w-5" />
                            </button>
                        </Popover>
                    )}
                </div>
            )}
        </>
    );
}

// Export - Default
export default FileCarousel;
