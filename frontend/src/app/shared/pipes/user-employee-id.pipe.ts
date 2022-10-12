import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@dtos/user.dto';

@Pipe( { name: 'userEmployeeId', pure: true } )
export class UserEmployeeIdPipe implements PipeTransform {
    transform(value: UserDto): string {
        return value.employeeInfo.employeeId;
    }

}
