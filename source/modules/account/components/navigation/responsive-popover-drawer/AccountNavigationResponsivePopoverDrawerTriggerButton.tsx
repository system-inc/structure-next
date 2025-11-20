'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { NonLinkButtonProperties, Button } from '@structure/source/components/buttons/Button';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Component - AccountNavigationResponsivePopoverDrawerTriggerButton
// We need to forward references so the button receives the data-state attributes from the popover/drawer
export interface AccountNavigationResponsivePopoverDrawerTriggerButtonProperties
    extends Omit<NonLinkButtonProperties, 'variant' | 'size' | 'children'> {
    variant?: NonLinkButtonProperties['variant'];
}
export const AccountNavigationResponsivePopoverDrawerTriggerButton = React.forwardRef<
    HTMLElement,
    AccountNavigationResponsivePopoverDrawerTriggerButtonProperties
>(function AccountNavigationResponsivePopoverDrawerTriggerButton(properties, reference) {
    // Hooks
    const account = useAccount();

    // Get the profile image URL
    const profileImageUrl = account.data?.profile?.images?.find((image) => image.variant === 'profile-image-small')
        ?.url;

    // Get the profile image alternate text
    const profileImageAlternateText = account.data?.profileDisplayName || '';

    // Destructure to separate our custom props from button props
    const { variant, ...buttonProperties } = properties;

    // Render the component
    return (
        <Button
            ref={reference}
            {...buttonProperties}
            variant={variant || 'A'}
            className={properties.className || (account.signedIn ? 'relative h-9 w-9' : undefined)}
            size={account.signedIn ? undefined : 'Small'}
            aria-label="Open navigation menu"
        >
            {account.signedIn ? (
                // Signed in - show profile image
                <ProfileImage
                    // Padding for when there is no image (it sizes the UserIcon correctly)
                    className="absolute inset-0 border-0 p-0.5"
                    profileImageUrl={profileImageUrl}
                    alternateText={profileImageAlternateText}
                />
            ) : (
                // Signed out - show "Sign In" text
                <>Sign In</>
            )}
        </Button>
    );
});
