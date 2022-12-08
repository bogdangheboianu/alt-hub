import { Pipe, PipeTransform } from '@angular/core';
import { startCase } from 'lodash-es';

@Pipe( { name: 'startCase', pure: true } )
export class StartCasePipe implements PipeTransform {
    transform(value: string): any {
        return startCase( value );
    }

}
