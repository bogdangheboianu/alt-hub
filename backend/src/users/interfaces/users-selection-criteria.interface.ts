import { UserStatus } from '@users/models/user-status';

export interface IUsersSelectionCriteria {
    statuses?: UserStatus[];
}
