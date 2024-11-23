// Dependencies - Assets
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';
import BagIcon from '@structure/assets/icons/commerce/BagIcon.svg';
import MailIcon from '@structure/assets/icons/communication/MailIcon.svg';
// import MapLocationIcon from '@structure/assets/icons/navigation/MapLocationIcon.svg';
// import KeyIcon from '@structure/assets/icons/security/KeyIcon.svg';
// import CreditCardIcon from '@structure/assets/icons/finance/CreditCardIcon.svg';
// import NotificationsIcon from '@structure/assets/icons/communication/NotificationsIcon.svg';
import SignOutIcon from '@structure/assets/icons/security/SignOutIcon.svg';

// Account Navigation Links
export const AccountNavigationLinks = [
    { href: '/account/profile', title: 'Profile', icon: UserIcon },
    { href: '/account/orders', title: 'Orders', icon: BagIcon },
    { href: '/account/email-addresses', title: 'Email Addresses', icon: MailIcon },
    // { href: '/account/addresses', title: 'Addresses', icon: MapLocationIcon },
    // { href: '/account/security', title: 'Security', icon: KeyIcon },
    // { href: '/account/payment-methods', title: 'Payment Methods', icon: CreditCardIcon },
    // { href: '/account/notifications', title: 'Notifications', icon: NotificationsIcon },
    { href: '/sign-out', title: 'Sign Out', icon: SignOutIcon },
];

// Export - Default
export default AccountNavigationLinks;
