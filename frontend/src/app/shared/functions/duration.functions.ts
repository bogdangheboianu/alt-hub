import { isNumber } from '@datorama/akita';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import * as dayjs from 'dayjs';

export const minutesToReadableTime = (minutes: number): string => {
    const duration = dayjs.duration( minutes, 'minutes' );
    const hrFormat = 'H[h]';
    const minFormat = 'm[m]';
    const durationFormat = duration.get( 'hours' ) === 0
                           ? minFormat
                           : duration.get( 'minutes' ) === 0
                             ? hrFormat
                             : `${ hrFormat } ${ minFormat }`;

    return duration.format( durationFormat );
};

export const timeStringToMinutes = (time?: string | null): number | null => {
    if( valueIsEmpty( time ) ) {
        return null;
    }

    time = time.trim()
               .toLowerCase();

    const includesMinutes = time.includes( 'm' );
    const includesHours = time.includes( 'h' );
    const includesHoursAndMinutes = includesHours && includesMinutes;

    if( includesHoursAndMinutes ) {
        const [ hours ] = time.split( 'h' );
        const minutes = time.split( 'h' )[1].replace( 'm', '' );

        if( isNumber( hours ) && isNumber( minutes ) ) {
            return ~~(
                Number( hours ) * 60
            ) + Number( minutes );
        }
    }

    if( includesMinutes ) {
        const minutes = time.replace( 'm', '' );

        if( isNumber( minutes ) ) {
            return Number( minutes );
        }
    }

    if( includesHours ) {
        const hours = time.replace( 'h', '' );

        if( isNumber( hours ) ) {
            return Number( hours ) * 60;
        }
    }

    return null;
};
