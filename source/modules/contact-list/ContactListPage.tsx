'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { AccountMenuButton } from '@structure/source/modules/account/components/AccountMenuButton';
import { ContactListForm } from '@structure/source/modules/contact-list/ContactListForm';

// Component - ContactListPage
export function ContactListPage() {
    const currentYear = new Date().getFullYear();

    // Function to render social links
    function renderSocialLinks() {
        const platforms = ProjectSettings.platforms;
        const platformsKeys = Object.keys(platforms);

        return platformsKeys.map(function (platformKey, index) {
            const platform = platforms[platformKey];

            if(platform) {
                return (
                    <span key={index}>
                        {index > 0 && ' • '}
                        <Link href={platform.url} target="_blank" className="text-blue underline">
                            {platform.title}
                        </Link>
                    </span>
                );
            }
        });
    }

    // Render the component
    return (
        <>
            <div className="flex h-screen items-center md:h-screen md:items-stretch dark:bg-dark dark:text-light-2">
                {/* Show the account menu button */}
                <div className="absolute top-4 right-4 z-20">{<AccountMenuButton />}</div>

                {/* Primary div, shows up on left side of screen on medium displays */}
                <div className="scrollbar-hide flex-grow items-center justify-center md:flex md:overflow-auto md:border-r md:border-r-light-4 dark:border-r dark:border-dark-4">
                    <div className="max-w-[680px] p-8 md:max-h-screen">
                        {/* Show the logo on small screens */}
                        <div
                            className="mb-6 bg-logo-light bg-no-repeat md:hidden dark:bg-logo-dark"
                            style={{
                                backgroundSize: ProjectSettings.assets.logo.width + 'px',
                                width: ProjectSettings.assets.logo.width + 'px',
                                height: ProjectSettings.assets.logo.height + 'px',
                            }}
                        />

                        {/* Project description */}
                        <h1 className="mb-5 leading-10">{ProjectSettings.description}</h1>

                        {/* Contact List form */}
                        <ContactListForm />

                        {/* Footer */}
                        <p className="mt-6 text-sm font-light">
                            &copy;{currentYear}{' '}
                            <Link href={ProjectSettings.url} target="_blank" className="text-blue underline">
                                {ProjectSettings.ownerDisplayName}
                            </Link>
                            {' • '}
                            {renderSocialLinks()}
                        </p>
                    </div>
                </div>
                {/* Secondary div, shows up on right side of screen on medium displays */}
                <div className="z-10 hidden min-w-[40%] items-center md:flex">
                    <div>
                        {/* Div to contain logo */}
                        <div
                            className="bg-light dark:bg-dark"
                            style={{
                                marginLeft: '-' + ProjectSettings.assets.logo.height / 2 + 'px',
                                paddingTop: ProjectSettings.assets.logo.height + 'px',
                                paddingBottom: ProjectSettings.assets.logo.height + 'px',
                            }}
                        >
                            {/* Logo */}
                            <div
                                className={`bg-logo-light bg-no-repeat dark:bg-logo-dark`}
                                style={{
                                    backgroundSize: ProjectSettings.assets.logo.width + 'px',
                                    width: ProjectSettings.assets.logo.width + 'px',
                                    height: ProjectSettings.assets.logo.height + 'px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
