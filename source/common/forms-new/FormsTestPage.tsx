'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form } from './Form';
import { FormInputText } from './FormInputText';
import { Button } from '@structure/source/common/buttons/Button';

// Interface - TestForm
interface TestFormValues {
    username: string;
    email: string;
}

// Component - FormsTestPage
export function FormsTestPage() {
    // State
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>();

    // Function to handle form submission
    async function handleSubmit(values) {
        try {
            setLoading(true);
            console.log('Form values:', values);

            return {
                success: true,
                message: 'Form submitted successfully!',
            };
        }
        catch(error) {
            return {
                success: false,
                message: 'Form submission failed',
                errors: {
                    username: {
                        valid: false,
                        errors: [{ message: 'Username already taken' }],
                    },
                },
            };
        } finally {
            setLoading(false);
        }
    }

    // Render the component
    return (
        <div className="container mx-auto p-8">
            <h1 className="mb-8 text-2xl font-bold">Forms Test Page</h1>

            <Form onSubmit={handleSubmit} loading={loading} error={error}>
                <FormInputText id="username" label="Username" required validateOnBlur />
                <FormInputText id="email" label="Email" type="email" required validateOnChange />
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    );
}
