// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - Forms and Validation
import { useForm } from 'react-hook-form';
import {
    object,
    string,
    array,
    instance,
    optional,
    mimeType,
    maxSize,
    minLength,
    pipe,
    InferOutput
  } from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';

// Dependencies - Main Components
import { RichTextEditor } from '@project/source/ui/derived/RichTextEditor';
import AgentToolbarPlugin from '@project/source/ui/derived/RichTextEditor/AgentToolbarPlugin';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketCommentCreateInput,
    RichContentFormat,
    SupportTicketCommentVisibility
} from '@project/source/api/GraphQlGeneratedCode';

const TicketMessageFormSchema = object({
    reply: pipe(string('Reply is required.'), minLength(1, 'Reply cannot be empty.')),
    attachments: optional(array(
        pipe(
            instance(File),
            mimeType(['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/json']),
            maxSize(5 * 1024 * 1024, 'The file cannot be larger than 5MB.')
        )
    )),
});
type TicketMessageFormValues = InferOutput<typeof TicketMessageFormSchema>;

// Component - TicketMessageForm
export interface TicketMessageFormInterface {
    ticketIdentifier: string;
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
    onTicketCommentCreate: (input: SupportTicketCommentCreateInput) => void;
    refetchTickets: () => void;
}
export function TicketMessageForm(properties: TicketMessageFormInterface) {
    // Properties
    const { ticketIdentifier, comments } = properties;

    const formRef = React.useRef<HTMLFormElement>(null);

    const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    // const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
    const [shouldResetEditor, setShouldResetEditor] = React.useState(false);

    const { handleSubmit, setValue, formState: { errors } } = useForm<TicketMessageFormValues>({
        resolver: valibotResolver(TicketMessageFormSchema),
        mode: 'onSubmit',
        defaultValues: {
            reply: '',
        },
    });

    const handleEditorChange = ({ markdown }: { markdown: string }) => {
        setValue('reply', markdown, { shouldValidate: true });
    }

    const handleSaveFiles = (files: File[]) => {
        setAttachedFiles((prev) => {
            const newFiles = files.filter(
                (file) => !prev.some(
                    (existing) => existing.name === file.name && existing.size === file.size
                )
            );
            const updatedFiles = [...prev, ...newFiles];
            setValue('attachments', updatedFiles, { shouldValidate: true });
            return updatedFiles;
        });
    };

    const handleRemoveFile = (index: number) => {
        setAttachedFiles((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            setValue('attachments', updated, { shouldValidate: true });
            return updated;
        });
    };

    const handleSuccess = () => {
        formRef.current?.reset();
        setValue('reply', '');
        setValue('attachments', []);
        setAttachedFiles([]);
        setFormSubmitted(false);
        setIsSubmitting(false);
        setShouldResetEditor(true);
    }


    async function handleSubmitForm(formValues: TicketMessageFormValues) {
        const hasAttachments = attachedFiles.length > 0;

        const input = {
            ticketIdentifier,
            content: formValues.reply,
            contentType: RichContentFormat.Markdown,
            replyToCommentId: comments[0]?.id || '',
            visibility: SupportTicketCommentVisibility.Public,
        };

        try {
            setIsSubmitting(true);
            
            if (hasAttachments) {
                const formData = new FormData();
                formData.append('content', input.content);
                formData.append('contentType', input.contentType);
                formData.append('replyToCommentId', input.replyToCommentId);
                formData.append('visibility', input.visibility);
                attachedFiles.forEach((file) => {
                    // Remove existing extension
                    const filenameNoExt = file.name.replace(/\.[^/.]+$/, '');
                    formData.append(filenameNoExt, file);
                });
    
                const response = await fetch(`https://${ProjectSettings.apis.base.host}/support/${ticketIdentifier}/commentCreatePrivileged`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                })
    
                if (!response.ok) {
                    throw new Error(`Error uploading files: ${response.status} - ${response.statusText}`);
                }

                properties.refetchTickets();
            } else {
                await properties.onTicketCommentCreate(input);
            }

            handleSuccess();
            return { success: true };
        } catch (error) {
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
            ref={formRef}
            onSubmit={handleSubmit((formValues) => {
                setFormSubmitted(true);
                handleSubmitForm(formValues);
            })}
            className="p-10"
        >
            <RichTextEditor
                type="markdown"
                toolbarPlugin={AgentToolbarPlugin}
                onChange={handleEditorChange}
                attachedFiles={attachedFiles}
                onSaveFiles={handleSaveFiles}
                onRemoveFile={handleRemoveFile}
                isDisabled={isSubmitting}
                showLoading={isSubmitting}
                shouldReset={shouldResetEditor}
                onResetComplete={() => setShouldResetEditor(false)}
            />
            {formSubmitted && errors.reply && (
                <p className="text-red-500 text-sm mt-2">{errors.reply.message}</p>
            )}
        </form>
    );
}
