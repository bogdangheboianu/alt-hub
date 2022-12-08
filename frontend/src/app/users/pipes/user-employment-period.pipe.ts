import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { readableDate } from '@shared/config/functions/date.functions';
import { valueIsEmpty } from '@shared/config/functions/value.functions';

@Pipe( { name: 'userEmploymentPeriod', pure: true } )
export class UserEmploymentPeriodPipe implements PipeTransform {
    transform(value?: UserDto | null): string {
        if( valueIsEmpty( value ) ) {
            return '-';
        }

        const employeeInfo = value.employmentInfo;
        const hiredOn = new Date( employeeInfo.hiredOn );
        const readableHiredOn = readableDate( employeeInfo.hiredOn );

        if( hiredOn.getDate() === new Date().getDate() ) {
            return 'Starts today';
        }

        if( hiredOn > new Date() ) {
            return `Starts on ${ readableHiredOn }`;
        }

        const readableLeftOn = valueIsEmpty( employeeInfo.leftOn )
                               ? 'Today'
                               : readableDate( employeeInfo.leftOn );

        return `${ readableHiredOn } - ${ readableLeftOn }`;
    }

}
