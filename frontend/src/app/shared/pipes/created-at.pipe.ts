import { Pipe, PipeTransform } from '@angular/core';
import { AuditDto } from '@dtos/audit-dto';
import { readableDate } from '@shared/config/functions/date.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';

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
