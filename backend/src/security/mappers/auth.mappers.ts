import { IAccessTokenPayload } from '@security/interfaces/access-token-payload.interface';
import { User } from '@users/models/user';

export const userToAccessTokenPayload = (user: User): IAccessTokenPayload => (
    {
        sub            : user.id.getValue(),
        email          : user.account.email.getValue(),
        username       : user.account.username.getValue(),
        fullName       : user.personalInfo.fullName.joined,
        companyPosition: user.employmentInfo.companyPosition?.name.getValue() ?? null
    }
);
