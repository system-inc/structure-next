// Description: Constants for the support page

// Dependencies - React
import { useMemo } from "react";

// Dependencies - API
import { PublicProfile, SupportTicketStatus } from "@project/source/api/graphql";

// const ticketStatusOptions =
//     Object.values(SupportTicketStatus)
//         .filter((status) => status !== SupportTicketStatus.Deleted)
//         .map((status) => ({
//             value: status,
//             label: status,
//         }));

const ticketStatusOptions = [
    {
        value: SupportTicketStatus.Open,
        label: 'Open',
    },
    {
        value: SupportTicketStatus.Closed,
        label: 'Closed',
    },
]

function supportProfileOptions(supportProfiles: PublicProfile[]) {
    return useMemo(() => {
        return supportProfiles.map((profile) => {
            const profileImage =
                profile.images?.find((image) => image.variant === 'profile-image-small')?.url || '';
            return {
                label: profile.displayName,
                value: profile.username,
                image: profileImage,
            };
        });
    }, [supportProfiles]);
}

export { ticketStatusOptions, supportProfileOptions };