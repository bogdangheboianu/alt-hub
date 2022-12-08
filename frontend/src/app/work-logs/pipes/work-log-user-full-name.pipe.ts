import { Pipe, PipeTransform } from '@angular/core';
import { WorkLogDto } from '@dtos/work-log-dto';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';

@Pipe( { name: 'workLogUserFullName', pure: true } )
export class WorkLogUserFullNamePipe implements PipeTransform {
    transform(value: WorkLogDto): string {
        if( valueIsNotEmpty( value.user ) ) {
            const firstName = value.user.personalInfo.firstName;
            const lastName = value.user.personalInfo.lastName;

            return `${ lastName } ${ firstName }`;
        }

        return value.userFullName;
    }

}
