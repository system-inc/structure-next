'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { DialogProperties, Dialog } from '@structure/source/common/dialogs/Dialog';
import { Form } from '@structure/source/common/forms/Form';
import { FormInputSelect } from '@structure/source/common/forms/FormInputSelect';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
// import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

// Dependencies - Assets
import FlagIcon from '@structure/assets/icons/interface/FlagIcon.svg';

// Component - PostReportDialog
export interface PostReportDialogProperties extends DialogProperties {
    ideaId: string;
    ideaTitle: string;
}
export function PostReportDialog(properties: PostReportDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);
    const [reportError, setReportError] = React.useState(false);
    const [reportComplete, setReportComplete] = React.useState(false);

    // Hooks
    const postReportCreateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation PostReportCreate($input: PostReportInput!) {
                postReportCreate(input: $input) {
                    id
                }
            }
        `),
    );

    // Effect to update the open state when the open property changes
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        // Optionally call the onOpenChange callback
        properties.onOpenChange?.(open);

        // Update the open state
        setOpen(open);
    }

    // Function to file the report
    async function report(reason: string, note?: string) {
        console.log('Reporting', properties.ideaId);

        try {
            await postReportCreateRequest.execute({
                input: {
                    postId: properties.ideaId,
                    reason: reason,
                    note: note,
                },
            });
            setReportComplete(true);
        } catch {
            setReportError(true);
        }
    }

    // Render the component
    return (
        <Dialog
            header={
                <div className="flex items-center space-x-3">
                    <FlagIcon className="h-5 w-5" />
                    <div>Report &quot;{properties.ideaTitle}&quot;</div>
                </div>
            }
            content={
                <div>
                    {
                        // Error reporting
                        reportError ? (
                            <div className="">
                                <p>An error occurred while reporting this content.</p>
                                <Button
                                    className="float-right mt-6"
                                    onClick={function () {
                                        onOpenChangeIntercept(false);
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        ) : // Report complete
                        reportComplete ? (
                            <div className="">
                                <p>Thank you for report.</p>

                                <div className="text-sm">
                                    <p className="mt-3">What happens next?</p>

                                    <ul className="mt-1 ml-1.5 list-inside list-disc">
                                        <li>This content is now in a queue to be moderated.</li>
                                        <li>A moderator will review your report and a make a decision.</li>
                                        <li>If the content is not appropriate, it will be permanently removed.</li>
                                    </ul>
                                </div>

                                <Button
                                    className="float-right mt-6"
                                    onClick={function () {
                                        onOpenChangeIntercept(false);
                                    }}
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            // Report form
                            <div>
                                <p className="text-sm">
                                    Your report helps us maintain a safe environment for everyone.
                                </p>

                                <Form
                                    formInputs={[
                                        <FormInputSelect
                                            className="mt-4"
                                            key="reason"
                                            id="reason"
                                            label="Main Problem with This Content"
                                            items={[
                                                { value: 'Spam' },
                                                { value: 'Inappropriate Language' },
                                                { value: 'Misleading or Inaccurate Information' },
                                                { value: 'Impersonation' },
                                                { value: 'Copyright or Trademark Violation' },
                                                { value: 'Bullying or Harassment' },
                                                { value: 'Hate Speech or Discrimination' },
                                                { value: 'Threatening Violence' },
                                                { value: 'Pornographic or Sexually Explicit Content' },
                                                { value: 'Non-pornographic Nudity' },
                                                { value: 'Non-consensual Intimate Media' },
                                                { value: 'Minor Abuse or Sexualization' },
                                                { value: 'Graphic Violence' },
                                                { value: 'Self-harm or Suicidal Content' },
                                                { value: 'Illegal Activities' },
                                                { value: 'Sharing Personal Information' },
                                                { value: 'Disturbing' },
                                                { value: 'Other' },
                                            ]}
                                            required={true}
                                        />,
                                        <FormInputTextArea
                                            className="w-full"
                                            key="note"
                                            id="note"
                                            label="Note"
                                            labelTip={
                                                <div className="max-w-64">
                                                    Please provide any additional information that may help us
                                                    understand the issue.
                                                </div>
                                            }
                                            labelTipIconProperties={{
                                                contentClassName: 'z-50',
                                            }}
                                            rows={4}
                                        />,
                                    ]}
                                    buttonProperties={{
                                        className: 'float-right',
                                        children: 'Report',
                                    }}
                                    onSubmit={async function (formValues) {
                                        // console.log('Reporting!');
                                        await report(formValues.reason, formValues.report);

                                        return {
                                            success: true,
                                        };
                                    }}
                                />
                            </div>
                        )
                    }
                </div>
            }
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
