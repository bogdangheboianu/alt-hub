import { User } from '@users/models/user';

export interface IContext {
    correlationId: string;
    user?: User;
}
