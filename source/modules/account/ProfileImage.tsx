// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Assets
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ProfileImage
export interface ProfileImageInterface {
    className?: string;
    profileImageUrl?: string;
    alternateText?: string;
}
export function ProfileImage(properties: ProfileImageInterface) {
    // State
    const [imageError, setImageError] = React.useState(false);

    // Default alternate text and short-hand moniker
    let alternateText = 'Profile Image';
    let shortHandMoniker = '';

    // If there is alternate text
    if(properties.alternateText) {
        // Set the alternate text
        alternateText = properties.alternateText;

        // If the alternate text is a username, use the first letter of the first word only, omitting the '@' symbol
        shortHandMoniker = properties.alternateText.charAt(0).toUpperCase();
    }

    // Render the component
    return (
        <div
            className={mergeClassNames(
                properties.className,
                'relative flex h-full w-full items-center justify-center rounded-full border border-light-6 bg-light dark:border-dark-2 dark:bg-dark',
            )}
            style={{
                containerType: 'size',
                containerName: 'account-menu-button',
            }}
        >
            {
                // If we have a profile image and there is no error
                properties.profileImageUrl && !imageError ? (
                    <Image
                        src={properties.profileImageUrl}
                        alt={alternateText}
                        fill={true}
                        className="rounded-full"
                        onError={function () {
                            setImageError(true);
                        }}
                        priority={true}
                    />
                ) : // If we do not have a profile image, but we do have a short-hand moniker
                shortHandMoniker !== '' ? (
                    <div
                        className="flex select-none items-center justify-center uppercase"
                        style={{ fontSize: 'calc(0.4rem + 25cqb)' }}
                    >
                        {shortHandMoniker}
                    </div>
                ) : (
                    // If there is no profile image or short-hand moniker
                    <UserIcon className="h-[55%] w-[55%]" />
                )
            }
        </div>
    );
}

// Export - Default
export default ProfileImage;
