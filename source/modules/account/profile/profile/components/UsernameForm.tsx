'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Notice } from '@structure/source/components/notices/Notice';

// Dependencies - Forms
import { useForm } from '@structure/source/components/forms-new/useForm';
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useAccountProfileUpdateRequest } from '@structure/source/modules/account/hooks/useAccountProfileUpdateRequest';

// Dependencies - API
import { AccountProfileUsernameValidateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Component - UsernameForm
export function UsernameForm() {
    // State
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [usernameUpdateSuccess, setUsernameUpdateSuccess] = React.useState(false);

    // Hooks
    const account = useAccount();
    const accountProfileUpdateRequest = useAccountProfileUpdateRequest();

    // The current username from the server (used for validation skip logic and UI)
    const serverUsername = account.data?.profile?.username ?? '';

    // Create schema - recreates when serverUsername changes to update the skip function
    const usernameSchema = React.useMemo(
        function () {
            return schema.object({
                username: schema
                    .string()
                    .username(serverUsername)
                    .graphQlValidate(
                        AccountProfileUsernameValidateDocument,
                        function (value) {
                            return { username: value };
                        },
                        function (value) {
                            // Skip GraphQL validation if typing your own current username
                            return value === serverUsername;
                        },
                    ),
            });
        },
        [serverUsername],
    );

    // Initialize form with schema and server data as default values
    // useForm automatically syncs defaultValues when they change (reactive defaultValues)
    // This means when account.data loads or updates, the form resets automatically
    const form = useForm({
        schema: usernameSchema,
        defaultValues: {
            username: serverUsername,
        },
        onSubmit: async function () {
            // Open dialog instead of executing mutation directly
            setIsDialogOpen(true);
        },
    });

    // Subscribe to form value for button disable logic
    const currentFormUsername = form.useStore(function (state) {
        return state.values.username;
    });

    // Subscribe to validation state for processing indicator
    const isValidating = form.useStore(function (state) {
        return state.isValidating;
    });

    // Function to handle confirmation
    async function handleConfirm() {
        try {
            const result = await accountProfileUpdateRequest.execute({
                input: {
                    username: currentFormUsername,
                },
            });

            if(result?.accountProfileUpdate) {
                setUsernameUpdateSuccess(true);

                // Update account atom with fresh profile data
                // This will trigger useForm's reactive defaultValues sync automatically
                account.setData({ profile: result.accountProfileUpdate });
            }
        } catch {
            // Error is handled by the mutation's error state
        }
    }

    // Function to handle dialog close
    function handleDialogClose() {
        setIsDialogOpen(false);

        // Reset username update success state
        if(usernameUpdateSuccess) {
            setUsernameUpdateSuccess(false);
        }
    }

    // Render the component
    return (
        <>
            <form.Form className="flex flex-col gap-4">
                {/* Field - Username */}
                <form.Field
                    identifier="username"
                    validateSchema="onChange"
                    messageProperties={{ showSuccesses: 'WhenChanged' }}
                >
                    <form.FieldLabel>Username</form.FieldLabel>
                    <FieldInputText variant="Outline" commit="onChange" placeholder="adalovelace" />
                </form.Field>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <AnimatedButton
                        variant="A"
                        type="submit"
                        disabled={serverUsername === currentFormUsername}
                        isProcessing={isValidating}
                        processingIcon={SpinnerIcon}
                    >
                        Change Username
                    </AnimatedButton>
                </div>
            </form.Form>

            {/* Confirmation Dialog */}
            <Dialog
                variant="A"
                accessibilityTitle={usernameUpdateSuccess ? 'Username Updated' : 'Confirm Username Change'}
                accessibilityDescription="Update profile username"
                header={usernameUpdateSuccess ? 'Username Updated' : 'Confirm Username Change'}
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
            >
                <Dialog.Body>
                    {usernameUpdateSuccess ? (
                        <p className="">
                            Your username has been successfully changed to <i>&quot;{serverUsername}&quot;</i>.
                        </p>
                    ) : (
                        <>
                            <p className="">
                                Are you sure you want to change your username from <i>&quot;{serverUsername}&quot;</i>{' '}
                                to <i>&quot;{currentFormUsername}&quot;</i>?
                            </p>
                            {accountProfileUpdateRequest.error && (
                                <Notice
                                    className="mt-4"
                                    variant="Negative"
                                    title={accountProfileUpdateRequest.error.message}
                                />
                            )}
                        </>
                    )}
                </Dialog.Body>
                <Dialog.Footer>
                    {usernameUpdateSuccess ? (
                        <Button variant="A" onClick={handleDialogClose}>
                            Close
                        </Button>
                    ) : (
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button variant="Outline" onClick={handleDialogClose}>
                                Cancel
                            </Button>
                            <AnimatedButton
                                variant="A"
                                onClick={handleConfirm}
                                isProcessing={accountProfileUpdateRequest.isLoading}
                                processingIcon={SpinnerIcon}
                                animateIconPosition="iconRight"
                            >
                                Change Username
                            </AnimatedButton>
                        </div>
                    )}
                </Dialog.Footer>
            </Dialog>
        </>
    );
}
