// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Accounts
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Component - AccountMenu
export function AccountMenuSignedOut() {
    // Hooks
    const account = useAccount();

    // Render the component
    return (
        <div className="w-full">
            <div className="border-b border-b-light-4 px-4 pb-2 dark:border-b-dark-4">
                <p className="whitespace-nowrap font-medium">Welcome to {ProjectSettings.title}</p>
            </div>
            <div className="px-4 pt-4">
                <Button
                    className="w-full"
                    onClick={function () {
                        account.setAuthenticationDialogOpen(true);
                    }}
                >
                    Sign In or Create Account
                </Button>
            </div>
        </div>
    );
}
