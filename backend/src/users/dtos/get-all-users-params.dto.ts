import { UserStatusEnum } from '@users/enums/user-status.enum';
import { Transform } from 'class-transformer';

export class GetAllUsersParamsDto {
    @Transform( ({ value }) => value.trim()
                                    .split( ',' ) )
    statuses?: UserStatusEnum[];
}
