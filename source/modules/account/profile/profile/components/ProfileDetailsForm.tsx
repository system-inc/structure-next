'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useForm } from '@structure/source/components/forms-new/useForm';
import { useFormNotice } from '@structure/source/components/forms-new/hooks/useFormNotice';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useAccountProfileUpdateRequest } from '@structure/source/modules/account/hooks/useAccountProfileUpdateRequest';
import { AccountProfileUpdateInputMetadata } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Main Components
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { schemaFromGraphQl } from '@structure/source/utilities/schema/utilities/SchemaUtilities';

// Schema - Create from GraphQL metadata for the fields we need
const profileInformationSchema = schemaFromGraphQl(AccountProfileUpdateInputMetadata, [
    'givenName',
    'familyName',
    'displayName',
]);

// Component - ProfileDetailsForm
export function ProfileDetailsForm() {
    // Hooks
    const account = useAccount();
    const accountProfileUpdateRequest = useAccountProfileUpdateRequest();
    const formNotice = useFormNotice({
        // autoDismissInMilliseconds: 500,
    });
    const form = useForm({
        schema: profileInformationSchema,
        onSubmit: async function (formState) {
            try {
                // Execute the account profile update request
                const result = await accountProfileUpdateRequest.execute({
                    input: {
                        givenName: formState.value.givenName as string,
                        familyName: formState.value.familyName as string,
                        displayName: formState.value.displayName as string,
                    },
                });

                // If successful, update account data and show success notice
                if(result?.accountProfileUpdate) {
                    // Update account atom with fresh profile data
                    account.setData({ profile: result.accountProfileUpdate });

                    // Show inline success notice
                    formNotice.showSuccess('Changes have been saved.');
                }
            }
            catch(error) {
                console.error('Error updating profile:', error);
                formNotice.showError('There was an error saving your changes. Please try again.');
            }
        },
    });

    // Effect to set account data on the form when it loads or changes
    React.useEffect(
        function () {
            if(account.data?.profile) {
                form.setFieldValue('givenName', account.data.profile.givenName ?? '');
                form.setFieldValue('familyName', account.data.profile.familyName ?? '');
                form.setFieldValue('displayName', account.data.profile.displayName ?? '');
            }
        },
        [account.data?.profile, form],
    );

    // Render the component
    return (
        <form.Form className="flex flex-col gap-4">
            {/* Field - First Name */}
            <form.Field identifier="givenName">
                <form.FieldLabel tip="This is also known as your given name.">First Name</form.FieldLabel>
                <FieldInputText variant="Outline" placeholder="Ada" />
            </form.Field>

            {/* Field - Last Name */}
            <form.Field identifier="familyName">
                <form.FieldLabel tip="This is also known as your family name.">Last Name</form.FieldLabel>
                <FieldInputText variant="Outline" placeholder="Lovelace" />
            </form.Field>

            {/* Field - Display Name */}
            <form.Field identifier="displayName">
                <form.FieldLabel tip="Your display name is how you will be identified on our platform.">
                    Display Name
                </form.FieldLabel>
                <FieldInputText variant="Outline" placeholder="Ada Lovelace" />
            </form.Field>

            {/* FormNotice in a div with the button to prevent gap-4 messing with the exit animation */}
            <div className="flex flex-col">
                <formNotice.FormNotice className="mb-5.5" />

                <div className="flex justify-end">
                    {/* Save button */}
                    <AnimatedButton
                        variant="A"
                        type="submit"
                        isProcessing={accountProfileUpdateRequest.isLoading}
                        processingIcon={SpinnerIcon}
                        animateIconPosition="iconRight"
                    >
                        Save
                    </AnimatedButton>
                </div>
            </div>
        </form.Form>
    );
}
