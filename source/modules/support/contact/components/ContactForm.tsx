'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useUrlSearchParameters } from '@structure/source/router/Navigation';
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';
import {
    supportTicketCreateRequestInputSchema,
    useSupportTicketCreateRequest,
} from '@structure/source/modules/support/contact/hooks/useSupportTicketCreateRequest';

// Dependencies - Main Components
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { ContactMessagePreview } from './ContactMessagePreview';

// Dependencies - Animation
import { motion } from 'motion/react';

// Dependencies - Assets
import { PaperPlaneRightIcon, SpinnerIcon } from '@phosphor-icons/react';

// Component - ContactForm
export function ContactForm() {
    // References
    const scrollTargetReference = React.useRef<HTMLDivElement>(null);

    // Testing
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Hooks
    const account = useAccount();
    const urlSearchParameters = useUrlSearchParameters();
    const supportTicketCreateRequest = useSupportTicketCreateRequest();
    const form = useForm({
        schema: supportTicketCreateRequestInputSchema,
        onSubmit: async function (formState) {
            console.log('Submitting contact form with values:', formState.value);
            try {
                setIsProcessing(true);
                await new Promise((resolve) => setTimeout(resolve, 2500));
                setIsSuccess(true);
                // await supportTicketCreateRequest.execute(submitProperties.value);
            }
            catch(error) {
                console.error(error);
            }
        },
    });

    // Effect to set the email address and subject automatically
    React.useEffect(
        function () {
            // Set email if user is signed in
            if(account.data?.emailAddress) {
                form.setFieldValue('emailAddress', account.data.emailAddress);
            }

            // Set subject from URL parameter
            const subject = urlSearchParameters.get('subject');
            if(subject) {
                form.setFieldValue('title', subject);
            }
        },
        [urlSearchParameters, form, account.data],
    );

    // Effect to scroll to top when success state changes
    React.useEffect(
        function () {
            if(isSuccess || supportTicketCreateRequest.isSuccess) {
                // Scroll to the top of the page
                scrollTargetReference.current?.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        },
        [isSuccess, supportTicketCreateRequest.isSuccess],
    );

    // Render the component
    return (
        <>
            {/* Scroll target for smooth scrolling to top */}
            <div ref={scrollTargetReference} className="absolute top-[-1000px] opacity-0" />
            <div className="relative mx-auto max-w-2xl">
                {/* Form Submitted Successfully */}
                {isSuccess || supportTicketCreateRequest.isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <ContactMessagePreview
                            title={form.state.values.title}
                            content={form.state.values.content}
                            emailAddress={form.state.values.emailAddress}
                            attachmentFiles={form.state.values.attachmentFiles}
                        />
                    </motion.div>
                ) : (
                    // Contact Form
                    <form.Form className="mt-12 flex flex-col items-stretch gap-4">
                        {/* Field - Email Address */}
                        <form.Field name="emailAddress">
                            <form.Label label="Your Email Address">
                                <form.InputText type="email" />
                            </form.Label>
                        </form.Field>

                        {/* Field - Title */}
                        <form.Field name="title">
                            <form.Label label="Subject">
                                <form.InputText placeholder="Briefly describe your message" />
                            </form.Label>
                        </form.Field>

                        {/* Field - Content */}
                        <form.Field name="content">
                            <form.Label label="Message">
                                <form.InputTextArea
                                    placeholder="Please include any details that will help us assist you"
                                    rows={8}
                                />
                            </form.Label>
                        </form.Field>

                        {/* Field - Attachment Files */}
                        <form.Field name="attachmentFiles">
                            <form.Label label="Attachments" optional={true}>
                                <form.InputFile multiple />
                            </form.Label>
                        </form.Field>

                        {/* Submit Button */}
                        <AnimatedButton
                            variant="A"
                            type="submit"
                            iconRight={PaperPlaneRightIcon}
                            isProcessing={isProcessing || supportTicketCreateRequest.isLoading}
                            processingIcon={SpinnerIcon}
                            animateIconPosition="iconRight"
                        >
                            Send Message
                        </AnimatedButton>
                    </form.Form>
                )}
            </div>
        </>
    );
}
