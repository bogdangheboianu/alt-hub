import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@dtos/user-dto';

@Pipe( { name: 'userPhone', pure: true } )
export class UserPhonePipe implements PipeTransform {
    transform(value: UserDto): string {
        return value.personalInfo.phone;
    }

}
