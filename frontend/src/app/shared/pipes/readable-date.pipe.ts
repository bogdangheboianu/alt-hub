import { Pipe, PipeTransform } from '@angular/core';
import { readableDate } from '@shared/config/functions/date.functions';

@Pipe( { name: 'readableDate', pure: true } )
export class ReadableDatePipe implements PipeTransform {
    transform(value?: Date | string | null): any {
        return readableDate( value );
    }

}
