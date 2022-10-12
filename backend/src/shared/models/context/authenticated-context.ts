import { IContext } from '@shared/interfaces/generics/context.interface';
import { User } from '@users/models/user';

export class AuthenticatedContext implements IContext {
    correlationId: string;
    user: User;

    constructor(correlationId: string, user: User) {
        this.correlationId = correlationId;
        this.user = user;
    }
}
