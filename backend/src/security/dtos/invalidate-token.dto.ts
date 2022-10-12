import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { Token } from '@security/models/token/token';

export class InvalidateTokenDto {
    token!: Token;
    nonActiveStatus!: TokenStatusEnum;
}
