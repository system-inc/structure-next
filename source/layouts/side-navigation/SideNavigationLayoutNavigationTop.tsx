// Dependencies - Main Components
import { SideNavigationLayoutNavigationSideToggle } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigationSideToggle';
import AccountMenuButton from '@structure/source/modules/account/AccountMenuButton';

// Component - SideNavigationLayoutNavigationTop
export interface SideNavigationLayoutNavigationTopInterface {
    className?: string;
}
export function SideNavigationLayoutNavigationTop(properties: SideNavigationLayoutNavigationTopInterface) {
    // Render the component
    return (
        <>
            {/* Bottom Border */}
            <div className="pointer-events-none fixed z-30 h-16 w-full border-b border-b-light-4 dark:border-b-dark-4" />

            {/* Top Left */}
            <div className="fixed left-4 z-30 flex h-[63px] items-center">
                <SideNavigationLayoutNavigationSideToggle />
            </div>

            {/* Top Right */}
            <div className="fixed right-4 z-30 flex h-[63px] items-center">
                <AccountMenuButton />
            </div>
        </>
    );
}

// Export - Default
export default SideNavigationLayoutNavigationTop;
