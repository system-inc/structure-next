'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import { Button } from '@structure/source/components/buttons/Button';
import { FormInputSelect } from '@structure/source/components/forms/FormInputSelect';
import { FormInputTextArea } from '@structure/source/components/forms/FormInputTextArea';
import { FormInputText } from '@structure/source/components/forms/FormInputText';

// Dependencies - API
// import { useApolloClient } from '@apollo/client';
// import // PrincipleMagicDiceDocument,
// // PrincipleMagicDiceQuery,
// // SupportFeedbackCreateDocument,
// '@project/app/_api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
// import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Component - SupportPostFeedbackDialog
export type SupportPostFeedbackDialogProperties = DialogProperties;
export function SupportPostFeedbackDialog(properties: SupportPostFeedbackDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const account = useAccount();
    // const urlPath = useUrlPath();
    // const apolloClient = useApolloClient();
    // const [principleReviewCreateMutation] = useMutation(SupportFeedbackCreateDocument);

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

    // Function to mark a principle as reviewed
    // async function markPrincipleAsReviewed() {
    //     console.log('Marking principle as reviewed');

    //     setMarkingPrincipleAsReviewed(true);

    //     if(randomPrinciple) {
    //         await principleReviewCreateMutation({
    //             variables: {
    //                 id: randomPrinciple.id,
    //             },
    //         });

    //         setMarkPrincipleAsReviewedButtonText('Redirecting...');

    //         // Redirect to the principle
    //         console.log('randomPrincipleUrlPath', randomPrincipleUrlPath);
    //         router.push(randomPrincipleUrlPath);
    //     }

    //     setMarkingPrincipleAsReviewed(false);
    // }

    // Render the component
    return (
        <Dialog
            header="Help Us Improve"
            content={
                <div className="">
                    {/* <div>Current URL: {urlPath}</div> */}
                    <p className="mb-5 text-sm">
                        Thank you for your feedback. We would love to hear more about your experience.
                    </p>

                    {/* Would they like a followup to their email */}
                    <FormInputText
                        id="email"
                        label="May we follow up over email? (optional)"
                        // labelTip={
                        //     <div className="max-w-64">Your feedback is anonymous unless you provide your email.</div>
                        // }
                        type="email"
                        placeholder="Email Address"
                        defaultValue={account?.data?.emailAddress}
                    />

                    {/* Quick feedback selection */}
                    <FormInputSelect
                        className="mt-5"
                        id="rating"
                        label="What went wrong?"
                        items={[
                            { value: 'missingInformation', children: 'Missing information' },
                            { value: 'incorrect', children: 'Incorrect or misleading content' },
                            { value: 'outdated', children: 'Outdated content' },
                            { value: 'unclear', children: 'Unclear or confusing content' },
                            { value: 'error', children: 'Technical error or issue' },
                            { value: 'spam', children: 'Spam, irrelevant, or inappropriate content' },
                            { value: 'other', children: 'Other' },
                        ]}
                    />

                    {/* Additional details */}
                    <FormInputTextArea
                        className="mt-5"
                        id="feedback"
                        label="How can we do better?"
                        rows={5}
                        required={true}
                    />
                </div>
            }
            footer={
                <Button
                // isLoading={chatConversationUpdateMutationState.loading}
                // onClick={function () {
                //     renameConversation();
                // }}
                >
                    Submit Feedback
                </Button>
            }
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
