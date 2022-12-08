import { Pipe, PipeTransform } from '@angular/core';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { startCase } from 'lodash-es';

@Pipe( { name: 'enumToSelectInputOptions', pure: true } )
export class EnumToSelectInputOptionsPipe implements PipeTransform {
    transform(value: object): SelectInputOptions {
        return Object.values( value )
                     .map( enumValue => (
                         {
                             id  : enumValue,
                             name: startCase( enumValue.replace( '_', ' ' ) )
                         }
                     ) );
    }

}
