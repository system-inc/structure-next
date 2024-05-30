import { InputTextVariants } from '@structure/source/common/forms/InputText';
import TipIcon from '@structure/source/common/popovers/TipIcon';
import { mergeClassNames } from '@structure/source/utilities/Style';
import EyeIcon from '@structure/assets/icons/security/EyeIcon.svg';
import EyeCancelIcon from '@structure/assets/icons/security/EyeCancelIcon.svg';
import React from 'react';

interface ChallengeInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelTip?: string;
}
/**
 * @name ChallengeInput
 *
 * @description
 * This is an uncontrolled input component--meaning that the value of the input is not controlled by React. It is
 * controlled by the HTML input element itself. This is more flexible because it can be overridden by passing a value
 * prop to the input element on a case-by-case basis.
 *
 * @param {ChallengeInputInterface} properties - Extends the HTML input element attributes.
 *
 * @example <ChallengeInput id="uncontrolled-input" ref={inputRef} />
 * @example <ChallengeInput id="controlled-input" value={value} onChange={(event) => setValue(event.target.value)} />
 */
const ChallengeInput = React.forwardRef<HTMLInputElement, ChallengeInputInterface>(
    ({ type = 'password', ...properties }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <div className="relative space-y-2">
                {/* Label */}
                {properties.label && (
                    <div className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-75">
                        <label className="pointer:cursor select-none" htmlFor={properties.id ?? properties.label}>
                            {properties.label}
                        </label>
                        {/* Label Tip */}
                        {properties.label && properties.labelTip && (
                            <TipIcon content={properties.labelTip} className="ml-1 max-w-xs" openOnPress />
                        )}
                    </div>
                )}

                {/* Input */}
                <div className="relative">
                    <input
                        ref={ref}
                        id={properties.id ?? properties.label}
                        {...properties}
                        type={type === 'password' && showPassword ? 'text' : type}
                        className={mergeClassNames(InputTextVariants.default, properties.className, 'w-full')}
                        required
                    />

                    {/* Show Password Toggle */}
                    {type === 'password' && (
                        <button
                            type="button" // Prevent form submission
                            className="absolute right-1 top-1/2 -translate-y-1/2 transform rounded p-1 text-muted-foreground transition-colors hover:bg-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-75"
                            onClick={(event) => {
                                event.preventDefault();
                                setShowPassword((showPassword) => !showPassword);
                            }}
                        >
                            {showPassword ? <EyeCancelIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    )}
                </div>
            </div>
        );
    },
);
ChallengeInput.displayName = 'ChallengeInput';

export default ChallengeInput;
