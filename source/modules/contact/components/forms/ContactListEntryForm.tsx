'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { BaseError } from '@structure/source/api/errors/BaseError';
import {
    contactListEntryCreateRequestInputSchema,
    useContactListEntryCreateRequest,
} from '@structure/source/modules/contact/hooks/useContactListEntryCreateRequest';

// Dependencies - Main Components
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Animation
import { motion, AnimatePresence, MotionConfig as MotionConfiguration } from 'motion/react';

// Dependencies - Assets
import { ArrowRightIcon, SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - ContactListEntryForm
export interface ContactListEntryFormProperties extends React.HTMLAttributes<HTMLFormElement> {
    label?: React.ReactNode;
    contactListIdentifier: string;
    initialEmailAddress?: string;
}
export function ContactListEntryForm({
    label,
    contactListIdentifier,
    initialEmailAddress,
    ...formProperties
}: ContactListEntryFormProperties) {
    // State
    const [isFocused, setIsFocused] = React.useState(false);
    const [submittedEmailAddress, setSubmittedEmailAddress] = React.useState<string | null>(null);
    const [isExistingEmail, setIsExistingEmail] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    // Hooks
    const contactListEntryCreateRequest = useContactListEntryCreateRequest();
    const form = useForm({
        schema: contactListEntryCreateRequestInputSchema,
        defaultValues: {
            emailAddress: initialEmailAddress || '',
        },
        onSubmit: async function (formState) {
            const emailAddress = formState.value.emailAddress;
            try {
                await contactListEntryCreateRequest.execute({
                    data: {
                        contactListIdentifier: contactListIdentifier,
                        emailAddress: emailAddress,
                    },
                });
                // Success - new signup
                form.reset();
                setSubmittedEmailAddress(emailAddress);
                setIsExistingEmail(false);
                setShowError(false);
            }
            catch(error: unknown) {
                if(BaseError.isAlreadyExistsError(error)) {
                    // Success - already signed up
                    form.reset();
                    setSubmittedEmailAddress(emailAddress);
                    setIsExistingEmail(true);
                    setShowError(false);
                }
                else {
                    // Real error
                    console.error('Email submission error:', error);
                    setShowError(true);
                }
            }
        },
    });

    // Subscribe to emailAddress field errors
    const emailAddressErrorsStore = form.useStore(function (state) {
        return state.fieldMeta.emailAddress?.errors || [];
    });

    // Show error only when focused and errors exist
    const errorMessage =
        isFocused && emailAddressErrorsStore.length > 0
            ? emailAddressErrorsStore[0]?.message ||
              contactListEntryCreateRequest.error?.message ||
              (showError ? 'An error occurred.' : undefined)
            : undefined;

    // Shared animation variants for all messages
    const messageAnimationVariants = {
        initial: {
            opacity: 0,
            y: -10,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: 10,
        },
    };

    // Render the component
    return (
        <form.Form className={mergeClassNames('', formProperties.className)} noValidate={true} {...formProperties}>
            <form.Field
                identifier="emailAddress"
                showMessage={false} // We'll handle field messages manually
            >
                {label && <form.FieldLabel>{label}</form.FieldLabel>}
                <div className="flex items-center gap-2">
                    <FieldInputText
                        size="Large"
                        type="email"
                        disabled={contactListEntryCreateRequest.isLoading}
                        onFocus={function () {
                            setIsFocused(true);
                            // Clear success/error messages when refocusing
                            if(submittedEmailAddress || showError) {
                                setSubmittedEmailAddress(null);
                                setShowError(false);
                            }
                        }}
                        onBlur={function () {
                            setIsFocused(false);
                        }}
                    />
                    <AnimatedButton
                        type="submit"
                        variant="Contrast"
                        className="aspect-square h-10 w-10 rounded-full p-2"
                        icon={ArrowRightIcon}
                        processingIcon={SpinnerIcon}
                        isProcessing={contactListEntryCreateRequest.isLoading}
                    />
                </div>
                <div className="relative h-0 overflow-visible text-xs">
                    <MotionConfiguration
                        transition={{
                            type: 'spring',
                            duration: 0.5,
                            bounce: 0.05,
                        }}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            {/* Success message - new signup */}
                            {submittedEmailAddress && !isExistingEmail ? (
                                <motion.p key="success-new" className="content--positive" {...messageAnimationVariants}>
                                    Added {submittedEmailAddress}!
                                </motion.p>
                            ) : /* Success message - already signed up */ submittedEmailAddress && isExistingEmail ? (
                                <motion.p
                                    key="success-existing"
                                    className="content--positive"
                                    {...messageAnimationVariants}
                                >
                                    {submittedEmailAddress} already subscribed!
                                </motion.p>
                            ) : /* Validation or API error */ errorMessage ? (
                                <motion.p key="error" className="content--negative" {...messageAnimationVariants}>
                                    {errorMessage}
                                </motion.p>
                            ) : /* Helper message (when focused or has value) */ isFocused ? (
                                <motion.p key="respect" className="content--3" {...messageAnimationVariants}>
                                    We&apos;ll respect your inbox and only send meaningful updates.
                                </motion.p>
                            ) : null}
                        </AnimatePresence>
                    </MotionConfiguration>
                </div>
            </form.Field>
        </form.Form>
    );
}
