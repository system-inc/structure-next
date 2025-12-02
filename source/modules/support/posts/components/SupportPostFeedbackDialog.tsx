'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useUrlPath } from '@structure/source/router/Navigation';
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useForm } from '@structure/source/components/forms-new/useForm';
import { useSupportTicketCreateRequest } from '@structure/source/modules/support/contact/hooks/useSupportTicketCreateRequest';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';
import { FieldInputTextArea } from '@structure/source/components/forms-new/fields/text-area/FieldInputTextArea';
import { FieldInputSelect } from '@structure/source/components/forms-new/fields/select/FieldInputSelect';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';

// Dependencies - Assets
import { PaperPlaneRightIcon, SpinnerIcon, CheckCircleIcon } from '@phosphor-icons/react';

// Category options for the feedback dropdown
const categoryOptions = [
    { value: 'missingInformation', label: 'Missing information' },
    { value: 'incorrect', label: 'Incorrect or misleading content' },
    { value: 'outdated', label: 'Outdated content' },
    { value: 'unclear', label: 'Unclear or confusing content' },
    { value: 'error', label: 'Technical error or issue' },
    { value: 'spam', label: 'Spam, irrelevant, or inappropriate content' },
    { value: 'other', label: 'Other' },
];

// Category labels lookup for composing the subject
const categoryLabels: Record<string, string> = Object.fromEntries(
    categoryOptions.map(function (option) {
        return [option.value, option.label];
    }),
);

// Schema for the feedback form
const supportFeedbackFormSchema = schema.object({
    emailAddress: schema.string().emailAddress(),
    category: schema.string(),
    feedback: schema.string(),
});

// Component - SupportPostFeedbackDialog
export interface SupportPostFeedbackDialogProperties
    extends Omit<DialogProperties, 'accessibilityTitle' | 'accessibilityDescription'> {
    selectedEmoji?: string;
}
export function SupportPostFeedbackDialog(properties: SupportPostFeedbackDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const account = useAccount();
    const urlPath = useUrlPath();
    const supportTicketCreateRequest = useSupportTicketCreateRequest();

    // Form hook
    const form = useForm({
        schema: supportFeedbackFormSchema,
        onSubmit: async function (formState) {
            const category = formState.value.category;
            const categoryLabel = categoryLabels[category] || category;

            // Compose subject from category + URL
            const subject = `Support Feedback: ${categoryLabel} - ${urlPath}`;

            // Compose content with context
            const content = [
                `**Page URL:** ${urlPath}`,
                properties.selectedEmoji ? `**Initial Reaction:** ${properties.selectedEmoji}` : null,
                `**Category:** ${categoryLabel}`,
                '',
                '**Feedback:**',
                formState.value.feedback,
            ]
                .filter(Boolean)
                .join('\n');

            await supportTicketCreateRequest.execute({
                title: subject,
                emailAddress: formState.value.emailAddress,
                content: content,
                type: 'Contact',
                contentType: 'Markdown',
                description: undefined,
                attachmentFiles: undefined,
            });
        },
    });

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        // Optionally call the onOpenChange callback
        properties.onOpenChange?.(open);

        // Update the open state
        setOpen(open);
    }

    // Function to close the dialog
    function closeDialog() {
        onOpenChangeIntercept(false);
    }

    // Effect to update the open state when the open property changes
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Effect to set the email address automatically when account data is available
    React.useEffect(
        function () {
            if(account.data?.emailAddress) {
                form.setFieldValue('emailAddress', account.data.emailAddress);
            }
        },
        [account.data?.emailAddress, form],
    );

    // Render the component
    return (
        <Dialog
            variant="A"
            {...properties}
            accessibilityTitle="Help Us Improve"
            accessibilityDescription="Submit feedback with email, issue type, and details"
            open={open}
            onOpenChange={onOpenChangeIntercept}
            header="Help Us Improve"
        >
            <form.Form className="flex flex-col">
                <Dialog.Body>
                    {supportTicketCreateRequest.isSuccess ? (
                        // Success state
                        <div className="flex flex-col items-center py-8 text-center">
                            <CheckCircleIcon className="mb-4 h-12 w-12 content--positive" weight="fill" />
                            <p className="text-lg font-medium">Thank you for your feedback!</p>
                            <p className="mt-2 text-sm content--3">
                                We appreciate you taking the time to help us improve. Your feedback has been submitted
                                and we&apos;ll review it carefully.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm">
                                Thank you for your feedback. We would love to hear more about your experience.
                            </p>

                            <form.Field identifier="emailAddress">
                                <form.FieldLabel>Email Address</form.FieldLabel>
                                <FieldInputText variant="Outline" type="email" placeholder="your@email.com" />
                            </form.Field>

                            <form.Field identifier="category">
                                <form.FieldLabel>What went wrong?</form.FieldLabel>
                                <FieldInputSelect
                                    placeholder="Select a category"
                                    items={categoryOptions.map(function (option) {
                                        return {
                                            value: option.value,
                                            children: option.label,
                                        };
                                    })}
                                />
                            </form.Field>

                            {/* Feedback Text */}
                            <form.Field identifier="feedback">
                                <form.FieldLabel>How can we do better?</form.FieldLabel>
                                <FieldInputTextArea
                                    variant="Outline"
                                    rows={5}
                                    placeholder="Please share your thoughts..."
                                />
                            </form.Field>
                        </div>
                    )}
                </Dialog.Body>

                <Dialog.Footer>
                    {supportTicketCreateRequest.isSuccess && (
                        <Button variant="A" onClick={closeDialog}>
                            Close
                        </Button>
                    )}
                    {/* Submit Button - inside form to enable form submission */}
                    <AnimatedButton
                        variant="A"
                        type="submit"
                        iconRight={PaperPlaneRightIcon}
                        isProcessing={supportTicketCreateRequest.isLoading}
                        processingIcon={SpinnerIcon}
                        animateIconPosition="iconRight"
                    >
                        Submit Feedback
                    </AnimatedButton>
                </Dialog.Footer>
            </form.Form>
        </Dialog>
    );
}
