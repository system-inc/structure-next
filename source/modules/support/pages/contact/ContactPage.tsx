'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { SupportTicketCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import SendIcon from '@structure/assets/icons/communication/SendIcon.svg';
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ContactPage
export interface ContactPageProperties {
    className?: string;
}
export function ContactPage(properties: ContactPageProperties) {
    // Hooks
    const { accountState } = useAccount();
    const [supportTicketCreateMutation, supportTicketCreateMutationState] = useMutation(SupportTicketCreateDocument);

    // Function to send the message
    async function sendMessage(emailAddress: string, subject: string, message: string) {
        // console.log('Sending', emailAddress, subject, message);

        // Invoke the mutation
        await supportTicketCreateMutation({
            variables: {
                input: {
                    type: 'Contact',
                    emailAddress: emailAddress,
                    title: subject,
                    initialComment: {
                        ticketIdentifier: '<ignored-id>',
                        replyToCommentId: '<ignored-id>',
                        content: message,
                    },
                },
            },
        });
    }

    // Render the component
    return (
        <div className={mergeClassNames('container pt-12', properties.className)}>
            <h1>Contact {ProjectSettings.title}</h1>
            <p className="mt-4 text-sm text-foreground-secondary">We look forward to hearing from you.</p>

            <hr className="my-6" />

            <div className="mx-auto max-w-screen-md">
                {/* Message Not Sent */}
                {!supportTicketCreateMutationState.data && (
                    <div>
                        <Form
                            className="mt-10"
                            formInputs={[
                                <FormInputText
                                    key="emailAddress"
                                    id="emailAddress"
                                    label="Your Email Address"
                                    placeholder="email@domain.com"
                                    required={true}
                                    defaultValue={accountState.account?.emailAddress}
                                />,
                                <FormInputText
                                    key="subject"
                                    id="subject"
                                    label="Subject"
                                    placeholder="Subject"
                                    required={true}
                                />,
                                <FormInputTextArea
                                    key="message"
                                    id="message"
                                    label="Message"
                                    placeholder="Message"
                                    rows={8}
                                    required={true}
                                />,
                            ]}
                            buttonProperties={{
                                processing: supportTicketCreateMutationState.loading,
                                icon: supportTicketCreateMutationState.loading ? undefined : SendIcon,
                                iconPosition: supportTicketCreateMutationState.loading ? undefined : 'left',
                                iconClassName: supportTicketCreateMutationState.loading ? undefined : 'ml-1 mr-2.5',
                                children: 'Send Message',
                            }}
                            onSubmit={async function (formValues) {
                                // console.log('onSubmit', formValues);

                                await sendMessage(formValues.emailAddress, formValues.subject, formValues.message);

                                if(supportTicketCreateMutationState.error) {
                                    return {
                                        success: false,
                                        message:
                                            'An error occurred while sending the message: ' +
                                            supportTicketCreateMutationState.error.message,
                                    };
                                }
                                else {
                                    return {
                                        success: true,
                                    };
                                }
                            }}
                        />
                    </div>
                )}

                {/* Message Sent */}
                {supportTicketCreateMutationState.data && (
                    <div className="mt-10">
                        <div className="flex space-x-2">
                            <CheckCircledIcon className="h-6 w-6" />
                            <p>Thanks! Your message has been received. We will get back to you as soon as possible.</p>
                        </div>

                        <h3 className="mt-8 text-lg font-medium">Message Details</h3>
                        <div className="mt-3 rounded-lg border border-light-3 bg-light-1/50 p-4 text-sm dark:border-dark-3 dark:bg-dark-2/50">
                            <p className="neutral mb-2 text-xs uppercase">Email Address</p>
                            <p>{supportTicketCreateMutationState.data.supportTicketCreate.userEmailAddress}</p>
                            <p className="neutral mb-2 mt-6 text-xs uppercase">Subject</p>
                            <p>{supportTicketCreateMutationState.data.supportTicketCreate.title}</p>
                            {supportTicketCreateMutationState.data.supportTicketCreate.comments[0]?.content && (
                                <>
                                    <p className="neutral mb-2 mt-6 text-xs uppercase">Message</p>
                                    <p className="whitespace-pre-wrap">
                                        {supportTicketCreateMutationState.data.supportTicketCreate.comments[0].content}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
