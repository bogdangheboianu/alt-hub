import { TokenPurposeEnum } from '@security/enums/token/token-purpose.enum';
import { User } from '@users/models/user';

export class GenerateTokenDto {
    value!: string;
    purpose!: TokenPurposeEnum;
    validForMinutes?: number;
    user?: User;
}
