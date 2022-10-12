import { Pipe, PipeTransform } from '@angular/core';
import { readableDate } from '@shared/functions/readable-date.function';

@Pipe( { name: 'readableDate', pure: true } )
export class ReadableDatePipe implements PipeTransform {
    transform(value?: Date | null): any {
        return readableDate( value );
    }

}
