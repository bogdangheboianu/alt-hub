import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import * as dayjs from 'dayjs';

export const readableDate = (value?: Date | null): string => {
    return valueIsEmpty( value )
           ? '-'
           : dayjs( value )
               .format( 'MMMM D, YYYY' );
};
