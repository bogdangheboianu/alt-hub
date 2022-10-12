import { UserDto } from '@users/dtos/user.dto';

export class ProjectMembersDataDto {
    members!: UserDto[] | null;
    coordinatorUserId!: string | null;
}
