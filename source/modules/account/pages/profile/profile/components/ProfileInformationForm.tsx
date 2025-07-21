'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';

// Dependencies - API
import { useAccount, accountCacheKey } from '@structure/source/modules/account/providers/AccountProvider';
import { networkService, gql } from '@structure/source/services/network/NetworkService';

// Interface - ProfileFormValues
interface ProfileFormValues {
    givenName?: string;
    familyName?: string;
    displayName?: string;
    phoneNumber?: string;
}

// Component - ProfileInformationForm
export function ProfileInformationForm() {
    // Hooks
    const notice = useNotice();
    const { accountState } = useAccount();
    const accountProfileUpdateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {
                accountProfileUpdate(input: $input) {
                    username
                    displayName
                    givenName
                    familyName
                    images {
                        url
                        variant
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
    );

    // Function to format phone number
    // function formatPhoneNumber(phoneNumber: string | null | undefined): string | undefined {
    //     if(!phoneNumber) return undefined;
    //     let formatted = phoneNumber.startsWith('+') ? phoneNumber : '+1' + phoneNumber;
    //     if(formatted.startsWith('+1') && formatted.length === 12) {
    //         formatted = `+1 (${formatted.substring(2, 5)}) ${formatted.substring(5, 8)}-${formatted.substring(8, 12)}`;
    //     }
    //     return formatted;
    // }

    // Function to handle form submission
    async function handleSubmit(formValues: ProfileFormValues): Promise<FormSubmitResponseInterface> {
        try {
            const result = await accountProfileUpdateRequest.execute({
                input: {
                    givenName: formValues.givenName as string,
                    familyName: formValues.familyName as string,
                    displayName: formValues.displayName as string,
                    // phoneNumber: formatPhoneNumber(formValues.phoneNumber as string),
                },
            });

            if(result?.accountProfileUpdate) {
                notice.addNotice({
                    title: 'Profile Updated',
                    content: 'Your profile information has been updated successfully.',
                });

                // Invalidate account cache to refresh the profile data
                networkService.invalidateCache([accountCacheKey]);
            }

            return {
                success: true,
            };
        }
        catch(error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred while updating your profile.',
            };
        }
    }

    // Render the component
    return (
        <div className="rounded-lg border border-light-6 p-6 dark:border-dark-4">
            <h2 className="text-xl font-medium">Profile Information</h2>

            <Form
                loading={accountState.loading}
                className="mt-6"
                formInputs={[
                    <FormInputText
                        key="givenName"
                        id="givenName"
                        className="flex-grow"
                        label="First Name"
                        labelTip="This is also known as your given name."
                        defaultValue={accountState.account?.profile?.givenName}
                    />,
                    <FormInputText
                        key="familyName"
                        id="familyName"
                        className="flex-grow"
                        label="Last Name"
                        labelTip="This is also known as your family name."
                        defaultValue={accountState.account?.profile?.familyName}
                    />,
                    <FormInputText
                        key="displayName"
                        id="displayName"
                        className="mt-6"
                        label="Display Name"
                        labelTip="Your display name is how you will be identified on our platform."
                        defaultValue={accountState.account?.profile?.displayName}
                    />,
                    // <FormInputText
                    //     key="phoneNumber"
                    //     id="phoneNumber"
                    //     className="mt-6"
                    //     label="Phone Number"
                    //     placeholder="(555) 555-5555"
                    //     defaultValue={accountState.account?.profile?.phoneNumber}
                    // />,
                ]}
                buttonProperties={{
                    children: 'Save Changes',
                    processingText: 'Saving...',
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
