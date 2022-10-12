import { Pipe, PipeTransform } from '@angular/core';
import { WeekDayEnum } from '@dtos/week-day.enum';
import * as dayjs from 'dayjs';

@Pipe( { name: 'readableWeekDays', pure: true } )
export class ReadableWeekDaysPipe implements PipeTransform {
    transform(value: WeekDayEnum[]): string {
        return value.map( day => dayjs()
                        .day( day + 1 )
                        .format( 'ddd' ) )
                    .join( ', ' );
    }

}
