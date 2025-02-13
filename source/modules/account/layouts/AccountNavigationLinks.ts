// Dependencies - Assets
import { EnvelopeSimple, Gear, Package, Shield, ShippingContainer, SignOut, User } from '@phosphor-icons/react';

// Account Navigation Links
export const AccountNavigationLinks = [
    { href: '/account/profile', title: 'Profile', icon: User },
    { href: '/account/orders', title: 'Orders', icon: Package },
    { href: '/account/addresses', title: 'Addresses', icon: ShippingContainer },
    { href: '/account/email-addresses', title: 'Email Address', icon: EnvelopeSimple },
    // { href: '/account/addresses', title: 'Addresses', icon: MapLocationIcon },
    // { href: '/account/payment-methods', title: 'Payment Methods', icon: CreditCardIcon },
    // { href: '/account/notifications', title: 'Notifications', icon: NotificationsIcon },
    { href: '/account/security', title: 'Security', icon: Shield },
    { href: '/account/settings', title: 'Settings', icon: Gear },
    { href: '/sign-out', title: 'Sign Out', icon: SignOut },
];

// Export - Default
export default AccountNavigationLinks;
