import { isDefined } from '@datorama/akita';
import { UserDto } from '@dtos/user.dto';

export const userFullName = (user: UserDto): string => {
    const firstName = user?.personalInfo?.firstName;
    const lastName = user?.personalInfo?.lastName;
    return isDefined( firstName ) && isDefined( lastName )
           ? `${ lastName } ${ firstName }`
           : '';
};
