import dayjs from 'dayjs';

export const roFormatDate = (value: Date | string): string => {
    return dayjs( value )
        .format( 'DD.MM.YYYY' );
};
