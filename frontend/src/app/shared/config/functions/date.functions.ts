import { valueIsEmpty } from '@shared/config/functions/value.functions';
import * as dayjs from 'dayjs';

export const isCurrentDate = (date: Date | string): boolean => {
    return dayjs( date )
        .isSame( dayjs() );
};

export const isPastDate = (date: Date | string): boolean => {
    return dayjs( date )
        .isBefore( dayjs() );
};

export const isPastOrCurrentDate = (date: Date | string): boolean => {
    return isCurrentDate( date ) || isPastDate( date );
};

export const isFutureDate = (date: Date | string): boolean => {
    return dayjs( date )
        .isAfter( dayjs() );
};

export const isFutureOrCurrentDate = (date: Date | string): boolean => {
    return isCurrentDate( date ) || isFutureDate( date );
};

export const isPastDateInterval = (fromDate: Date | string, toDate: Date | string): boolean => {
    return isPastDate( fromDate ) && isPastDate( toDate );
};

export const isFutureDateInterval = (fromDate: Date | string, toDate: Date | string): boolean => {
    return isFutureDate( fromDate ) && isFutureDate( toDate );
};

export const isOngoingDateInterval = (fromDate: Date | string, toDate: Date | string): boolean => {
    return isPastOrCurrentDate( fromDate ) && isFutureOrCurrentDate( toDate );
};

export const onlyDate = (value: Date | string): string => new Date( value ).toISOString();

export const readableDate = (value?: Date | null | string): string => {
    return valueIsEmpty( value )
           ? '-'
           : dayjs( value )
               .locale( 'en-US' )
               .format( 'MMMM D, YYYY' );
};

export const dateIsBetween = (date: Date | string, fromDate: Date | string, toDate: Date | string): boolean => {
    const dayjsDate = dayjs( date );
    const dayjsFromDate = dayjs( fromDate );
    const dayjsToDate = dayjs( toDate );
    const isAfterOrEqualFromDate = dayjsDate.isSame( dayjsFromDate ) || dayjsDate.isAfter( dayjsFromDate );
    const isBeforeOrEqualToDate = dayjsDate.isSame( dayjsToDate ) || dayjsDate.isBefore( dayjsToDate );
    return isAfterOrEqualFromDate && isBeforeOrEqualToDate;
};

export const datesAreEqual = (date1: Date | string, date2: Date | string): boolean => {
    date1 = new Date( date1 );
    date2 = new Date( date2 );

    return date1.getDate() === date2.getDate()
        && date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear();
};
