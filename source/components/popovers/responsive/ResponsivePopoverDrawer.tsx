// Dependencies - ResponsivePopoverDrawer Components
import { ResponsivePopoverDrawerRoot } from './ResponsivePopoverDrawerRoot';
import { ResponsivePopoverDrawerTrigger } from './ResponsivePopoverDrawerTrigger';
import { ResponsivePopoverDrawerClose } from './ResponsivePopoverDrawerClose';

// Export ResponsivePopoverDrawer with compound components using Object.assign
export const ResponsivePopoverDrawer = Object.assign(ResponsivePopoverDrawerRoot, {
    Trigger: ResponsivePopoverDrawerTrigger,
    Close: ResponsivePopoverDrawerClose,
});

// Export types
export type { ResponsivePopoverDrawerRootProperties as ResponsivePopoverDrawerProperties } from './ResponsivePopoverDrawerRoot';
export type { ResponsivePopoverDrawerTriggerProperties } from './ResponsivePopoverDrawerTrigger';
export type { ResponsivePopoverDrawerCloseProperties } from './ResponsivePopoverDrawerClose';

// Export context and hook
export { useResponsivePopoverDrawerContext } from './ResponsivePopoverDrawerContext';
export type { ResponsivePopoverDrawerContextValue } from './ResponsivePopoverDrawerContext';
