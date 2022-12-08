import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@dtos/user-dto';

@Pipe( { name: 'userEmail', pure: true } )
export class UserEmailPipe implements PipeTransform {
    transform(value: UserDto): string {
        return value.account.email;
    }

}
