import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { EmployeeInfoEntity } from '@users/entities/employee-info.entity';
import { PersonalInfoEntity } from '@users/entities/personal-info.entity';
import { UserStatusEnum } from '@users/enums/user-status.enum';
import { Column, Entity } from 'typeorm';

@Entity( { name: 'users' } )
export class UserEntity extends BaseEntity {
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

    @Column( () => PersonalInfoEntity )
    personalInfo!: PersonalInfoEntity;

    @Column( () => EmployeeInfoEntity )
    employeeInfo!: EmployeeInfoEntity;
}
