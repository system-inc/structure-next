// Dependencies - React and Next.js
import React from 'react';

// Dependencies - 
import { useForm } from 'react-hook-form';
import { object, string, minLength, pipe, InferOutput } from 'valibot';
import { valibotResolver } from '@hookform/resolvers/valibot';

// Dependencies - Main Components
import { Form, FormValuesInterface } from '@structure/source/common/forms/Form';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
// import { RichTextEditor } from '@project/source/ui/derived/RichTextEditor';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketCommentCreateInput
} from '@project/source/api/GraphQlGeneratedCode';

// Define valibot schema
const TicketMessageFormSchema = object({
    reply: pipe(
        string('Reply is required.'),
        minLength(1, 'Reply cannot be empty.')
    ),
});
type TicketMessageFormValues = InferOutput<typeof TicketMessageFormSchema>;


// Component - ProfileSupportTicketMessageForm
export interface ProfileSupportTicketMessageFormInterface {
    ticketIdentifier: string;
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
    onTicketCommentCreate: (input: SupportTicketCommentCreateInput) => void;
}
export function ProfileSupportTicketMessageForm(properties: ProfileSupportTicketMessageFormInterface) {
    // Properties
    const { ticketIdentifier, comments } = properties;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<TicketMessageFormValues>({
        resolver: valibotResolver(TicketMessageFormSchema),
        mode: 'onSubmit',
        defaultValues: {
            reply: '',
        },
    });


    // async function handleSubmitForm(formValues: TicketMessageFormValues) {
    //     const input = {
    //         ticketId,
    //         content: formValues.reply,
    //         replyToCommentId: comments[0]?.id || '',
    //     };

    //     console.log("SUBMIT FORM", formValues, input);

    //     // await properties.onTicketCommentCreate(input);

    //     // return {
    //     //     success: true,
    //     // }
    // }

    async function handleFormSubmit(formValues: FormValuesInterface) {
        // Submit the form
        const input = {
            ticketIdentifier,
            content: formValues.reply,
            replyToCommentId: comments[0]?.id || '',
        };

        // await createComment({
        //     variables: {
        //         input: {
        //             ticketId,
        //             content: formValues.reply,
        //             replyToCommentId: comments[0]?.id || '',
        //         },
        //     },
        // });

        await properties.onTicketCommentCreate(input);

        return {
            success: true,
        };
    }

    const isEmpty = (empty: boolean) => {
        console.log("IS EMPTY", empty)
    }

    // Render the component
    return (
        // <form onSubmit={handleSubmit(handleSubmitForm)} className="p-10">
        //     <RichTextEditor type="markdown" isEditorEmpty={isEmpty} />
        //     {errors.reply && (
        //         <p className="text-red-500 text-sm mt-2">{errors.reply.message}</p>
        //     )}
        // </form>
        <Form
            className="pt-20"
            formInputs={[
                <FormInputTextArea
                    key="reply"
                    id="reply"
                    placeholder="Type your reply..."
                    rows={4}
                    required={true}
                />,
            ]}
            buttonProperties={{
                children: 'Send Reply',
            }}
            resetOnSubmitSuccess={true}
            onSubmit={handleFormSubmit}
        />
    );
}
