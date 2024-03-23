// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Accounts
import { useSession } from '@structure/source/providers/SessionProvider';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { accountCurrentQueryDocument } from '@structure/source/modules/account/api/AccountDocuments';
import {
    AccountCurrentQuery,
    AccessRoleType,
    AccountEmail,
    AccountRole,
    AccountSession,
    AccountStatus,
    Profile,
} from '@project/source/graphql/generated/graphql';

// Class - Account
export class Account {
    id: string;
    status: AccountStatus;

    primaryEmailAddress: AccountEmail;
    currentProfile: Profile;
    roles: AccountRole[];

    currentSession: AccountSession;

    createdAt: Date;
    updatedAt: Date;

    constructor(accountCurrentQueryData: AccountCurrentQuery['accountCurrent']) {
        if(!accountCurrentQueryData) throw new Error('Invalid account data from GraphQL query.');

        this.id = accountCurrentQueryData.id;
        this.createdAt = new Date(accountCurrentQueryData.createdAt);
        this.updatedAt = new Date(accountCurrentQueryData.updatedAt);
        this.status = accountCurrentQueryData.status;
        this.primaryEmailAddress = accountCurrentQueryData.primaryEmailAddress as AccountEmail;
        this.currentSession = accountCurrentQueryData.currentSession as AccountSession;
        this.currentProfile = accountCurrentQueryData.currentProfile as Profile;
        this.roles = accountCurrentQueryData.roles;
    }

    getPublicDisplayName() {
        let publicDisplayName = '';

        // Use the display name from the profile
        if(this.currentProfile?.displayName) {
            publicDisplayName = this.currentProfile.displayName;
        }
        // If there is no display name, use username
        else if(this.currentProfile?.username) {
            // Use the username
            publicDisplayName = '@' + this.currentProfile.username;
        }

        return publicDisplayName;
    }

    hasRole(roleType: AccessRoleType) {
        let hasRole = false;

        // Loop through the roles
        for(let i = 0; i < this.roles.length; i++) {
            if(this.roles[i]?.roleType === roleType) {
                hasRole = true;
                break;
            }
        }

        return hasRole;
    }

    isAdministator() {
        return this.hasRole(AccessRoleType.Administrator);
    }
}

// Hook - useAccountCurrent
export function useAccountCurrent() {
    // Hooks
    const { sessionToken } = useSession();

    // State
    const [isClient, setIsClient] = React.useState(false);

    // Get the current account the GraphQL API
    const accountCurrentQueryState = useQuery(accountCurrentQueryDocument, {
        skip: !sessionToken, // If there is no session token, skip this query
    });

    // Create the account object from the GraphQL query data
    const account = React.useMemo(
        function () {
            if(accountCurrentQueryState.data?.accountCurrent) {
                return new Account(accountCurrentQueryState.data?.accountCurrent);
            }
            else {
                return null;
            }
        },
        [accountCurrentQueryState.data?.accountCurrent],
    );

    // Set the client state when the component mounts
    React.useEffect(function () {
        setIsClient(true);
    }, []);

    return {
        loading:
            // If the client is not ready,
            !isClient
                ? // Set loading to true
                  true // This handles SSR loading state (i.e., hydration mismatch issues)
                : // Otherwise, set loading to the loading state of the query
                  accountCurrentQueryState.loading,
        error: accountCurrentQueryState.error,
        data: account,
    };
}

// Export - Default
export default Account;
