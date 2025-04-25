// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import { formatDateWithTimeIfToday } from '@structure/source/utilities/Time';

// Dependencies - Animations
import { useSpring, animated } from '@react-spring/web';

// Component - TicketListItem
export interface TicketListItemInterface {
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
export function TicketListItem(properties: TicketListItemInterface) {

    // Properties
    const {
        ticket,
        isSelected,
        isFirst,
        onSelect,
    } = properties;

    const lastTicketComment = ticket.comments[ticket.comments.length - 1];
    const createdAtDate = new Date(ticket.createdAt);

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
            className={`relative cursor-pointer my-3 mx-4 py-3 pl-12 pr-3 rounded-lg transition-colors hover:bg-light-1 active:bg-light-1 dark:active:bg-dark-2 ${
                isSelected ? 'bg-light-1 dark:bg-dark-2' : 'border-light-3 dark:border-dark-3 dark:hover:bg-dark-1'
            }`}
            onClick={() => onSelect(ticket.identifier)}
        >
            { !ticket.answered && (
                <div className="absolute top-[18px] left-5 flex items-center justify-center">
                    {/* Growing and fading ring */}
                    <animated.div
                        style={pulsatingRingAnimation}
                        className="absolute w-2 h-2 rounded-full border border-blue"
                    />
                    
                    {/* Static inner circle */}
                    <span className="relative w-2 h-2 rounded-full bg-blue" />
                </div>
            )}
            
            {/* <div className="mb-1.5 flex items-center justify-between">
                <p className="neutral text-xs">{ticket.userEmailAddress}</p>
                <p className="neutral text-xs">{formatDateWithTimeIfToday(createdAtDate)}</p>
            </div> */}
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium">{ticket.title}</h4>
                <p className="text-xs text-opsis-content-tetriary font-medium">{formatDateWithTimeIfToday(createdAtDate)}</p>
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
