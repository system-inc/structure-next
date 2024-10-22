// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { AccountCurrentQuery } from '@project/source/api/GraphQlGeneratedCode';

// Account variables shared across the application
export const accountSignedInKey = ProjectSettings.identifier + 'AccountSignedIn';

// Class - Account
export class Account {
    primaryAccountEmail: AccountCurrentQuery['accountCurrent']['primaryAccountEmail'] | null | undefined;
    currentProfile: AccountCurrentQuery['accountCurrent']['currentProfile'];
    roles: AccountCurrentQuery['accountCurrent']['roles'];
    currentSession: AccountCurrentQuery['accountCurrent']['currentSession'];
    createdAt: Date;

    constructor(accountCurrentQueryData: AccountCurrentQuery['accountCurrent']) {
        if(!accountCurrentQueryData) throw new Error('Invalid account data from GraphQL query.');

        this.createdAt = new Date(accountCurrentQueryData.createdAt);
        this.primaryAccountEmail = accountCurrentQueryData.primaryAccountEmail;
        this.currentSession = accountCurrentQueryData.currentSession;
        this.currentProfile = accountCurrentQueryData.currentProfile;
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

    hasRole(type: string) {
        let hasRole = false;

        // Loop through the roles
        for(let i = 0; i < this.roles.length; i++) {
            if(this.roles[i]?.type === type) {
                hasRole = true;
                break;
            }
        }

        return hasRole;
    }

    isAdministator() {
        return this.hasRole('Administrator');
    }
}

// Export - Default
export default Account;
