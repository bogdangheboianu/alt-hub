import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { UserStatusEnum } from '@dtos/user-status-enum';

@Pipe( { name: 'userStatus', pure: true } )
export class UserStatusPipe implements PipeTransform {
    transform(value: UserDto): UserStatusEnum {
        return value.account.status;
    }

}
