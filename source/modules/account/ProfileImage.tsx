// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';
import * as Avatar from '@radix-ui/react-avatar';

// Component - ProfilePicture
export type ProfileImageProperties = {
    profileImageUrl?: string | null;
    alternateText?: string;
};
export function ProfileImage(properties: ProfileImageProperties) {
    let alternateText = 'Profile Image';
    if(properties.alternateText) {
        alternateText = properties.alternateText;
    }

    // When loading the user information, display nothing as a placeholder
    let shortHandMoniker = '';
    if(properties.alternateText) {
        const splitWords = properties.alternateText.split(' ');
        // If the alternate text is a username, use the first letter of the first word only, omitting the '@' symbol
        if(splitWords.length === 1 && properties.alternateText.includes('@')) {
            shortHandMoniker = properties.alternateText.charAt(1).toUpperCase();
        }
        // Otherwise, if the alternate text is a full name, use the first letter of each word
        else {
            shortHandMoniker = splitWords
                .map((word) => word[0])
                .join('')
                .toUpperCase();
        }
    }

    // Render the component
    return (
        <Avatar.Root>
            {properties.profileImageUrl && (
                <Avatar.Image asChild>
                    <Image
                        src={properties.profileImageUrl}
                        alt={alternateText}
                        className="h-full w-full object-cover"
                        fill
                    />
                </Avatar.Image>
            )}
            <Avatar.Fallback
                className="uppercase"
                // Delay the fallback text to prevent flickering when the image is loading
                delayMs={300}
            >
                {/* Fallback to the first letter of each word in the alternate text if there is no profile image. */}
                {shortHandMoniker}
            </Avatar.Fallback>
        </Avatar.Root>
    );
}

// Export - Default
export default ProfileImage;
