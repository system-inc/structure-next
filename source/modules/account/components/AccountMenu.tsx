// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AccountMenuSignedIn } from '@structure/source/modules/account/components/AccountMenuSignedIn';
import { AccountMenuSignedOut } from '@structure/source/modules/account/components/AccountMenuSignedOut';
import { Button } from '@structure/source/common/buttons/Button';
import { ThemeToggle } from '@structure/source/theme/ThemeToggle';

// Dependencies - Accounts
import { Account } from '@structure/source/modules/account/Account';
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - AccountMenu
export interface AccountMenuProperties {
    account: Account | null;
    className?: string;
}
export function AccountMenu(properties: AccountMenuProperties) {
    // Hooks
    const account = useAccount();

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'relative w-[var(--radix-popover-content-available-width)] overflow-hidden md:w-full md:min-w-[24rem]',
                properties.className,
            )}
            tabIndex={1}
        >
            {/* If signed in */}
            {properties.account ? <AccountMenuSignedIn account={properties.account} /> : <AccountMenuSignedOut />}

            {/* Divider */}
            <div className="mb-1 mt-4 border-b border-b-light-4 dark:border-b-dark-4" />

            <div className="flex h-12 items-center pt-1">
                {/* Theme Toggle */}
                <div className="ml-4 flex-grow">
                    <ThemeToggle />
                </div>

                {/* If signed in */}
                {properties.account && (
                    <div className="mr-4 justify-end">
                        <Button
                            tabIndex={1}
                            className="w-[92px]"
                            onClick={async function () {
                                await account.signOut();
                            }}
                            processingAnimation={true}
                        >
                            Sign Out
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
