import { UserDto } from '@dtos/user-dto';
import { valueIsEmpty } from '@shared/config/functions/value.functions';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';

export const userFullName = (user?: UserDto | null): string => {
    if( valueIsEmpty( user ) ) {
        return '';
    }
    const firstName = user.personalInfo.firstName;
    const lastName = user.personalInfo.lastName;

    return `${ lastName } ${ firstName }`;
};

export const usersToSelectInputOptions = (users: UserDto[]): SelectInputOptions => users.map( user => (
    { id: user.id, name: userFullName( user ) }
) );
