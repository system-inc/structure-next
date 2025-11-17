'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Form, FormSubmitResponseInterface } from '@structure/source/components/forms/Form';
import { FormInputText } from '@structure/source/components/forms/FormInputText';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Notice } from '@structure/source/components/notices/Notice';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useAccountProfileUpdateRequest } from '@structure/source/modules/account/hooks/useAccountProfileUpdateRequest';

// Dependencies - API
import { AccountProfileUsernameValidateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';

// Dependencies - Animations
// import { PlaceholderAnimation } from '@structure/source/components/animations/PlaceholderAnimation';

// Component - UsernameForm
export function UsernameForm() {
    // Hooks - API
    const account = useAccount();
    const accountProfileUpdateRequest = useAccountProfileUpdateRequest();

    // State
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [activeUsername, setActiveUsername] = React.useState(account.data?.profile?.username || '');
    const [newUsername, setNewUsername] = React.useState(activeUsername);
    const [usernameUpdateSuccess, setUsernameUpdateSuccess] = React.useState(false);

    // Effect to sync activeUsername with account state on initial load
    React.useEffect(
        function () {
            const currentUsername = account.data?.profile?.username;
            if(currentUsername) {
                setActiveUsername(currentUsername);
                setNewUsername(currentUsername);
            }
        },
        [account.data?.profile?.username],
    );

    // Function to handle form submission
    async function handleSubmit(): Promise<FormSubmitResponseInterface> {
        setIsDialogOpen(true);
        return { success: true };
    }

    // Function to handle confirmation
    async function handleConfirm() {
        try {
            const result = await accountProfileUpdateRequest.execute({
                input: {
                    username: newUsername,
                },
            });

            if(result?.accountProfileUpdate) {
                setActiveUsername(newUsername); // Update activeUsername
                setNewUsername(newUsername); // Synchronize newUsername with activeUsername
                setUsernameUpdateSuccess(true);

                // Update account atom with fresh profile data
                account.setData({ profile: result.accountProfileUpdate });
            }
        } catch {
            // Error is handled by the mutation's error state
        }
    }

    // Function to handle dialog close
    function handleDialogClose() {
        setIsDialogOpen(false);

        // If username update was successful
        if(usernameUpdateSuccess) {
            // Set the new username as the active username
            setActiveUsername(newUsername);

            // Synchronize newUsername with activeUsername
            setNewUsername(newUsername);

            // Reset username update success state
            setUsernameUpdateSuccess(false);
        }
    }

    // Render the component
    return (
        <div className="rounded-lg border border--3 p-6">
            <h2 className="text-xl font-medium">Change Username</h2>

            <Form
                loading={!account.data && account.isLoading}
                className="mt-6"
                formInputs={[
                    <FormInputText
                        key="username"
                        id="username"
                        label="Username"
                        defaultValue={newUsername}
                        validateOnChange={true}
                        validateOnBlur={true}
                        validationSchema={new ValidationSchema().username(activeUsername).graphQlQuery(
                            AccountProfileUsernameValidateDocument,
                            function (value) {
                                return {
                                    username: value,
                                };
                            },
                            function (value) {
                                return value === activeUsername; // Compare with activeUsername
                            },
                        )}
                        showValidationSuccessResults={true}
                        onChange={function (value) {
                            // Reset username update success state
                            setUsernameUpdateSuccess(false);

                            if(value) {
                                setNewUsername(value);
                            }
                        }}
                    />,
                ]}
                buttonProperties={{
                    children: 'Change Username',
                    disabled: activeUsername === newUsername, // Use activeUsername to determine disabled state
                }}
                onSubmit={handleSubmit}
            />

            {/* Confirmation Dialog */}
            <Dialog variant="A" open={isDialogOpen} onOpenChange={handleDialogClose}>
                <Dialog.Header>{usernameUpdateSuccess ? 'Username Updated' : 'Confirm Username Change'}</Dialog.Header>
                <Dialog.Content accessibilityDescription="Update profile username">
                    {usernameUpdateSuccess ? (
                        <p className="">Your username has been successfully changed.</p>
                    ) : (
                        <>
                            <p className="">
                                Are you sure you want to change your username from <b>&quot;{activeUsername}&quot;</b>{' '}
                                to
                                <b>&quot;{newUsername}&quot;</b>?
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
                </Dialog.Content>
                <Dialog.Footer>
                    {usernameUpdateSuccess ? (
                        <Button onClick={handleDialogClose}>Close</Button>
                    ) : (
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <AnimatedButton
                                variant="A"
                                onClick={handleConfirm}
                                isProcessing={accountProfileUpdateRequest.isLoading}
                            >
                                Confirm
                            </AnimatedButton>
                        </div>
                    )}
                </Dialog.Footer>
            </Dialog>
        </div>
    );
}
