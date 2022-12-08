import { ApiProperty } from '@nestjs/swagger';
import { UserStatusEnum } from '@users/enums/user-status.enum';

export class AccountDto {
    email!: string;
    username!: string;
    lastLoginAt!: Date | null;
    @ApiProperty( { enum: UserStatusEnum, enumName: 'UserStatusEnum' } )
    status!: UserStatusEnum;
    isAdmin!: boolean;
}
