// Dependencies - API
import { AccountQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Account variables shared across the application
export const accountSignedInKey = 'AccountSignedIn';

// Class - Account

export class Account {
    /** Account email address */
    emailAddress: AccountQuery['account']['emailAddress'] | null | undefined;
    /** Account profile information */
    profile: AccountQuery['account']['profile'];
    /** Access roles assigned to this account */
    accessRoles: AccountQuery['account']['accessRoles'];
    /** Date when the account was created */
    createdAt: Date;

    /**
     * Creates a new Account instance
     * @param accountCurrentQueryData Data from the account GraphQL query
     * @throws Error if account data is invalid
     */
    constructor(accountCurrentQueryData: AccountQuery['account']) {
        if(!accountCurrentQueryData) throw new Error('Invalid account data from GraphQL query.');

        this.createdAt = new Date(accountCurrentQueryData.createdAt);
        this.emailAddress = accountCurrentQueryData.emailAddress;
        this.profile = accountCurrentQueryData.profile;
        this.accessRoles = accountCurrentQueryData.accessRoles;
    }

    /**
     * Gets the URL of the profile image
     * @returns The URL of the profile image or undefined if not found
     */
    get profileImage() {
        const image = this.profile?.images?.find((image) => image.variant === 'profile-image');

        return image?.url;
    }

    /**
     * Gets the display name for the profile
     * @returns The profile display name or username prefixed with '@'
     */
    get profileDisplayName() {
        return this.profile?.displayName || '@' + this.profile?.username;
    }

    /**
     * Gets the date when the profile was created
     * @returns Date object representing when the profile was created
     */
    get profileJoinedDate() {
        return new Date(this.profile?.createdAt);
    }

    /**
     * Gets the public display name for the account
     * @deprecated Use the profileDisplayName getter instead
     * @returns The public display name string
     */
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

    /**
     * Checks if the account has a specific role
     * @param role The role to check
     * @returns True if the account has the specified role
     */
    hasRole(role: string) {
        return this.accessRoles.includes(role);
    }

    /**
     * Checks if the account has any of the specified roles
     * @param roles Array of roles to check against
     * @returns True if the account has any of the specified roles
     */
    hasAnyRole(roles: string[]) {
        return roles.some((role) => this.hasRole(role));
    }

    /**
     * Checks if the account has Administrator role
     * @returns True if the account is an administrator
     */
    isAdministator() {
        return this.hasRole('Administrator');
    }
}
