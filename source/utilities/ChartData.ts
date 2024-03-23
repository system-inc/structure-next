// TODO: Rename this file

// Dependencies - Utilities
import {
    // Adding and subtracting time
    addHours,
    subHours,
    addDays,
    subDays,
    addMonths,
    subMonths,
    addYears,
    subYears,

    // Marking the start of a period
    startOfHour,
    startOfDay,
    startOfToday,
    startOfMonth,
    startOfYear,

    // Marking the end of a period
    endOfHour,
    endOfDay,
    endOfToday,
    endOfMonth,
    endOfYear,

    // Calculating the difference between two dates
    differenceInHours,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
} from 'date-fns';

import { TimeInterval } from '@project/source/graphql/generated/graphql';

// Fills in missing interval values with zeroes
export function fillMissingIntervalValuesWithZeroes(
    timeInterval: TimeInterval,
    data: [string, number][],
    startDate: Date,
    endDate?: Date,
): [string, number][] {
    // console.log(`Start date: ${startDate}, type: ${typeof startDate}`);
    // console.log(`End date: ${endDate}, type: ${typeof endDate}`);

    // If there is no end date, there is no need to fill in missing interval values (i.e., the date is a single day).
    if(!endDate) {
        return data;
    }

    // Determine the start and end interval values if not provided
    let startTimeIntervalValue = convertDateToTimeIntervalValue(startDate, timeInterval);
    let endTimeIntervalValue = convertDateToTimeIntervalValue(endDate, timeInterval);
    // console.log(`Start interval value: ${startIntervalValue}`);
    // console.log(`End interval value: ${endIntervalValue}`);

    if(!startTimeIntervalValue || !endTimeIntervalValue) {
        [startTimeIntervalValue, endTimeIntervalValue] = determineStartAndEndIntervalValues(data, timeInterval);
    }
    // console.log(`startIntervalValue: ${startIntervalValue}, endIntervalValue: ${endIntervalValue}`);

    // Generate a complete list of interval values between start and end
    const completeList = generateCompleteIntervalList(startTimeIntervalValue, endTimeIntervalValue, timeInterval);
    // console.log(`Complete list: ${completeList}`);

    // Merge original data with the complete list, filling in zeroes where needed
    const dataMap = new Map(data);
    const filledData: [string, number][] = completeList.map((timeIntervalValue) => {
        return [timeIntervalValue, dataMap.get(timeIntervalValue) ?? 0];
    });

    // Return the new dataset with missing intervals filled
    return filledData;
}

// Determine the start and end interval values
const determineStartAndEndIntervalValues = (data: [string, number][], interval: TimeInterval): [string, string] => {
    // Sort the data to get minimum and maximum values
    const sortedData = [...data].sort((a, b) => a[0].localeCompare(b[0]));
    return [sortedData[0]?.[0] ?? '', sortedData[sortedData.length - 1]?.[0] ?? ''];
};

const generateCompleteIntervalList = (
    startTimeIntervalValue: string,
    endTimeIntervalValue: string,
    timeInterval: TimeInterval,
): string[] => {
    // console.log(`Generating complete list from ${startIntervalValue} to ${endIntervalValue} with interval ${interval}`);
    const completeList: string[] = [];

    switch(timeInterval) {
        case TimeInterval.Year:
            for(let i = parseInt(startTimeIntervalValue, 10); i <= parseInt(endTimeIntervalValue, 10); i++) {
                completeList.push(i.toString());
            }
            break;
        case TimeInterval.Quarter:
            let currentYearForQuarter = parseInt(startTimeIntervalValue.split('-')[0]!, 10);
            let currentQuarter = parseInt(startTimeIntervalValue.split('-Q')[1]!, 10);

            let endYearForQuarter = parseInt(endTimeIntervalValue.split('-')[0]!, 10);
            let endQuarter = parseInt(endTimeIntervalValue.split('-Q')[1]!, 10);

            while(
                currentYearForQuarter < endYearForQuarter ||
                (currentYearForQuarter === endYearForQuarter && currentQuarter <= endQuarter)
            ) {
                completeList.push(`${currentYearForQuarter}-Q${currentQuarter}`);

                currentQuarter++;
                if(currentQuarter > 4) {
                    currentQuarter = 1;
                    currentYearForQuarter++;
                }
            }
            break;

        case TimeInterval.Month:
            let currentYearForMonth = parseInt(startTimeIntervalValue.split('-')[0]!, 10);
            let currentMonth = parseInt(startTimeIntervalValue.split('-')[1]!, 10);

            let endYearForMonth = parseInt(endTimeIntervalValue.split('-')[0]!, 10);
            let endMonth = parseInt(endTimeIntervalValue.split('-')[1]!, 10);

            while(
                currentYearForMonth < endYearForMonth ||
                (currentYearForMonth === endYearForMonth && currentMonth <= endMonth)
            ) {
                completeList.push(`${currentYearForMonth}-${currentMonth.toString().padStart(2, '0')}`);

                currentMonth++;
                if(currentMonth > 12) {
                    currentMonth = 1;
                    currentYearForMonth++;
                }
            }
            break;
        case TimeInterval.Day:
            let currentDate = new Date(startTimeIntervalValue);
            const endDate = new Date(endTimeIntervalValue);

            // Set to the very end of the day, this fixes an issue where the last day was not being included
            endDate.setHours(23, 59, 59, 999);

            while(currentDate <= endDate) {
                const dateString = currentDate.toISOString().split('T')[0] ?? '';
                completeList.push(dateString);

                currentDate.setDate(currentDate.getDate() + 1);
            }
            break;
        case TimeInterval.Hour:
            let currentHour = new Date(startTimeIntervalValue);
            const endHour = new Date(endTimeIntervalValue);

            // Set the endHour to the end of the hour (59 minutes, 59 seconds, 999 milliseconds)
            endHour.setMinutes(59);
            endHour.setSeconds(59);
            endHour.setMilliseconds(999);

            while(currentHour <= endHour) {
                // Return formatted as this: 2023-10-27 15:00:00
                const hourString = currentHour.toISOString().replace('T', ' ').substring(0, 13) + ':00:00';
                completeList.push(hourString);

                currentHour.setHours(currentHour.getHours() + 1);
            }
            break;
        case TimeInterval.MonthOfYear:
            // Assume a fixed list of months in a year, 01 to 12
            for(let i = 1; i <= 12; i++) {
                completeList.push(i.toString().padStart(2, '0'));
            }
            break;
        case TimeInterval.DayOfMonth:
            // Assume a fixed list of days in a month, 01 to 31
            for(let i = 1; i <= 31; i++) {
                completeList.push(i.toString().padStart(2, '0'));
            }
            break;
        case TimeInterval.DayOfWeek:
            // Assume a fixed list of days in a week, 0 (Sunday) to 6 (Saturday)
            for(let i = 0; i <= 6; i++) {
                completeList.push(i.toString());
            }

            break;
        case TimeInterval.HourOfDay:
            // Assume a fixed list of hours in a day, 00 to 23
            for(let i = 0; i <= 23; i++) {
                completeList.push(i.toString().padStart(2, '0'));
            }
            break;
        default:
            throw new Error('Invalid interval type: ' + timeInterval);
    }

    return completeList;
};

export function convertDateToTimeIntervalValue(date: Date, timeInterval: TimeInterval): string {
    // console.log(`Converting date ${date} (${typeof date}) to interval value with type ${intervalType}`);

    switch(timeInterval) {
        case TimeInterval.Year:
            return date.getFullYear().toString();
        case TimeInterval.Quarter:
            return `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
        case TimeInterval.Month:
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        case TimeInterval.Day:
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                .getDate()
                .toString()
                .padStart(2, '0')}`;
        case TimeInterval.Hour:
            return date.toString();
        case TimeInterval.MonthOfYear:
            return (date.getMonth() + 1).toString().padStart(2, '0');
        case TimeInterval.DayOfMonth:
            return date.getDate().toString().padStart(2, '0');
        case TimeInterval.DayOfWeek:
            return date.getDay().toString();
        case TimeInterval.HourOfDay:
            return date.getHours().toString().padStart(2, '0');
        default:
            throw new Error('Invalid interval type: ' + timeInterval);
    }
}

export function convertIntervalValueToDate(timeIntervalValue: string, timeIntervalType: TimeInterval): Date {
    // console.log(`Converting interval value ${timeIntervalValue} to date with type ${timeIntervalType}`);

    switch(timeIntervalType) {
        case TimeInterval.Year:
            return new Date(parseInt(timeIntervalValue, 10), 0, 1);
        case TimeInterval.Quarter:
            return new Date(
                parseInt(timeIntervalValue.split('-')[0]!, 10),
                (parseInt(timeIntervalValue.split('-Q')[1]!, 10) - 1) * 3,
                1,
            );
        case TimeInterval.Month:
            return new Date(
                parseInt(timeIntervalValue.split('-')[0]!, 10),
                parseInt(timeIntervalValue.split('-')[1]!, 10) - 1,
                1,
            );
        case TimeInterval.Day:
            return new Date(
                parseInt(timeIntervalValue.split('-')[0]!, 10),
                parseInt(timeIntervalValue.split('-')[1]!, 10) - 1,
                parseInt(timeIntervalValue.split('-')[2]!, 10),
            );
        case TimeInterval.Hour:
            let date = new Date(timeIntervalValue);
            // TODO: need to adjust this to client timezone
            // Get the hour in the local time zone, we multiply by 60000 to convert minutes to milliseconds
            const timeZoneOffset = date.getTimezoneOffset() * 60000;

            // Adjust the date to the local time zone
            const localDate = new Date(date.getTime() - timeZoneOffset);

            return localDate;
        case TimeInterval.MonthOfYear:
            return new Date(0, parseInt(timeIntervalValue, 10) - 1, 1);
        case TimeInterval.DayOfMonth:
            return new Date(0, 0, parseInt(timeIntervalValue, 10));
        case TimeInterval.DayOfWeek:
            return new Date(0, 0, parseInt(timeIntervalValue, 10));
        case TimeInterval.HourOfDay:
            return new Date(0, 0, 0, parseInt(timeIntervalValue, 10));
        default:
            throw new Error('Invalid interval type: ' + timeIntervalValue);
    }
}

/**
 * Calculates the range between two dates based on the specified interval.
 *
 * @param {Date} from - The start date of the range.
 * @param {Date} to - The end date of the range.
 * @param {string} timeInterval - The interval type ('hour', 'day', 'month', 'year').
 * @returns {number} The calculated range in the units of the specified interval.
 */
function calculateRange(from: Date, to: Date, timeInterval: string) {
    let range;
    switch(timeInterval) {
        case TimeInterval.Hour:
            range = to && from ? differenceInHours(endOfHour(to), startOfHour(from)) + 1 : 0;
            break;
        case TimeInterval.Day:
            range = to && from ? differenceInDays(endOfDay(to), startOfDay(from)) + 1 : 0;
            break;
        case TimeInterval.Month:
            range = to && from ? differenceInMonths(endOfMonth(to), startOfMonth(from)) + 1 : 0;
            break;
        case TimeInterval.Year:
            range = to && from ? differenceInYears(endOfYear(to), startOfYear(from)) + 1 : 0;
            break;
        default:
            throw new Error('Invalid time interval for range calculation.');
    }
    return range;
}

/**
 * Calculates the start and end date for a given time interval value
 * (e.g., 'day' and '2024-01-01' returns the start and end of the day).
 *
 * @param {string} timeIntervalValue - The interval value (e.g., '2024-01-01').
 * @param {string} timeInterval - The interval type ('hour', 'day', 'month', 'year').
 * @returns {startDate: Date, endDate: Date} The start and end date for the given time interval and time interval value.
 */
export function calculateTimeIntervalValueStartAndEndDate(timeIntervalValue: string, timeInterval: TimeInterval) {
    let startDate;
    let endDate;

    // Format the timeIntervalValue to a date
    const timeIntervalValueDate = convertIntervalValueToDate(timeIntervalValue, timeInterval);

    switch(timeInterval) {
        case TimeInterval.Hour:
            startDate = new Date(timeIntervalValueDate);
            endDate = addHours(startDate, 1);
            break;
        case TimeInterval.Day:
            startDate = new Date(timeIntervalValueDate);
            endDate = addDays(startDate, 1);
            break;
        case TimeInterval.Month:
            startDate = new Date(timeIntervalValueDate);
            endDate = addMonths(startDate, 1);
            break;
        case TimeInterval.Year:
            startDate = new Date(timeIntervalValueDate);
            endDate = addYears(startDate, 1);
            break;
        default:
            throw new Error('Invalid time interval for start and end date calculation.');
    }
    return { startDate, endDate };
}
