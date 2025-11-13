'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useUrlSearchParameters } from '@structure/source/router/Navigation';
import { useForm } from '@structure/source/components/forms-new/useForm';

// Dependencies - API
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import {
    supportTicketCreateRequestInputSchema,
    useSupportTicketCreateRequest,
} from '@structure/source/modules/support/contact/hooks/useSupportTicketCreateRequest';

// Dependencies - Main Components
import { FieldInputText } from '@structure/source/components/forms-new/fields/text/FieldInputText';
import { FieldInputTextArea } from '@structure/source/components/forms-new/fields/text-area/FieldInputTextArea';
import { FieldInputFile } from '@structure/source/components/forms-new/fields/file/FieldInputFile';
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

    // Hooks
    const account = useAccount();
    const urlSearchParameters = useUrlSearchParameters();
    const supportTicketCreateRequest = useSupportTicketCreateRequest();
    const form = useForm({
        schema: supportTicketCreateRequestInputSchema,
        onSubmit: async function (formState) {
            // console.log('Submitting contact form with values:', formState.value);
            try {
                await supportTicketCreateRequest.execute(formState.value);
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
        [urlSearchParameters, form, account.data?.emailAddress],
    );

    // Effect to scroll to top when success state changes
    React.useEffect(
        function () {
            if(supportTicketCreateRequest.isSuccess) {
                scrollTargetReference.current?.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        },
        [supportTicketCreateRequest.isSuccess],
    );

    // Render the component
    return (
        <>
            {/* Scroll target for smooth scrolling to top, need to do in main layout */}
            <div ref={scrollTargetReference} className="absolute top-[-1000px] opacity-0" />
            <div className="relative mx-auto max-w-2xl">
                {/* Form Submitted Successfully */}
                {supportTicketCreateRequest.isSuccess ? (
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
                        <form.Field identifier="emailAddress">
                            <form.FieldLabel>Your Email Address</form.FieldLabel>
                            <FieldInputText type="email" />
                        </form.Field>

                        {/* Field - Title */}
                        <form.Field identifier="title">
                            <form.FieldLabel>Subject</form.FieldLabel>
                            <FieldInputText placeholder="Briefly describe your message" />
                        </form.Field>

                        {/* Field - Content */}
                        <form.Field identifier="content">
                            <form.FieldLabel>Message</form.FieldLabel>
                            <FieldInputTextArea
                                placeholder="Please include any details that will help us assist you"
                                rows={8}
                            />
                        </form.Field>

                        {/* Field - Attachment Files */}
                        <form.Field identifier="attachmentFiles">
                            <form.FieldLabel>Attachments</form.FieldLabel>
                            <FieldInputFile
                                multiple={true}
                                description="Attach any files that might help us assist you better."
                            />
                        </form.Field>

                        {/* Submit Button */}
                        <AnimatedButton
                            variant="A"
                            type="submit"
                            iconRight={PaperPlaneRightIcon}
                            isProcessing={supportTicketCreateRequest.isLoading}
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
