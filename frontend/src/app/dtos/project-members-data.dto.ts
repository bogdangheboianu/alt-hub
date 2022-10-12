import { UserDto } from '@dtos/user.dto';

export class ProjectMembersDataDto {
    members!: UserDto[];
    coordinatorUserId!: string | null;
}
