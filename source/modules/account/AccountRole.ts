/**
 * Account access roles that define permissions and capabilities within the system.
 * These roles are used for authorization and access control throughout the application.
 */
export enum AccountRole {
    // Full system access with all privileges
    Administrator = 'Administrator',

    // Customer support team member with access to support tickets and customer data
    Support = 'Support',

    // Marketing team member with access to marketing tools and analytics
    Marketer = 'Marketer',

    // Social media team member with access to social media management tools
    SocialMediaManager = 'SocialMediaManager',

    // View-only access to order information
    OrderViewer = 'OrderViewer',

    // Fulfillment team member with access to order fulfillment tools
    FulfillmentManager = 'FulfillmentManager',

    // Product team member with access to product management tools
    ProductManager = 'ProductManager',
}
