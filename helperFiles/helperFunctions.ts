import { EXERCISESETTYPE, ExerciseSetTypes } from "./helperTypes";

/**
 * Converts a UTC datetime string to a formatted New Zealand (NZ) local datetime string.
 *
 * @param utcDateTime - The UTC datetime string to convert (ISO 8601 format recommended).
 * @returns The formatted NZ local datetime string in 'dd/MM/yyyy, HH:mm' format.
 *
 * @example
 * ```typescript
 * const nzDateTime = convertUTCtoNZDateTime('2024-06-01T12:00:00Z');
 * // nzDateTime might be '02/06/2024, 00:00' depending on daylight saving
 * ```
 */
export const convertUTCtoNZDateTime = (utcDateTime: string): string => {
    console.log('UTC datetime BEFORE conversion to NZ datetime: ', utcDateTime);
    const date = new Date(utcDateTime);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Pacific/Auckland'
    };

    const formatted = new Intl.DateTimeFormat('en-NZ', options).format(date);

    console.log('UTC datetime AFTER conversion to NZ datetime: ', formatted);

    return formatted
}

/**
 * Converts a New Zealand date string in the format "DD/MM/YY" to a UTC ISO string.
 *
 * @param nzDateTime - The date string in "DD/MM/YY" format, representing a date in New Zealand local time.
 * @returns The corresponding UTC date-time as an ISO string.
 *
 * @remarks
 * - Assumes the input year is in the 2000s (e.g., "18" becomes 2018).
 * - Assumes the time is midnight (00:00) in NZ local time.
 * - Adjusts for New Zealand Standard Time (UTC+12).
 * - Does not account for daylight saving time.
 *
 * @example
 * ```typescript
 * convertNZDateTimetoUTC("16/05/18"); // returns "2018-05-15T12:00:00.000Z"
 * ```
 */
export const convertNZDateTimetoUTC = (nzDateTime: string): string => {
    // nzDateTime = "16/05/18"
    console.log('NZ datetime BEFORE conversion to UTC datetime: ', nzDateTime);
    const [day, month, year] = nzDateTime.split("/").map(Number);

    // Create a Date object in NZ local time
    const localDate = new Date(Date.UTC(year + 2000, month - 1, day, 0, 0));

    // Adjust for NZST offset (UTC+12)
    const utcDate = new Date(localDate.getTime() - 12 * 60 * 60 * 1000);

    // "2018-05-15T12:00:00.000Z"
    console.log('NZ datetime AFTER conversion to UTC datetime: ', utcDate.toISOString());

    return utcDate.toISOString();
}

/**
 * Converts a given string to title case, capitalizing the first letter of each word.
 *
 * @param str - The input string to be converted.
 * @returns The input string with the first letter of each word capitalized.
 */
export const toTitleCase = (str: string): string => {
    return str
        .split(' ')
        .map(word =>
            word.length > 0
                ? word[0].toUpperCase() + word.slice(1)
                : ''
        )
        .join(' ');
}

/**
 * Creates a comma-separated string from an array of items, converting each item's value to title case.
 *
 * @typeParam T - The type of the items in the array.
 * @param items - The array of items to process.
 * @param getValue - A function that extracts a string value from each item.
 * @returns A single string with each item's value in title case, separated by commas.
 */
export const createTitleCaseString = <T>(
    items: T[],
    getValue: (item: T) => string
): string => {
    return items
        .map(item => toTitleCase(getValue(item)))
        .join(', ');
};


/**
 * Retrieves the numeric ID corresponding to a given exercise set type label.
 * Object.entries() gives you an array of [key, value] pairs.
 *
 * @param label - The label of the exercise set type to look up.
 * @returns The numeric ID of the exercise set type if found, otherwise `undefined`.
 */
export const getExerciseSetTypeId = (label: EXERCISESETTYPE): number => {
    const entry = Object.entries(ExerciseSetTypes).find(([_, value]) => value.type === label);
    return entry ? parseInt(entry[0]) : 1;
};

export const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // if only minutes and is 0 return 0min
    // if only seconds and is 0 return 0min
    // if only seconds return 59s
    // if hours return 1h
    // if all return 1h 1min 1s
    if (seconds) {
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return '00:00'
}

/**
 * Takes in time as seconds and outputs a string in format
 * #hr #min #s
 * @param seconds 
 * @returns Formatted string broken into readable time
 */
export const formatTimerTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (seconds < 60) {
        return `${secs.toString()}s`
    }
    else if (seconds < 3600) {
        return `${mins.toString()}min ${secs.toString()}s`;
    }

    return `${hrs.toString()}hr ${mins.toString()}min ${secs.toString()}s`;
}