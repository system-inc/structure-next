'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/AccountProvider';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { SupportTicketCreateDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import MailIcon from '@structure/assets/icons/communication/MailIcon.svg';

// Component - ContactPage
export function ContactPage() {
    // State
    const [reportError, setReportError] = React.useState(false);
    const [reportComplete, setReportComplete] = React.useState(false);

    // Hooks
    const { accountState } = useAccount();
    const [supportTicketCreateMutation] = useMutation(SupportTicketCreateDocument);

    // Function to send the message
    async function sendMessage(reason: string, note?: string) {
        // console.log('Reporting', properties.ideaId);
        // await ideaReportCreateMutation({
        //     variables: {
        //         input: {
        //             postId: properties.ideaId,
        //             reason: reason,
        //             note: note,
        //         },
        //     },
        //     onError: function () {
        //         setReportError(true);
        //     },
        //     onCompleted: function () {
        //         setReportComplete(true);
        //     },
        // });
    }

    // Render the component
    return (
        <div className="container pb-32 pt-12">
            <h1 className="mb-6 text-3xl font-medium">Contact {ProjectSettings.title}</h1>

            <p className="">We look forward to hearing from you.</p>

            <Form
                className="mt-10"
                formInputs={[
                    <FormInputText
                        key="emailAddress"
                        id="emailAddress"
                        label="Your Email Address"
                        placeholder="email@domain.com"
                        required={true}
                        defaultValue={accountState.account?.primaryAccountEmail?.emailAddress}
                    />,
                    <FormInputText key="subject" id="subject" label="Subject" placeholder="Subject" required={true} />,
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
                    icon: MailIcon,
                    iconPosition: 'left',
                    iconClassName: 'ml-1 mr-2.5',
                    children: 'Send Message',
                }}
                onSubmit={async function (formValues) {
                    console.log('Reporting!', formValues);
                    // await report(formValues.reason, formValues.report);

                    return {
                        success: true,
                    };
                }}
            />
        </div>
    );
}

// Export - Default
export default ContactPage;
