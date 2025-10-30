// Dependencies - API
import { AccountQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Account
import { AccountRole } from './AccountRole';

// Re-export AccountRole for convenience
export { AccountRole };

// Class - Account
export class Account {
    // Account email address
    emailAddress: AccountQuery['account']['emailAddress'] | null | undefined;
    // Account profile information
    profile: AccountQuery['account']['profile'];
    // Access roles assigned to this account
    accessRoles: AccountQuery['account']['accessRoles'];
    // Entitlements assigned to this account
    entitlements: AccountQuery['account']['entitlements'];
    // Date when the account was created
    createdAt: Date;

    /**
     * Creates a new Account instance
     * @param accountQueryData Data from the account GraphQL query
     * @throws Error if account data is invalid
     */
    constructor(accountQueryData: AccountQuery['account']) {
        if(!accountQueryData) throw new Error('Invalid account data from GraphQL query.');

        this.emailAddress = accountQueryData.emailAddress;
        this.profile = accountQueryData.profile;
        this.accessRoles = accountQueryData.accessRoles;
        this.entitlements = accountQueryData.entitlements;
        this.createdAt = new Date(accountQueryData.createdAt);
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
     * Checks if the account has a specific role
     * @param role The role to check
     * @returns True if the account has the specified role
     */
    hasRole(role: AccountRole) {
        return this.accessRoles.includes(role);
    }

    /**
     * Checks if the account has any of the specified roles
     * @param roles Array of roles to check against
     * @returns True if the account has any of the specified roles
     */
    hasAnyRole(roles: AccountRole[]) {
        return roles.some((role) => this.hasRole(role));
    }

    /**
     * Checks if the account has Administrator role
     * @returns True if the account is an administrator
     */
    isAdministrator() {
        return this.hasRole(AccountRole.Administrator);
    }

    /**
     * Checks if the account has a specific entitlement
     * @param entitlement The entitlement to check (string)
     * @returns True if the account has the specified entitlement
     */
    hasEntitlement(entitlement: string) {
        return this.entitlements.includes(entitlement);
    }
}
