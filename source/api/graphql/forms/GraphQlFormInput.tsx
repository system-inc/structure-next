'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { FormInputReferenceInterface } from '@structure/source/components/forms/FormInput';
import { FormInputComponentAndProperties } from '@structure/source/api/graphql/forms/utilities/GraphQlFormUtilities';

// Component - GraphQlFormInput
// Registers a form input component instance in a shared reference map allowing other
// components to programmatically access and manipulate these inputs
export interface GraphQlFormInputProperties {
    key: string;
    formInputComponentAndProperties: FormInputComponentAndProperties;
    formInputsReferencesMap: Map<string, FormInputReferenceInterface>;
}
export const GraphQlFormInput = React.forwardRef<FormInputReferenceInterface, GraphQlFormInputProperties>(
    function (properties, wrapperReference) {
        // TODO: Using any here for now only because I couldn't figure out how not to without making a huge mess
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Component = properties.formInputComponentAndProperties.component as React.ComponentType<any>;

        // Render the component
        return (
            <Component
                {...properties.formInputComponentAndProperties.properties}
                key={properties.key}
                ref={function (reference: FormInputReferenceInterface) {
                    // Forward the ref to the parent component
                    if(typeof wrapperReference === 'function') {
                        wrapperReference(reference);
                    }
                    else if(wrapperReference) {
                        wrapperReference.current = reference;
                    }

                    // Also store in the map
                    if(reference) {
                        properties.formInputsReferencesMap.set(
                            properties.formInputComponentAndProperties.properties.id,
                            reference,
                        );
                    }
                }}
            />
        );
    },
);

// Set the display name for debugging purposes
GraphQlFormInput.displayName = 'GraphQlFormInput';
