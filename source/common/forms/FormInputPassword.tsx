// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputReferenceInterface } from '@structure/source/common/forms/FormInput';
import { FormInputTextProperties, FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - Assets
import EyeIcon from '@structure/assets/icons/security/EyeIcon.svg';
import EyeCancelIcon from '@structure/assets/icons/security/EyeCancelIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - FormInputPassword
export const FormInputPassword = React.forwardRef(function (
    properties: FormInputTextProperties,
    reference: React.Ref<FormInputReferenceInterface>,
) {
    const [showPassword, setShowPassword] = React.useState(false);

    // Render the component
    return (
        <div className="relative w-full">
            <FormInputText
                {...properties}
                ref={reference}
                type={showPassword ? 'text' : 'password'}
                className={mergeClassNames('', properties.className)}
                componentClassName={mergeClassNames('pr-10', properties.componentClassName)}
                sibling={
                    <button
                        type="button"
                        tabIndex={1} // Leave tab index as 1, tabs will happen in the order of the inputs
                        className="absolute inset-y-0 right-3 flex h-full w-6 items-center justify-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeCancelIcon className="h-[20px] w-[20px] text-dark dark:text-light" />
                        ) : (
                            <EyeIcon className="h-[20px] w-[20px] text-dark dark:text-light" />
                        )}
                    </button>
                }
            />
        </div>
    );
});

// Set the display name for debugging purposes
FormInputPassword.displayName = 'FormInputPassword';

// Export - Default
export default FormInputPassword;
