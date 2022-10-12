import { IAccessTokenPayload } from '@security/interfaces/access-token-payload.interface';
import { User } from '@users/models/user';

export const userToAccessTokenPayload = (user: User): IAccessTokenPayload => (
    {
        sub            : user.id.getValue(),
        email          : user.personalInfo.email.getValue(),
        username       : user.username.getValue(),
        fullName       : user.personalInfo.fullName.joined,
        companyPosition: user.employeeInfo.companyPosition?.name.getValue() ?? null
    }
);
