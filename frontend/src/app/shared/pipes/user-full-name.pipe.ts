import { Pipe, PipeTransform } from '@angular/core';
import { CreateUserDto } from '@dtos/create-user.dto';
import { UserDto } from '@dtos/user.dto';

@Pipe( { name: 'userFullName', pure: true } )
export class UserFullNamePipe implements PipeTransform {
    transform(value: UserDto | CreateUserDto): string {
        const firstName = value.personalInfo.firstName;
        const lastName = value.personalInfo.lastName;

        return `${ lastName } ${ firstName }`;
    }

}
