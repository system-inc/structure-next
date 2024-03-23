// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Assets
import UserIcon from '@structure/assets/icons/people/UserIcon.svg';

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

    // Render the component
    return properties.profileImageUrl ? (
        // If there is a profile picture
        <Image src={properties.profileImageUrl} alt={alternateText} className="h-full w-full object-cover" fill />
    ) : (
        // If there is no profile picture
        <UserIcon className="h-full w-full" />
    );
}

// Export - Default
export default ProfileImage;
