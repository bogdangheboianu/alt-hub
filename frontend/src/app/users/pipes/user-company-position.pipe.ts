import { Pipe, PipeTransform } from '@angular/core';
import { CreateUserDto } from '@dtos/create-user-dto';
import { UserDto } from '@dtos/user-dto';

@Pipe( { name: 'userCompanyPosition', pure: true } )
export class UserCompanyPositionPipe implements PipeTransform {
    transform(value: UserDto | CreateUserDto): string {
        return (
            value as UserDto
        ).employmentInfo.companyPosition?.name ?? '';
    }

}
