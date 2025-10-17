'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { TextAreaField } from '@project/app/_components/form/TextAreaField';
import { TextField } from '@project/app/_components/form/TextField';
import { FileDropField } from '@project/app/_components/form/FileDropField';
import { ContactMessagePreview } from './ContactMessagePreview';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import {
    supportTicketCreateRequestInputSchema,
    SupportTicketCreateRequestInputType,
    useSupportTicketCreateRequest,
} from '@structure/source/modules/support/contact/hooks/useSupportTicketCreateRequest';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { reactHookFormSchemaAdapter } from '@structure/source/utilities/schema/adapters/ReactHookFormSchemaAdapter';
import { SubmitHandler, useForm, Controller as FieldController, FieldError, Watch } from 'react-hook-form';

// Component - ContactForm
export function ContactForm() {
    // Hooks
    const account = useAccount();
    const urlSearchParameters = useUrlSearchParameters();
    const supportTicketCreateRequest = useSupportTicketCreateRequest();
    const form = useForm<SupportTicketCreateRequestInputType>({
        defaultValues: {
            // Form variables
            emailAddress: '',
            title: '',
            content: '',
            attachmentFiles: [],

            // Static variables with default values
            contentType: 'Markdown',
            type: 'Contact',
        },
        resolver: reactHookFormSchemaAdapter(supportTicketCreateRequestInputSchema),
    });

    // Set subject from URL parameter and email from account if available
    React.useEffect(
        function () {
            // Set email if user is signed in
            if(account.data?.emailAddress) {
                form.setValue('emailAddress', account.data.emailAddress);
            }

            // Set subject from URL param
            const subject = urlSearchParameters.get('subject');
            if(subject) {
                form.setValue('title', subject);
            }

            // Focus on the message field if both email and subject are pre-filled
            if(account.data?.emailAddress && subject) {
                form.setFocus('content');
            }
        },
        [urlSearchParameters, form, account.data],
    );

    // Function to handle form submission
    const onSubmit: SubmitHandler<SupportTicketCreateRequestInputType> = async function (data) {
        try {
            await supportTicketCreateRequest.execute(data);
        }
        catch(error) {
            console.error(error);
        }
    };

    // Render the component
    return (
        <div className="relative mx-auto max-w-2xl">
            {supportTicketCreateRequest.isSuccess ? (
                <Watch
                    control={form.control}
                    names={['title', 'content', 'emailAddress', 'attachmentFiles'] as const}
                    render={function (values) {
                        const [title, content, emailAddress, attachmentFiles] = values as [
                            string,
                            string,
                            string,
                            File[],
                        ];
                        return (
                            <ContactMessagePreview
                                title={title}
                                content={content}
                                emailAddress={emailAddress}
                                attachmentFiles={attachmentFiles}
                            />
                        );
                    }}
                />
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex flex-col items-stretch gap-4">
                    <TextField
                        label="Your Email Address"
                        placeholder="email@domain.com"
                        autoComplete="email"
                        spellCheck={false}
                        error={form.formState.errors.emailAddress?.message}
                        {...form.register('emailAddress')}
                    />
                    <TextField
                        label="Subject"
                        placeholder="Briefly describe your message"
                        type="text"
                        spellCheck={true}
                        error={form.formState.errors.title?.message}
                        {...form.register('title')}
                    />
                    <TextAreaField
                        label="Message"
                        placeholder="Please include any details that will help us assist you"
                        rows={8}
                        error={form.formState.errors.content?.message}
                        spellCheck={true}
                        {...form.register('content')}
                    />
                    <FieldController
                        control={form.control}
                        name="attachmentFiles"
                        render={function (renderProperties) {
                            const { field, fieldState } = renderProperties;
                            const error = fieldState.error;
                            const errorArray = error as unknown as FieldError[] | undefined;

                            const joinedErrors = errorArray
                                ?.map((error, index) =>
                                    error.message && field.value[index]
                                        ? `${field.value[index].name.slice(0, 40)}${
                                              field.value[index].name.length > 40 ? '...' : ''
                                          }: ${error.message}`
                                        : undefined,
                                )
                                .filter(Boolean);
                            return (
                                <FileDropField
                                    label="Attachments"
                                    optional
                                    error={joinedErrors?.join('\n')}
                                    onFilesChange={(newFiles: File[]) => {
                                        field.onChange(newFiles);
                                    }}
                                    accept={[
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                        'application/pdf',
                                        'application/json',
                                    ]}
                                    files={field.value}
                                    multiple
                                />
                            );
                        }}
                    />
                    <Button
                        type="submit"
                        iconRight={
                            supportTicketCreateRequest.isLoading ? <SpinnerIcon className="animate-spin" /> : undefined
                        }
                    >
                        Send{supportTicketCreateRequest.isLoading ? 'ing' : ''} Message
                    </Button>
                </form>
            )}
        </div>
    );
}
