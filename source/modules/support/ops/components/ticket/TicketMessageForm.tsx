// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Forms and Validation
import { useForm } from 'react-hook-form';
import { schema } from '@structure/source/utilities/schema/Schema';
import { reactHookFormSchemaAdapter } from '@structure/source/utilities/schema/adapters/ReactHookFormSchemaAdapter';

// Dependencies - Main Components
import { InputMarkup } from '@structure/source/components/forms-new/fields/markup/InputMarkup';

// Dependencies - API
import {
    SupportTicketCommentCreateInput,
    RichContentFormat,
    SupportTicketCommentVisibility,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { networkService } from '@structure/source/services/network/NetworkService';

const TicketMessageFormSchema = schema.object({
    reply: schema.string().minimumLength(1),
    attachments: schema
        .array(
            schema
                .file()
                .mimeType(['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/json'])
                .maximumSizeInBytes(5 * 1024 * 1024),
        )
        .optional(),
});
type TicketMessageFormValues = typeof TicketMessageFormSchema.infer;

// Component - TicketMessageForm
export interface TicketMessageFormProperties {
    ticketIdentifier: string;
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
    onTicketCommentCreate: (input: SupportTicketCommentCreateInput) => void;
    refetchTickets: () => void;
}
export function TicketMessageForm(properties: TicketMessageFormProperties) {
    const formReference = React.useRef<HTMLFormElement>(null);

    const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    // const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
    const [shouldResetEditor, setShouldResetEditor] = React.useState(false);

    const form = useForm<TicketMessageFormValues>({
        resolver: reactHookFormSchemaAdapter(TicketMessageFormSchema),
        mode: 'onSubmit',
        defaultValues: {
            reply: '',
        },
    });

    const handleEditorChange = function (options: { markdown: string }) {
        form.setValue('reply', options.markdown, { shouldValidate: true });
    };

    const handleSaveFiles = function (files: File[]) {
        setAttachedFiles(function (prev) {
            const newFiles = files.filter(
                (file) => !prev.some((existing) => existing.name === file.name && existing.size === file.size),
            );
            const updatedFiles = [...prev, ...newFiles];
            form.setValue('attachments', updatedFiles, { shouldValidate: true });
            return updatedFiles;
        });
    };

    const handleRemoveFile = function (index: number) {
        setAttachedFiles(function (prev) {
            const updated = prev.filter((_, i) => i !== index);
            form.setValue('attachments', updated, { shouldValidate: true });
            return updated;
        });
    };

    const handleSuccess = function () {
        formReference.current?.reset();
        form.setValue('reply', '');
        form.setValue('attachments', []);
        setAttachedFiles([]);
        setFormSubmitted(false);
        setIsSubmitting(false);
        setShouldResetEditor(true);
    };

    async function handleSubmitForm(formValues: TicketMessageFormValues) {
        const hasAttachments = attachedFiles.length > 0;

        const input = {
            ticketIdentifier: properties.ticketIdentifier,
            content: formValues.reply,
            contentType: RichContentFormat.Markdown,
            replyToCommentId: properties.comments[0]?.id || '',
            visibility: SupportTicketCommentVisibility.Public,
        };

        try {
            setIsSubmitting(true);

            if(hasAttachments) {
                const formData = new FormData();
                formData.append('content', input.content);
                formData.append('contentType', input.contentType);
                formData.append('replyToCommentId', input.replyToCommentId);
                formData.append('visibility', input.visibility);
                attachedFiles.forEach(function (file) {
                    // Remove existing extension
                    const filenameNoExt = file.name.replace(/\.[^/.]+$/, '');
                    formData.append(filenameNoExt, file);
                });

                const response = await networkService.request(
                    `https://${ProjectSettings.apis.base.host}/support/${properties.ticketIdentifier}/commentCreatePrivileged`,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );

                if(!response.ok) {
                    throw new Error(`Error uploading files: ${response.status} - ${response.statusText}`);
                }

                properties.refetchTickets();
            }
            else {
                await properties.onTicketCommentCreate(input);
            }

            handleSuccess();
            return { success: true };
        }
        catch(error) {
            console.log('Error:', error);
            // Display toast error message to user
        } finally {
            setIsSubmitting(false);
            // setUploadProgress(null);
        }
    }

    // Render the component
    return (
        <form
            ref={formReference}
            onSubmit={form.handleSubmit(function (formValues) {
                setFormSubmitted(true);
                handleSubmitForm(formValues);
            })}
            className="flex justify-center px-4 pt-0 pb-4"
        >
            <div className="w-full max-w-[980px]">
                <InputMarkup
                    type="markdown"
                    onChange={handleEditorChange}
                    attachedFiles={attachedFiles}
                    onSaveFiles={handleSaveFiles}
                    onRemoveFile={handleRemoveFile}
                    isDisabled={isSubmitting}
                    showLoading={isSubmitting}
                    // loadingProgress={uploadProgress}
                    shouldReset={shouldResetEditor}
                    onResetComplete={() => setShouldResetEditor(false)}
                    textSize="sm"
                />
                {formSubmitted && form.formState.errors.reply && (
                    <p className="mt-2 text-sm text-red-500">{form.formState.errors.reply.message}</p>
                )}
            </div>
        </form>
    );
}
