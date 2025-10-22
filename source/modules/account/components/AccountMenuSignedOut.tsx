// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Accounts
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Component - AccountMenu
export function AccountMenuSignedOut() {
    // Hooks
    const account = useAccount();

    // Render the component
    return (
        <div className="w-full">
            <div className="border-b border--1 px-4 pb-2">
                <p className="font-medium whitespace-nowrap">Welcome to {ProjectSettings.title}</p>
            </div>
            <div className="px-4 pt-4">
                <Button
                    variant="A"
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
