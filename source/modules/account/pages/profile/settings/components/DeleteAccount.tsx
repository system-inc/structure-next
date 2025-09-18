'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import {
    AccountAuthenticatedSession,
    AccountSessionScopeType,
} from '@structure/source/modules/account/components/AccountAuthenticatedSession';
import { DeleteAccountForm } from '@structure/source/modules/account/pages/profile/settings/components/DeleteAccountForm';

// Component - DeleteAccount
export interface DeleteAccountProperties {
    onComplete?: () => void;
}
export function DeleteAccount(properties: DeleteAccountProperties) {
    // Render the component
    return (
        <AccountAuthenticatedSession
            scopeType={AccountSessionScopeType.AccountMaintenance}
            title="Delete Account"
            description="To delete your account, please verify your identity."
            buttonText="Continue"
        >
            <DeleteAccountForm onComplete={properties.onComplete} />
        </AccountAuthenticatedSession>
    );
}
