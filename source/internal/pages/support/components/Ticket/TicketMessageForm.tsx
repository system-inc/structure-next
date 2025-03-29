
// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form, FormValuesInterface } from '@structure/source/common/forms/Form';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';

// Dependencies - Hooks
import { useSupportTicketCreateComment } from '../../hooks/useSupportTicketCreateComment';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Component - TicketMessageForm
export interface TicketMessageFormInterface {
    ticketId: string;
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
}
export function TicketMessageForm(properties: TicketMessageFormInterface) {
    // Properties
    const { ticketId, comments } = properties;

    // Hooks
    const {createComment} = useSupportTicketCreateComment();

    async function handleSubmit(formValues: FormValuesInterface) {
        // Submit the form
        await createComment({
            variables: {
                input: {
                    ticketId,
                    content: formValues.reply,
                    replyToCommentId: comments[0]?.id || '',
                },
            },
        });
        return {
            success: true,
        };
    }

    // Render the component
    return (
        <Form
            className="py-5 px-10"
            formInputs={[
                <FormInputTextArea
                    key="reply"
                    id="reply"
                    label="Reply"
                    placeholder="Type your reply..."
                    rows={4}
                    required={true}
                />,
            ]}
            buttonProperties={{
                children: 'Send Reply',
            }}
            resetOnSubmitSuccess={true}
            onSubmit={handleSubmit}
        />
    )
}