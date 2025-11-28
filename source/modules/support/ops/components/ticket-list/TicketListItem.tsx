// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputCheckbox } from '@structure/source/components/forms-new/fields/checkbox/InputCheckbox';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { extractLatestEmailContent } from '@structure/source/utilities/email/Email';
import { dateToTimeIfTodayOrDate } from '@structure/source/utilities/time/Time';

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
            source?: string;
        }[];
    };
    isSelected: boolean;
    isChecked: boolean;
    isFirst: boolean;
    onSelect: (identifier: string) => void;
    onCheckboxChange: () => void;
}
export function TicketListItem(properties: TicketListItemProperties) {
    // Properties
    const firstTicketComment = properties.ticket.comments.find(function (comment) {
        return comment.content && comment.content !== 'null';
    });
    const createdAtDate = new Date(properties.ticket.createdAt);

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'group relative flex h-16 cursor-pointer items-center gap-3 px-3 select-none hover:background--2',
                properties.isSelected
                    ? 'background--3 active:background--4'
                    : properties.isChecked
                      ? 'background--2 hover:background--1 active:background--3 dark:background--2 dark:hover:background--1 dark:active:background--3'
                      : 'hover:background--1 active:background--3',
            )}
            onClick={function () {
                properties.onSelect(properties.ticket.identifier);
            }}
        >
            {/* Checkbox */}
            <InputCheckbox
                variant="A"
                isChecked={properties.isChecked}
                onIsCheckedChange={properties.onCheckboxChange}
                onClick={function (event) {
                    event.stopPropagation();
                }}
                aria-label={`Select ticket ${properties.ticket.title}`}
            />

            {/* Ticket content */}
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                    <h4
                        className={mergeClassNames(
                            'truncate text-sm',
                            properties.ticket.answered ? 'font-normal' : 'font-medium',
                        )}
                    >
                        {properties.ticket.title}
                    </h4>
                    <span className="shrink-0 text-xs content--2">{dateToTimeIfTodayOrDate(createdAtDate)}</span>
                </div>
                {firstTicketComment?.content && (
                    <p className="overflow-hidden text-xs text-ellipsis whitespace-nowrap content--1">
                        {extractLatestEmailContent(firstTicketComment.content)}
                    </p>
                )}
            </div>
        </div>
    );
}
