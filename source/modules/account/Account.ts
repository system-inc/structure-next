// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { AccountQuery } from '@project/source/api/GraphQlGeneratedCode';

// Account variables shared across the application
export const accountSignedInKey = ProjectSettings.identifier + 'AccountSignedIn';

// Class - Account
export class Account {
    emailAddress: AccountQuery['account']['emailAddress'] | null | undefined;
    profile: AccountQuery['account']['profile'];
    accessRoles: AccountQuery['account']['accessRoles'];
    createdAt: Date;

    constructor(accountCurrentQueryData: AccountQuery['account']) {
        if(!accountCurrentQueryData) throw new Error('Invalid account data from GraphQL query.');

        this.createdAt = new Date(accountCurrentQueryData.createdAt);
        this.emailAddress = accountCurrentQueryData.emailAddress;
        this.profile = accountCurrentQueryData.profile;
        this.accessRoles = accountCurrentQueryData.accessRoles;
    }

    getPublicDisplayName() {
        let publicDisplayName = '';

        // Use the display name from the profile
        if(this.profile?.displayName) {
            publicDisplayName = this.profile.displayName;
        }
        // If there is no display name, use username
        else if(this.profile?.username) {
            // Use the username
            publicDisplayName = '@' + this.profile.username;
        }

        return publicDisplayName;
    }

    hasRole(role: string) {
        return this.accessRoles.includes(role);
    }

    isAdministator() {
        return this.hasRole('Administrator');
    }
}

// Export - Default
export default Account;
