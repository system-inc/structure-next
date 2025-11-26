'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useAccountProfileUpdateRequest } from '@structure/source/modules/account/hooks/useAccountProfileUpdateRequest';
import { GraphQLInputTypes } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Main Components
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Notice } from '@structure/source/components/notices/Notice';

// Dependencies - Animation
import { AnimatePresence, motion } from 'motion/react';

// Dependencies - Assets
import { SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { schemaFromGraphQl } from '@structure/source/utilities/schema/utilities/SchemaUtilities';

// Schema - Create from GraphQL metadata for the fields we need
const profileInformationSchema = schemaFromGraphQl(GraphQLInputTypes.AccountProfileUpdateInput, [
    'givenName',
    'familyName',
    'displayName',
]);

// Component - ProfileDetailsForm
export function ProfileDetailsForm() {
    // State
    const [showSuccessNotice, setShowSuccessNotice] = React.useState(false);
    const [showErrorNotice, setShowErrorNotice] = React.useState(false);

    // Hooks
    const account = useAccount();
    const accountProfileUpdateRequest = useAccountProfileUpdateRequest();
    const form = useForm({
        schema: profileInformationSchema,
        onSubmit: async function (formState) {
            // Clear previous notices
            setShowSuccessNotice(false);
            setShowErrorNotice(false);

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
                    setShowSuccessNotice(true);
                }
            }
            catch(error) {
                console.error('Error updating profile:', error);
                setShowErrorNotice(true);
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

            {/* Success/Error Notices */}
            <AnimatePresence>
                {showSuccessNotice && (
                    <motion.div
                        key="success"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.05 }}
                    >
                        <Notice variant="Positive" title="Changes have been saved." />
                    </motion.div>
                )}
                {showErrorNotice && (
                    <motion.div
                        key="error"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.05 }}
                    >
                        <Notice variant="Negative" title="There was an error saving your changes. Please try again." />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="flex justify-end">
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
        </form.Form>
    );
}
