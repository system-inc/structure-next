// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { TipButton } from '@structure/source/components/buttons/TipButton';

// Dependencies - Assets
import ImageIcon from '@structure/assets/icons/content/ImageIcon.svg';
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';
import ErrorIcon from '@structure/assets/icons/status/ErrorIcon.svg';

// Component - TableCellContentImageUrl
export interface TableCellContentImageUrlProperties extends React.HTMLAttributes<HTMLElement> {
    value: string;
    url: string;
    openUrlInNewTab?: boolean;
}
export function TableCellContentImageUrl(properties: TableCellContentImageUrlProperties) {
    // State
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageFailedToLoad, setImageFailedToLoad] = React.useState(false);

    // Render the component
    return (
        <div className="flex items-center">
            <TipButton
                icon={ImageIcon}
                openOnPress={true}
                tipClassName="border-none"
                popoverProperties={{
                    align: 'Start',
                    side: 'Left',
                }}
                tip={
                    (
                        <div className="relative min-h-[80px] w-96">
                            {!imageLoaded && !imageFailedToLoad && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-md border border--0">
                                    <BrokenCircleIcon className="h-8 w-8 animate-spin" />
                                </div>
                            )}
                            {imageFailedToLoad ? (
                                <div className="absolute inset-0 flex items-center justify-center rounded-md border border-red-500">
                                    <ErrorIcon className="mr-1.5 h-5 w-5 text-red-500" />
                                    <p>Image failed to load.</p>
                                </div>
                            ) : (
                                <Image
                                    className="rounded-md border border--0"
                                    src={properties.url}
                                    alt="Image"
                                    // layout="responsive"
                                    width={384}
                                    height={384}
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    onLoad={function () {
                                        setImageLoaded(true);
                                    }}
                                    onError={function () {
                                        setImageFailedToLoad(true);
                                    }}
                                />
                            )}
                        </div>
                    ) as React.ReactNode
                }
            />
            <Link
                href={properties.url}
                className="ml-1 hover:underline"
                target={properties.openUrlInNewTab ? '_blank' : undefined}
                prefetch={false}
            >
                {properties.value}
            </Link>
        </div>
    );
}
