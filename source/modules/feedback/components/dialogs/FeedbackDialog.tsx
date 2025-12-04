'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { RichContentFormat } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Hooks
import { useUrlPath } from '@structure/source/router/Navigation';
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useForm } from '@structure/source/components/forms-new/useForm';
import { useFeedbackCreateRequest } from '@structure/source/modules/feedback/hooks/useFeedbackCreateRequest';

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
const feedbackFormSchema = schema.object({
    emailAddress: schema.string().emailAddress().optional(),
    category: schema.string(),
    feedback: schema.string(),
});

// Component - FeedbackDialog
export interface FeedbackDialogProperties
    extends Omit<DialogProperties, 'accessibilityTitle' | 'accessibilityDescription'> {
    identifier?: string; // Optional identifier override (defaults to URL path)
    selectedEmoji?: string;
}
export function FeedbackDialog(properties: FeedbackDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Hooks
    const account = useAccount();
    const urlPath = useUrlPath();
    const feedbackCreateRequest = useFeedbackCreateRequest();

    // Form hook
    const form = useForm({
        schema: feedbackFormSchema,
        onSubmit: async function (formState) {
            const category = formState.value.category;
            const categoryLabel = categoryLabels[category] || category;

            // Use provided identifier or default to URL path
            const identifier = properties.identifier || urlPath;

            // Compose subject from category + identifier
            const subject = `Feedback: ${categoryLabel} - ${identifier}`;

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

            await feedbackCreateRequest.execute({
                input: {
                    identifier: identifier,
                    subject: subject,
                    reaction: properties.selectedEmoji || 'none',
                    content: content,
                    contentType: RichContentFormat.Markdown,
                    emailAddress: formState.value.emailAddress || undefined,
                },
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
            accessibilityDescription="Submit feedback with email, issue type, and details."
            open={open}
            onOpenChange={onOpenChangeIntercept}
            header="Help Us Improve"
        >
            <form.Form className="flex flex-col">
                <Dialog.Body>
                    {feedbackCreateRequest.data ? (
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
                                    variant="Outline"
                                    className="rounded-lg text-sm"
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
                    {feedbackCreateRequest.data && (
                        <Button variant="A" onClick={closeDialog}>
                            Close
                        </Button>
                    )}
                    {/* Submit Button - inside form to enable form submission */}
                    {!feedbackCreateRequest.data && (
                        <AnimatedButton
                            variant="A"
                            type="submit"
                            iconRight={PaperPlaneRightIcon}
                            isProcessing={feedbackCreateRequest.isLoading}
                            processingIcon={SpinnerIcon}
                            animateIconPosition="iconRight"
                        >
                            Submit Feedback
                        </AnimatedButton>
                    )}
                </Dialog.Footer>
            </form.Form>
        </Dialog>
    );
}
