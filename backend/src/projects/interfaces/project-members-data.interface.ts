import { OptionalUserId } from '@users/models/optional-user-id';
import { User } from '@users/models/user';

export interface IProjectMembersData {
    members?: User[] | null;
    coordinatorUserId?: OptionalUserId;
}
