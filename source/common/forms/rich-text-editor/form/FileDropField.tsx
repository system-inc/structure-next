'use client';

import React from 'react';
import { FormField, FormFieldProps } from './FormField';
import { FileDrop, FileInput, FileList, formatFileSize } from './FileDrop';
import { useSpring, animated } from '@react-spring/web';
import { Button, buttonVariants } from './../Button';
import {
    File,
    FilePdf,
    Icon,
    Image,
    MicrosoftExcelLogo,
    MicrosoftPowerpointLogo,
    MicrosoftWordLogo,
    Plus,
    TrashSimple,
    Video,
    Waveform,
} from '@phosphor-icons/react';
import { mergeClassNames } from '@structure/source/utilities/Style';
import { getClassNamesByModifier } from './../utilities/getClassNamesByModifier';

type FileDropFieldProps<T extends HTMLElement> = FormFieldProps<T> &
    Omit<React.ComponentPropsWithoutRef<typeof FileDrop>, 'children'> & {
        multiple?: boolean;
    };
const FileDropField = <T extends HTMLElement>({
    label,
    caption,
    error,
    optional,
    files,
    onFilesChange,
    multiple = false,
    ...props
}: FileDropFieldProps<T>) => {
    const [dragging, setDragging] = React.useState(false);

    const borderSpring = useSpring({
        borderColor: dragging ? 'var(--content-primary)' : 'var(--border-primary)',
    });

    const groupHoverClassNames = getClassNamesByModifier(
        'hover',
        buttonVariants({
            variant: 'secondary',
        }),
    )
        .map((cn) => `group-hover:${cn}`)
        .join(' ');

    return (
        <FormField label={label} caption={caption} error={error} optional={optional}>
            <FileDrop
                files={files}
                onFilesChange={onFilesChange}
                isDragging={dragging}
                onDragChange={setDragging}
                {...props}
            >
                <FileInput
                    multiple={multiple}
                    className="select-none rounded-medium transition focus-within:outline-none focus-within:ring-1 focus-within:ring-blue focus-within:ring-offset-1 hover:cursor-pointer"
                >
                    <animated.div
                        style={borderSpring}
                        className="group box-border flex h-36 w-full flex-col items-center justify-center rounded-medium border border-dashed px-6 py-5 text-sm"
                        suppressHydrationWarning
                    >
                        <p className="font-medium">Drag and drop or select files to upload.</p>
                        <p className="text-opsis-content-secondary mt-2 transition-colors">
                            Attach any files that might help us assist you better.
                        </p>

                        <Button
                            variant="secondary"
                            size="small"
                            iconRight={<Plus />}
                            className={mergeClassNames('pointer-events-none mt-6', groupHoverClassNames)}
                            tabIndex={-1}
                            type="button"
                        >
                            Select Files
                        </Button>
                    </animated.div>
                </FileInput>
                <FileList className="mt-4 flex flex-col items-stretch gap-2" component={FileListItem} />
            </FileDrop>
        </FormField>
    );
};

export default FileDropField;

export function getFileTypeIconFromType(type: string): Icon {
    switch(true) {
        case type.includes('image'):
            return Image;
        case type.includes('pdf'):
            return FilePdf;
        case type.includes('audio'):
            return Waveform;
        case type.includes('video'):
            return Video;
        case type.includes('word'):
            return MicrosoftWordLogo;
        case type.includes('excel'):
            return MicrosoftExcelLogo;
        case type.includes('powerpoint'):
            return MicrosoftPowerpointLogo;
        default:
            return File;
    }
}

type FileListItemProps = React.ComponentPropsWithoutRef<React.ComponentPropsWithoutRef<typeof FileList>['component']>;
function FileListItem({ file, removeFile, index }: FileListItemProps) {
    const FileTypeIcon = getFileTypeIconFromType(file.type);

    return (
        <div className={'bg-opsis-background-secondary flex items-center justify-between rounded-medium px-5 py-3'}>
            <FileTypeIcon className="mr-4 size-5" weight="regular" />

            <div className="min-w-0 flex-1">
                <p className="text-opsis-content-primary truncate text-sm font-medium">{file.name}</p>
            </div>

            <div className="flex items-center gap-4 pl-2">
                <p className="text-opsis-content-secondary text-sm">{formatFileSize(file.size)}</p>
                <Button
                    variant="ghost"
                    icon
                    size="extra-small"
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                    }}
                    className="flexitems-center justify-center hover:text-red-500 focus:text-red-500"
                    aria-label="Remove file"
                >
                    <TrashSimple />
                </Button>
            </div>
        </div>
    );
}
