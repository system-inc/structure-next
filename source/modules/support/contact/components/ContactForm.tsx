'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useUrlSearchParameters } from '@structure/source/router/Navigation';
import { useForm, setFieldSuccesses } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import {
    supportTicketCreateRequestInputSchema,
    SupportTicketCreateRequestInputType,
    useSupportTicketCreateRequest,
} from '@structure/source/modules/support/contact/hooks/useSupportTicketCreateRequest';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { ContactMessagePreview } from './ContactMessagePreview';

// Dependencies - Animation
import { motion } from 'motion/react';

// Dependencies - Assets
import { PlusIcon, TrashSimpleIcon, PaperPlaneRightIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { iconForFileType, formatFileSize } from '@structure/source/utilities/file/File';

// Component - ContactForm
export function ContactForm() {
    // State
    const [dragging, setDragging] = React.useState(false);

    // Hooks
    const account = useAccount();
    const urlSearchParameters = useUrlSearchParameters();
    const supportTicketCreateRequest = useSupportTicketCreateRequest();
    const form = useForm({
        defaultValues: {
            // Form variables
            emailAddress: '',
            title: '',
            content: '',
            attachmentFiles: [],

            // Static variables with default values
            contentType: 'Markdown' as const,
            type: 'Contact' as const,
            description: '',
        } as SupportTicketCreateRequestInputType,
        onSubmit: async function (submitProperties) {
            try {
                await supportTicketCreateRequest.execute(submitProperties.value);
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

    // Render the component
    return (
        <div className="relative mx-auto max-w-2xl">
            {/* Form Submitted Successfully */}
            {supportTicketCreateRequest.isSuccess ? (
                <ContactMessagePreview
                    title={form.state.values.title}
                    content={form.state.values.content}
                    emailAddress={form.state.values.emailAddress}
                    attachmentFiles={form.state.values.attachmentFiles}
                />
            ) : (
                // Contact Form
                <form.Form className="mt-12 flex flex-col items-stretch gap-4">
                    {/* Field - Email Address */}
                    <form.Field
                        name="emailAddress"
                        validators={{
                            onChangeAsync: async function (field) {
                                const validation =
                                    await supportTicketCreateRequestInputSchema.shape.emailAddress.validate(
                                        field.value,
                                    );

                                // Write successes to field meta
                                setFieldSuccesses(field.fieldApi, validation.successes);

                                return validation.valid ? undefined : validation.errors?.[0]?.message;
                            },
                        }}
                    >
                        <form.Label label="Your Email Address" showSuccessesWhen="Always">
                            <form.InputText placeholder="email@domain.com" autoComplete="email" spellCheck={false} />
                        </form.Label>
                    </form.Field>

                    {/* Field - Title */}
                    <form.Field
                        name="title"
                        validators={{
                            onChangeAsync: async function (fieldProperties) {
                                const titleSchema = supportTicketCreateRequestInputSchema.shape.title;
                                const result = await titleSchema.validate(fieldProperties.value);

                                // Write successes to field meta
                                setFieldSuccesses(fieldProperties.fieldApi, result.successes);

                                return result.valid ? undefined : result.errors?.[0]?.message;
                            },
                        }}
                    >
                        <form.Label label="Subject" showSuccessesWhen="Always">
                            <form.InputText placeholder="Briefly describe your message" type="text" spellCheck={true} />
                        </form.Label>
                    </form.Field>

                    {/* Field - Content */}
                    <form.Field
                        name="content"
                        validators={{
                            onChangeAsync: async function (fieldProperties) {
                                const contentSchema = supportTicketCreateRequestInputSchema.shape.content;
                                const result = await contentSchema.validate(fieldProperties.value);

                                // Write successes to field meta
                                setFieldSuccesses(fieldProperties.fieldApi, result.successes);

                                return result.valid ? undefined : result.errors?.[0]?.message;
                            },
                        }}
                    >
                        <form.Label label="Message" showSuccessesWhen="Always">
                            <form.InputTextArea
                                placeholder="Please include any details that will help us assist you"
                                rows={8}
                                spellCheck={true}
                            />
                        </form.Label>
                    </form.Field>

                    {/* Field - Attachment Files */}
                    <form.Field name="attachmentFiles">
                        {function (field) {
                            return (
                                <form.Label label="Attachments" optional>
                                    <form.InputFileDrop
                                        files={field.state.value}
                                        isDragging={dragging}
                                        onDragChange={setDragging}
                                        onFilesChange={function (newFiles) {
                                            field.handleChange(newFiles);
                                        }}
                                        accept={[
                                            'image/jpeg',
                                            'image/png',
                                            'image/webp',
                                            'application/pdf',
                                            'application/json',
                                        ]}
                                    >
                                        {/* File input */}
                                        <form.InputFile
                                            multiple
                                            className="rounded-md transition select-none focus-within:ring-1 focus-within:ring-offset-1 focus-within:outline-none hover:cursor-pointer"
                                        >
                                            <motion.div
                                                className={`group box-border flex h-36 w-full flex-col items-center justify-center rounded-md border border-dashed px-6 py-5 text-sm ${
                                                    dragging ? 'border--focus' : 'border--0'
                                                }`}
                                                animate={{
                                                    borderColor: dragging ? '--border--focus)' : '--border--0)',
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <p className="font-medium">Drag and drop or select files to upload.</p>
                                                <p className="mt-2 content--1 transition-colors">
                                                    Attach any files that might help us assist you better.
                                                </p>

                                                <Button
                                                    variant="A"
                                                    size="Small"
                                                    iconRight={PlusIcon}
                                                    className="pointer-events-none mt-6"
                                                    tabIndex={-1}
                                                    type="button"
                                                >
                                                    Select Files
                                                </Button>
                                            </motion.div>
                                        </form.InputFile>
                                        <form.InputFileList
                                            className="mt-4 flex flex-col items-stretch gap-2"
                                            component={function FileListItem(fileProperties) {
                                                const fileTypeIconFunction = iconForFileType(fileProperties.file.type);

                                                return (
                                                    <div
                                                        className={
                                                            'flex items-center justify-between rounded-md background--1 px-5 py-3'
                                                        }
                                                    >
                                                        {React.createElement(fileTypeIconFunction, {
                                                            className: 'mr-4 size-5',
                                                        })}

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium content--0">
                                                                {fileProperties.file.name}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-4 pl-2">
                                                            <p className="text-sm content--1">
                                                                {formatFileSize(fileProperties.file.size)}
                                                            </p>
                                                            <Button
                                                                variant="Ghost"
                                                                icon={TrashSimpleIcon}
                                                                size="ExtraSmall"
                                                                type="button"
                                                                onClick={function (event) {
                                                                    event.stopPropagation();
                                                                    fileProperties.removeFile(fileProperties.index);
                                                                }}
                                                                className="hover:text-red-500 focus:text-red-500"
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

                    <AnimatedButton
                        variant="A"
                        type="submit"
                        isProcessing={supportTicketCreateRequest.isLoading}
                        processingIcon={PaperPlaneRightIcon}
                        animateIconPosition="iconRight"
                        iconRight={PaperPlaneRightIcon}
                    >
                        Send Message
                    </AnimatedButton>
                </form.Form>
            )}
        </div>
    );
}
