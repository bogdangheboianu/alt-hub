import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { arrayQueryParamTransform } from '@shared/functions/array-query-param-transform.function';
import { UserStatusEnum } from '@users/enums/user-status.enum';
import { Transform } from 'class-transformer';

@ApiExtraModels()
export class GetAllUsersParamsDto {
    @Transform( arrayQueryParamTransform )
    @ApiProperty( { enum: UserStatusEnum, enumName: 'UserStatusEnum', nullable: true } )
    statuses?: UserStatusEnum[];
}
