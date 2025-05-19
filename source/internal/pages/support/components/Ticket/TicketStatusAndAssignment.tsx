// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
// import { Button } from '@project/source/ui/base/Button';
import Button from '@structure/source/common/buttons/Button';
import ProfileImage from '@structure/source/modules/account/components/ProfileImage';
import { Popover } from '@structure/source/common/popovers/Popover';
import { InputSelect } from '@structure/source/common/forms/InputSelect';
import { BorderContainer } from '../BorderContainer';

// Dependencies - Hooks
// import { useSupportTicketAssign } from '../../hooks/useSupportTicketAssign';

// Dependencies - Assets
import {
    Star,
    Circle,
    PlusCircle,
} from '@phosphor-icons/react';

// Dependencies - API
import {
    SupportAllSupportProfilesQuery,
    SupportTicketsPrivilegedQuery,
    SupportTicketStatus,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Constants
import { ticketStatusOptions } from '@structure/source/internal/pages/support/constants';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - TicketStatusAndAssignment
export interface TicketStatusAndAssignmentInterface {
    ticketId: string;
    ticketStatus: SupportTicketStatus;
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles'];
    isLoadingProfiles: boolean;
    assignedToProfile: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['assignedToProfile'];
    onTicketStatusChange: ({ ticketId, status }: { ticketId: string; status: SupportTicketStatus; }) => void;
    onTicketAssignSupportProfile: ({ ticketId, supportProfileUsername }: {
        ticketId: string;
        supportProfileUsername: string;
    }) => void;
}
export function TicketStatusAndAssignment(properties: TicketStatusAndAssignmentInterface) {
    // Properties
    const {
        ticketId,
        ticketStatus,
        supportProfiles,
        isLoadingProfiles,
        assignedToProfile,
        onTicketStatusChange,
        onTicketAssignSupportProfile,
    } = properties;

    const supportProfileOptions = React.useMemo(() => {
        if (!supportProfiles) return [];

        const options =
            supportProfiles
                .filter((profile) => profile.username !== assignedToProfile?.username)
                .map((profile) => {
                    const profileImage = profile.images?.find((img) => img.variant === 'profile-image-small')?.url || '';
                    return {
                        label: profile.displayName ?? profile.username,
                        value: profile.username,
                        image: profileImage,
                    };
                });

        return options;
    }, [supportProfiles, assignedToProfile?.username]);

    const assignedProfile = React.useMemo(() => {
        if (!assignedToProfile) return undefined;
        const profileImage = assignedToProfile.images?.find((img) => img.variant === 'profile-image-small')?.url || '';
        return {
            label: assignedToProfile.displayName ?? assignedToProfile.username,
            value: assignedToProfile.username,
            image: profileImage,
        };
    }, [assignedToProfile]);

    // Render the component
    return (
        <BorderContainer>
            <div className="flex items-center gap-4 w-[140px]">

                {/* Ticket Status */}
                <div className="flex items-center gap-2">
                    <Circle
                        className={mergeClassNames(
                            'h-4 w-4',
                            ticketStatus === SupportTicketStatus.Open ? 'text-[--global-blue-600]' : 'text-[--global-red-600]',
                        )}
                    />
                    <p className="text-sm font-medium text-opsis-content-primary">
                        {ticketStatus === SupportTicketStatus.Open ? 'Open' : 'Closed'}
                    </p>
                </div>

                {/* Ticket Assignment */}
                <Popover
                    align="start"
                    content={
                        <div className="flex flex-col gap-1 w-48">
                            {supportProfileOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() =>
                                        onTicketAssignSupportProfile({
                                            ticketId,
                                            supportProfileUsername: option.value,
                                        })
                                    }
                                    className={mergeClassNames(
                                        "flex items-center gap-2 px-3 mt-2 hover:bg-muted rounded text-left last:mb-2",
                                        assignedToProfile?.username === option.value ? "bg-muted" : ""
                                    )}
                                >
                                    <div className="relative h-8 w-8">
                                        <ProfileImage
                                            profileImageUrl={option.image}
                                            alternateText={option.label}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                    <span className="text-sm">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    }
                >
                    <Button
                        icon={!assignedProfile ? PlusCircle : undefined}
                        iconPosition={!assignedProfile ? 'left' : undefined}
                        loading={isLoadingProfiles}
                    >
                        {assignedProfile ? (
                            <div className="flex items-center gap-2">
                                <span>Assigned To:</span>
                                <div className="relative h-6 w-6">
                                    <ProfileImage
                                        profileImageUrl={assignedProfile.image}
                                        alternateText={assignedProfile.label}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>
                                <span className="text-sm">{assignedProfile.label}</span>
                            </div>
                        ) : 'Assign Person'}
                    </Button>
                </Popover>

                {/* Ticket Status Update */}
                <Button
                    variant="light"
                    onClick={
                        async function () {
                            onTicketStatusChange({
                                ticketId,
                                status: ticketStatus === SupportTicketStatus.Open
                                    ? SupportTicketStatus.Closed
                                    : SupportTicketStatus.Open,
                        });
                        }
                    }
                >
                    {ticketStatus === SupportTicketStatus.Open ? 'Close Ticket' : 'Reopen Ticket'}
                </Button>
            </div>

            {/* Star Icon */}
            <Button
                variant="ghost"
                size="icon"
                className="focus:border-0"
                icon={Star}
                onClick={async function () {
                    alert('Star clicked');
                }}
            />
        </BorderContainer>
    );
}