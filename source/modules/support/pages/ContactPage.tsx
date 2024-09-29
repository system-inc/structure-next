'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlOperationForm } from '@structure/source/api/GraphQlOperationForm';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';

// Dependencies - API
import { SupportTicketCreateOperation } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets

// Component - ContactPage
export function ContactPage() {
    // Render the component
    return (
        <div className="container pb-32 pt-12">
            <h1 className="mb-6 text-3xl font-medium">Contact {ProjectSettings.title}</h1>

            <p className="">We look forward to hearing from you.</p>

            <GraphQlOperationForm
                className="mt-6"
                operation={SupportTicketCreateOperation}
                inputComponentsProperties={{
                    'input.title': {
                        label: 'Subject',
                        placeholder: 'Subject',
                        component: FormInputText,
                    },
                    'input.description': {
                        label: 'Message',
                        placeholder: 'Message',
                        component: FormInputTextArea,
                        rows: 8,
                    },
                    'input.emailAddress': {
                        placeholder: 'email@domain.com',
                    },
                    'input.type': {
                        // className: 'hidden',
                        defaultValue: 'Contact',
                    },
                    'input.initialComment': {
                        className: 'hidden',
                    },
                }}
                buttonProperties={{
                    children: 'Send Message',
                }}
            />
        </div>
    );
}

// Export - Default
export default ContactPage;
