import { UserStatusEnum } from '@dtos/user-status.enum';

export class GetAllUsersParamsDto {
    statuses?: UserStatusEnum[];
}
