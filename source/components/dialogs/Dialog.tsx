// Dependencies - Dialog Components
import { DialogRoot } from './DialogRoot';
import { DialogTrigger } from './DialogTrigger';
import { DialogHeader } from './DialogHeader';
import { DialogContent } from './DialogContent';
import { DialogFooter } from './DialogFooter';
import { DialogClose } from './DialogClose';

// Export Dialog with compound components using Object.assign
export const Dialog = Object.assign(DialogRoot, {
    Trigger: DialogTrigger,
    Header: DialogHeader,
    Content: DialogContent,
    Footer: DialogFooter,
    Close: DialogClose,
});

// Export types
export type { DialogRootProperties as DialogProperties } from './DialogRoot';
export type { DialogTriggerProperties } from './DialogTrigger';
export type { DialogHeaderProperties } from './DialogHeader';
export type { DialogContentProperties } from './DialogContent';
export type { DialogFooterProperties } from './DialogFooter';
export type { DialogCloseProperties } from './DialogClose';
