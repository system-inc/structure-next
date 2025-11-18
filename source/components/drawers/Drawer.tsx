// Dependencies - Drawer Components
import { DrawerRoot } from './DrawerRoot';
import { DrawerTrigger } from './DrawerTrigger';
import { DrawerClose } from './DrawerClose';
import { DrawerHeader } from './DrawerHeader';
import { DrawerBody } from './DrawerBody';
import { DrawerFooter } from './DrawerFooter';
import { DrawerOverlay } from './DrawerOverlay';
import { DrawerPortal } from './DrawerPortal';

// Export Drawer with compound components using Object.assign
export const Drawer = Object.assign(DrawerRoot, {
    Trigger: DrawerTrigger,
    Close: DrawerClose,
    Header: DrawerHeader,
    Body: DrawerBody,
    Footer: DrawerFooter,
    Overlay: DrawerOverlay,
    Portal: DrawerPortal,
});

// Export types
export type { DrawerRootProperties as DrawerProperties } from './DrawerRoot';
export type { DrawerTriggerProperties } from './DrawerTrigger';
export type { DrawerCloseProperties } from './DrawerClose';
export type { DrawerHeaderProperties } from './DrawerHeader';
export type { DrawerBodyProperties } from './DrawerBody';
export type { DrawerFooterProperties } from './DrawerFooter';
export type { DrawerOverlayProperties } from './DrawerOverlay';
export type { DrawerPortalProperties } from './DrawerPortal';

// Export context and hooks
export { useDrawerContext, useIsNestedDrawer } from './DrawerContext';
export type { DrawerContextValue } from './DrawerContext';

// Export theme types
export type { DrawerSide, DrawerThemeConfiguration } from './DrawerTheme';
