// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import { ArrowRightIcon, QuestionIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SupportNeedMoreHelp
export interface SupportNeedMoreHelpProperties {
    className?: string;
}
export function SupportNeedMoreHelp(properties: SupportNeedMoreHelpProperties) {
    // Render the component
    return (
        <div className={mergeClassNames('mx-auto max-w-170', properties.className)}>
            <h2 className="mb-12 text-center text-[2rem] font-medium">Need more help?</h2>

            <div className="mb-12 rounded-2xl border border--0 background--2 p-8">
                <QuestionIcon className="mx-auto mb-4 size-6" />
                <p className="mb-2 text-center font-medium">Contact Us</p>
                <p className="text-center text-sm font-normal content--4">We&apos;d love to hear from you.</p>

                <div className="mt-8 flex flex-col items-center">
                    <Button variant="B" iconRight={ArrowRightIcon} href="/contact">
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
}
