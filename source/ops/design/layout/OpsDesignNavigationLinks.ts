// Dependencies - Assets
import { PaletteIcon, CursorClickIcon } from '@phosphor-icons/react';

// Type
export interface OpsDesignNavigationLinkInterface {
    href: string; // Relative path: '', '/buttons', etc.
    title: string;
    icon: typeof PaletteIcon; // Phosphor icon component type
}

// Design navigation links
export const opsDesignNavigationLinks: OpsDesignNavigationLinkInterface[] = [
    { href: '', title: 'Colors', icon: PaletteIcon },
    { href: '/buttons', title: 'Buttons', icon: CursorClickIcon },
];
