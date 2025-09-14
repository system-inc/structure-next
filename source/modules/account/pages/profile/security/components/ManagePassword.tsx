'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AccountMaintenanceSession } from '@structure/source/modules/account/components/AccountMaintenanceSession';
import { ManagePasswordForm } from '@structure/source/modules/account/pages/profile/security/components/ManagePasswordForm';

// Component - ManagePassword
export interface ManagePasswordProperties {
    accountHasPasswordSet: boolean;
    onComplete?: () => void;
}
export function ManagePassword(properties: ManagePasswordProperties) {
    // Render the component
    return (
        <AccountMaintenanceSession
            title={`${properties.accountHasPasswordSet ? 'Change' : 'Set'} Password`}
            description={`To ${properties.accountHasPasswordSet ? 'change' : 'set'} your password, please verify your identity.`}
            buttonText="Continue"
        >
            <ManagePasswordForm
                accountHasPasswordSet={properties.accountHasPasswordSet}
                onComplete={properties.onComplete}
            />
        </AccountMaintenanceSession>
    );
}
