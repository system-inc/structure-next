// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AccountMenuSignedIn } from '@structure/source/modules/account/components/AccountMenuSignedIn';
import { AccountMenuSignedOut } from '@structure/source/modules/account/components/AccountMenuSignedOut';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { ThemeToggle } from '@structure/source/theme/ThemeToggle';

// Dependencies - Accounts
import { Account } from '@structure/source/modules/account/Account';
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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
                'relative w-(--radix-popover-content-available-width) overflow-hidden py-3 md:w-full md:min-w-[24rem]',
                properties.className,
            )}
        >
            {/* If signed in */}
            {properties.account ? <AccountMenuSignedIn account={properties.account} /> : <AccountMenuSignedOut />}

            {/* Divider */}
            <div className="mb-1 border-b border--0" />

            <div className="flex h-12 items-center pt-1">
                {/* Theme Toggle */}
                <div className="ml-4 grow">
                    <ThemeToggle />
                </div>

                {/* If signed in */}
                {properties.account && (
                    <div className="mr-4 justify-end">
                        <AnimatedButton
                            variant="Outline"
                            className="w-[92px]"
                            onClick={async function () {
                                await account.signOut();
                            }}
                            showResultIconAnimation={true}
                        >
                            Sign Out
                        </AnimatedButton>
                    </div>
                )}
            </div>
        </div>
    );
}
