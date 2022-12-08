import { Pipe, PipeTransform } from '@angular/core';
import { WeekDayNumericEnum } from '@shared/config/constants/shared.constants';
import * as dayjs from 'dayjs';

@Pipe( { name: 'readableWeekDays', pure: true } )
export class ReadableWeekDaysPipe implements PipeTransform {
    transform(value: WeekDayNumericEnum[]): string {
        return value.map( day => dayjs()
                        .day( day + 1 )
                        .format( 'ddd' ) )
                    .join( ', ' );
    }

}
