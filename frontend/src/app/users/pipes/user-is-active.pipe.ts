import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@dtos/user-dto';
import { UserStatusEnum } from '@dtos/user-status-enum';

@Pipe( { name: 'userIsActive', pure: true } )
export class UserIsActivePipe implements PipeTransform {
    transform(value: UserDto): boolean {
        return value.account.status === UserStatusEnum.Active;
    }

}
