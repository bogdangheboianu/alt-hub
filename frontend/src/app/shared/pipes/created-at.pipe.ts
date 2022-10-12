import { Pipe, PipeTransform } from '@angular/core';
import { AuditDto } from '@dtos/audit.dto';
import { readableDate } from '@shared/functions/readable-date.function';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';

@Pipe( { name: 'createdAt', pure: true } )
export class CreatedAtPipe implements PipeTransform {
    transform(value?: any | null): any {
        return valueIsEmpty( value ) || !Object.keys( value )
                                               .some( k => k === 'audit' )
               ? '-'
               : readableDate( (
                                   value.audit as AuditDto
                               ).createdAt );
    }

}
