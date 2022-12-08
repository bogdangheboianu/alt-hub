import { Pipe, PipeTransform } from '@angular/core';
import { minutesToReadableTime } from '@shared/config/functions/duration.functions';

@Pipe( { name: 'minutesToReadableTime', pure: true } )
export class MinutesToReadableTimePipe implements PipeTransform {
    transform(value: number): string {
        return minutesToReadableTime( value );
    }

}
