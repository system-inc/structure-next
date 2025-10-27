'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useUrlSearchParameters } from '@structure/source/router/Navigation';
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import {
    supportTicketCreateRequestInputSchema,
    useSupportTicketCreateRequest,
} from '@structure/source/modules/support/contact/hooks/useSupportTicketCreateRequest';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { ContactMessagePreview } from './ContactMessagePreview';

// Dependencies - Animation
import { motion } from 'motion/react';

// Dependencies - Assets
import { PlusIcon, TrashSimpleIcon, PaperPlaneRightIcon, SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { iconForFileType, bytesToScaledUnits } from '@structure/source/utilities/file/File';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - ContactForm
export function ContactForm() {
    // State
    const [dragging, setDragging] = React.useState(false);

    // References
    const scrollTargetReference = React.useRef<HTMLDivElement>(null);

    // Testing
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Hooks
    const account = useAccount();
    const urlSearchParameters = useUrlSearchParameters();
    const supportTicketCreateRequest = useSupportTicketCreateRequest();
    const form = useForm({
        schema: supportTicketCreateRequestInputSchema,
        onSubmit: async function (formState) {
            console.log('Submitting contact form with values:', formState.value);
            try {
                setIsProcessing(true);
                await new Promise((resolve) => setTimeout(resolve, 2500));
                setIsSuccess(true);
                // await supportTicketCreateRequest.execute(submitProperties.value);
            }
            catch(error) {
                console.error(error);
            }
        },
    });

    // Effect to set the email address and subject automatically
    React.useEffect(
        function () {
            // Set email if user is signed in
            if(account.data?.emailAddress) {
                form.setFieldValue('emailAddress', account.data.emailAddress);
            }

            // Set subject from URL parameter
            const subject = urlSearchParameters.get('subject');
            if(subject) {
                form.setFieldValue('title', subject);
            }
        },
        [urlSearchParameters, form, account.data],
    );

    // Effect to scroll to top when success state changes
    React.useEffect(
        function () {
            if(isSuccess || supportTicketCreateRequest.isSuccess) {
                // Scroll to the top of the page
                scrollTargetReference.current?.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        },
        [isSuccess, supportTicketCreateRequest.isSuccess],
    );

    // Render the component
    return (
        <>
            {/* Scroll target for smooth scrolling to top */}
            <div ref={scrollTargetReference} className="absolute top-[-1000px] opacity-0" />
            <div className="relative mx-auto max-w-2xl">
                {/* Form Submitted Successfully */}
                {isSuccess || supportTicketCreateRequest.isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <ContactMessagePreview
                            title={form.state.values.title}
                            content={form.state.values.content}
                            emailAddress={form.state.values.emailAddress}
                            attachmentFiles={form.state.values.attachmentFiles}
                        />
                    </motion.div>
                ) : (
                    // Contact Form
                    <form.Form className="mt-12 flex flex-col items-stretch gap-4">
                        {/* Field - Email Address */}
                        <form.Field name="emailAddress">
                            <form.Label label="Your Email Address">
                                <form.InputText type="email" />
                            </form.Label>
                        </form.Field>

                        {/* Field - Title */}
                        <form.Field name="title">
                            <form.Label label="Subject">
                                <form.InputText placeholder="Briefly describe your message" />
                            </form.Label>
                        </form.Field>

                        {/* Field - Content */}
                        <form.Field name="content">
                            <form.Label label="Message">
                                <form.InputTextArea
                                    placeholder="Please include any details that will help us assist you"
                                    rows={8}
                                />
                            </form.Label>
                        </form.Field>

                        {/* Field - Attachment Files */}
                        <form.Field name="attachmentFiles">
                            {function (field) {
                                return (
                                    <form.Label label="Attachments" optional={true}>
                                        <form.InputFileDrop
                                            files={field.state.value}
                                            isDragging={dragging}
                                            onDragChange={setDragging}
                                            onFilesChange={function (newFiles) {
                                                field.handleChange(newFiles);
                                            }}
                                        >
                                            {/* File input */}
                                            <form.InputFile
                                                multiple
                                                className="rounded-md transition select-none hover:cursor-pointer"
                                            >
                                                <motion.div
                                                    className={mergeClassNames(
                                                        'group flex h-36 w-full flex-col items-center justify-center rounded-md border border-dashed px-6 py-5 text-sm transition-colors duration-200',
                                                        dragging ? 'border--focus' : 'border--0',
                                                    )}
                                                >
                                                    <p className="font-medium">
                                                        Drag and drop or select files to upload.
                                                    </p>
                                                    <p className="mt-2 content--1 transition-colors">
                                                        Attach any files that might help us assist you better.
                                                    </p>

                                                    <Button
                                                        variant="A"
                                                        size="Small"
                                                        iconRight={PlusIcon}
                                                        className="mt-6"
                                                    >
                                                        Select Files
                                                    </Button>
                                                </motion.div>
                                            </form.InputFile>
                                            <form.InputFileList
                                                className="mt-4 flex flex-col items-stretch gap-2"
                                                component={function FileListItem(fileProperties) {
                                                    const FileTypeIcon = iconForFileType(fileProperties.file.type);

                                                    return (
                                                        <div
                                                            className={
                                                                'flex items-center justify-between rounded-md background--1 px-4 py-2'
                                                            }
                                                        >
                                                            <FileTypeIcon className="mr-4 size-5" />

                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-medium content--0">
                                                                    {fileProperties.file.name}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 pl-2">
                                                                <p className="text-sm content--1">
                                                                    {bytesToScaledUnits(fileProperties.file.size)}
                                                                </p>
                                                                <Button
                                                                    variant="Ghost"
                                                                    icon={TrashSimpleIcon}
                                                                    size="IconSmall"
                                                                    onClick={function (event) {
                                                                        event.stopPropagation();
                                                                        fileProperties.removeFile(fileProperties.index);
                                                                    }}
                                                                    className="hover:content--negative focus:content--negative"
                                                                    aria-label="Remove file"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </form.InputFileDrop>
                                    </form.Label>
                                );
                            }}
                        </form.Field>

                        {/* Submit Button */}
                        <AnimatedButton
                            variant="A"
                            type="submit"
                            iconRight={PaperPlaneRightIcon}
                            isProcessing={isProcessing || supportTicketCreateRequest.isLoading}
                            processingIcon={SpinnerIcon}
                            animateIconPosition="iconRight"
                        >
                            Send Message
                        </AnimatedButton>
                    </form.Form>
                )}
            </div>
        </>
    );
}
