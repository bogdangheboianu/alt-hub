import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserStatusEnum } from '@users/enums/user-status.enum';
import { Column } from 'typeorm';

export class AccountEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    email!: string;

    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    username!: string;

    @Column( { type: ColTypesEnum.Varchar } )
    password!: string;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: true } )
    lastLoginAt!: Date | null;

    @Column( { type: ColTypesEnum.Enum, enum: UserStatusEnum } )
    status!: UserStatusEnum;

    @Column( { type: ColTypesEnum.Bool, nullable: false } )
    isAdmin!: boolean;
}
