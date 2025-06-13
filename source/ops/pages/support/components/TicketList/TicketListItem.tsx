// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import { formatDateWithTimeIfToday } from '@structure/source/utilities/Time';

// Dependencies - Animations
import { useSpring, animated } from '@react-spring/web';

// Component - TicketListItem
export interface TicketListItemProperties {
    ticket: {
        identifier: string;
        userEmailAddress: string;
        title: string;
        answered: boolean;
        createdAt: string;
        comments: {
            content: string;
        }[];
    };
    isSelected: boolean;
    isFirst: boolean;
    onSelect: (identifier: string) => void;
}
export function TicketListItem(properties: TicketListItemProperties) {
    // Properties

    // const isFirst = properties.isFirst;

    const lastTicketComment = properties.ticket.comments[properties.ticket.comments.length - 1];
    const createdAtDate = new Date(properties.ticket.createdAt);

    // Hooks
    const pulsatingRingAnimation = useSpring({
        loop: true,
        to: [
            { opacity: 0.5, transform: 'scale(1.5)' },
            { opacity: 0, transform: 'scale(2)' },
        ],
        from: { opacity: 0.5, transform: 'scale(1)' },
        config: { duration: 1000 },
    });

    // Render the component
    return (
        <div
            className={`relative mx-4 my-3 cursor-pointer rounded-lg py-3 pl-12 pr-3 hover:bg-light-1 active:bg-light-1 dark:active:bg-dark-2 ${
                properties.isSelected
                    ? 'bg-light-1 dark:bg-dark-2'
                    : 'border-light-3 dark:border-dark-3 dark:hover:bg-dark-1'
            }`}
            onClick={() => properties.onSelect(properties.ticket.identifier)}
        >
            {!properties.ticket.answered && (
                <div className="absolute left-5 top-[18px] flex items-center justify-center">
                    {/* Growing and fading ring */}
                    <animated.div
                        style={pulsatingRingAnimation}
                        className="absolute h-2 w-2 rounded-full border border-blue"
                    />

                    {/* Static inner circle */}
                    <span className="relative h-2 w-2 rounded-full bg-blue" />
                </div>
            )}

            {/* <div className="mb-1.5 flex items-center justify-between">
                <p className="neutral text-xs">{ticket.userEmailAddress}</p>
                <p className="neutral text-xs">{formatDateWithTimeIfToday(createdAtDate)}</p>
            </div> */}
            <div className="mb-1 flex items-center justify-between">
                <h4 className="text-sm font-medium">{properties.ticket.title}</h4>
                <p className="text-xs font-medium text-opsis-content-tetriary">
                    {formatDateWithTimeIfToday(createdAtDate)}
                </p>
            </div>
            {/* <p className="text-xs text-opsis-content-tetriary font-medium">
                {ticket.userEmailAddress}
            </p> */}
            {lastTicketComment?.content && (
                <p className="neutral mt-1.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
                    {extractLatestEmailContent(lastTicketComment?.content)}
                </p>
            )}
        </div>
    );
}
