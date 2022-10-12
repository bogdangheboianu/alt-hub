import { Token } from '@security/models/token/token';
import { User } from '@users/models/user';

export class SendInviteEmailDto {
    userRecipient!: User;
    accountConfirmationToken!: Token;
}
