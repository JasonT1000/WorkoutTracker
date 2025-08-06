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