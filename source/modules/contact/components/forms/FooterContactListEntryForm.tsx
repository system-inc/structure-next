'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import {
    contactListEntryCreateRequestInputSchema,
    useContactListEntryCreateRequest,
} from '../../hooks/useContactListEntryCreateRequest';

// Dependencies - Main Components
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';

// Dependencies - Animation
import { motion, AnimatePresence, MotionConfig as MotionConfiguration } from 'motion/react';

// Dependencies - Assets
import { ArrowRightIcon, SpinnerIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - FooterContactListEntryForm
export interface FooterContactListEntryFormProperties extends React.HTMLAttributes<HTMLFormElement> {
    label: React.ReactNode;
    contactListIdentifier: string;
    initialEmailAddress?: string;
}
export function FooterContactListEntryForm({
    label,
    contactListIdentifier,
    initialEmailAddress,
    ...formProperties
}: FooterContactListEntryFormProperties) {
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
                if(error instanceof Error && error.message === 'Email address already exists in this contact list.') {
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
                <form.FieldLabel>{label}</form.FieldLabel>
                <div className="flex items-center gap-2">
                    <form.FieldInputText
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
                <div className="relative h-0 overflow-visible text-xs md:max-w-3xs">
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
