// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Popover } from '@structure/source/common/popovers/Popover';

// Dependencies - Assets
import InformationCircledIcon from '@structure/assets/icons/status/InformationCircledIcon.svg';
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';
import { ArrowSquareOut } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { isImageFile } from '@structure/source/utilities/File';

// Component - MetadataContent
export interface MetadataContentProperties {
    metadata: { [key: string]: string | number };
}
export function MetadataContent(properties: MetadataContentProperties) {
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
export interface FileCarouselProperties {
    files: {
        url: string;
        metadata?: { [key: string]: string | number };
    }[];
    className?: string;
    startIndex?: number;
}
export function FileCarousel(properties: FileCarouselProperties) {
    // State
    const [currentFileIndex, setCurrentFileIndex] = React.useState(properties.startIndex || 0);
    const currentFile = properties.files[currentFileIndex];

    // Update currentFileIndex when startIndex changes
    React.useEffect(
        function () {
            if(properties.startIndex !== undefined) {
                setCurrentFileIndex(properties.startIndex);
            }
        },
        [properties.startIndex],
    );

    // Function to navigate to the previous file
    const previousFile = React.useCallback(
        function () {
            setCurrentFileIndex((currentFileIndex - 1 + properties.files.length) % properties.files.length);
        },
        [currentFileIndex, properties.files.length],
    );

    // Function to navigate to the next file
    const nextFile = React.useCallback(
        function () {
            setCurrentFileIndex((currentFileIndex + 1) % properties.files.length);
        },
        [currentFileIndex, properties.files.length],
    );

    // Effect to handle keyboard navigation
    React.useEffect(
        function () {
            function handleKeydown(event: KeyboardEvent) {
                if(event.key === 'ArrowLeft') {
                    previousFile();
                }
                else if(event.key === 'ArrowRight') {
                    nextFile();
                }
            }

            window.addEventListener('keydown', handleKeydown);
            return function () {
                window.removeEventListener('keydown', handleKeydown);
            };
        },
        [currentFileIndex, nextFile, previousFile],
    );

    // Render the component
    return (
        <>
            {currentFile && (
                <div className={mergeClassNames('relative h-full', properties.className)}>
                    {/* File Preview */}
                    <div className="relative flex h-full items-center justify-center">
                        {isImageFile(currentFile.url) ? (
                            <Image src={currentFile.url} alt="File" className="object-contain" fill={true} />
                        ) : (
                            <a href={currentFile.url} target="_blank" rel="noopener noreferrer">
                                Download
                            </a>
                        )}
                    </div>

                    {/* Next Button */}
                    {properties.files.length > 1 && (
                        <Button
                            onClick={nextFile}
                            variant="unstyled"
                            className="absolute right-0 top-1/2 flex h-auto -translate-y-1/2 transform items-center justify-center rounded border border-transparent px-2 py-2 focus:border-light-3 focus-visible:outline-none focus-visible:ring-0 dark:focus:border-dark-3"
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </Button>
                    )}

                    {/* Previous Button */}
                    {properties.files.length > 1 && (
                        <Button
                            variant="unstyled"
                            className="absolute left-0 top-1/2 flex h-auto -translate-y-1/2 transform items-center justify-center rounded border border-transparent px-2 py-2 focus:border-light-3 focus-visible:outline-none focus-visible:ring-0 dark:focus:border-dark-3"
                            icon={ChevronLeftIcon}
                            iconClassName="h-6 w-6"
                            onClick={previousFile}
                        />
                    )}

                    {/* Top Right Controls */}
                    <div className="absolute right-0 top-0 m-2 flex gap-2">
                        {/* Open in New Tab Button */}
                        <Button
                            variant="unstyled"
                            className="rounded-lg bg-dark/20 p-2 backdrop-blur transition-colors hover:bg-dark/30 dark:bg-light/20 dark:hover:bg-light/30"
                            onClick={() => {
                                window.open(currentFile.url, '_blank');
                            }}
                            aria-label="Open in new tab"
                        >
                            <ArrowSquareOut className="h-5 w-5 text-light dark:text-dark" weight="bold" />
                        </Button>

                        {/* Metadata Popover */}
                        {currentFile.metadata && (
                            <Popover
                                content={<MetadataContent metadata={currentFile.metadata} />}
                                side="top"
                                align="end"
                            >
                                <Button
                                    variant="unstyled"
                                    className="rounded-lg bg-dark/20 p-2 backdrop-blur transition-colors hover:bg-dark/30 dark:bg-light/20 dark:hover:bg-light/30"
                                >
                                    <InformationCircledIcon className="h-5 w-5 text-light dark:text-dark" />
                                </Button>
                            </Popover>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
