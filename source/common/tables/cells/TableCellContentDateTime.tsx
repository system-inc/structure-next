// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Tip } from '@structure/source/common/popovers/Tip';

// Dependencies - Utilities
import { getTimeAgoString } from '@structure/source/utilities/Time';

// Component - TableCellContentDateTime
export interface TableCellContentDateTimeInterface extends React.HTMLAttributes<HTMLElement> {
    value: string | null;
}
export function TableCellContentDateTime(properties: TableCellContentDateTimeInterface) {
    let value = properties.value;
    let date = null;

    // If we have a value
    if(value) {
        // The date string can come in the format of "2024-03-27 14:50:25" (this is UTC time)
        // which is not recognized by the Date object
        // We need to convert it to "2024-03-27T14:50:25Z" to be recognized by the Date object
        let dateString = value;
        if(dateString.length === 19) {
            // Add the missing T and Z
            dateString = dateString.replace(' ', 'T') + 'Z';
        }

        // Create a date object
        date = new Date(dateString);
    }

    // Make sure the data is valid
    if(date !== null && isNaN(date.getTime())) {
        console.warn('Invalid date, something is wrong with the data');
        date = null;
    }

    // Prepare the formatted dates
    let formattedDateInLocalTime = '';
    let formattedDateInUtc = '';

    // If we have a date
    if(date !== null) {
        // Format the date in local time like: "2024-07-05 1:30 AM MDT"
        formattedDateInLocalTime = date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZoneName: 'short',
        });

        // The format from toLocaleString will be "MM/DD/YYYY, h:mm AM GMT-XX" (e.g., "07/05/2024, 1:30 AM GMT-6")
        // First, remove the comma to help with the conversion
        formattedDateInLocalTime = formattedDateInLocalTime.replace(',', '');

        // Splitting the date part and time part to rearrange them
        let [datePart, timePart, amPm, timeZone] = formattedDateInLocalTime.split(' ');
        let [month, day, year] = datePart!.split('/');

        // Reconstruct the date string in "YYYY-MM-DD h:mm A" format
        // If you decided to keep the timezone name (e.g., "MDT"), concatenate it back here.
        formattedDateInLocalTime = `${year}-${month}-${day} ${timePart} ${amPm} ${timeZone}`;

        // Format the date in UTC like: "2024-07-05 7:30 AM UTC"
        formattedDateInUtc = date.toUTCString();
    }

    // console.log(formattedDate);

    // Render the component
    return date !== null ? (
        <Tip
            className="p-1.5"
            content={
                <div className="flex flex-col space-y-1 text-xs">
                    <div>{properties.value}</div>
                    <div>
                        {date.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                            timeZoneName: 'longGeneric',
                        })}
                    </div>
                    {/* 5 minutes ago */}
                    <div>{getTimeAgoString(date.getTime())}</div>
                </div>
            }
        >
            {/* Format the date like: 2024-07-05 1:30 AM */}
            <span>{formattedDateInLocalTime}</span>
        </Tip>
    ) : (
        properties.value
    );
}

// Export - Default
export default TableCellContentDateTime;
