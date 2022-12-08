import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column } from 'typeorm';

export class PersonalInfoEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false } )
    firstName!: string;

    @Column( { type: ColTypesEnum.Varchar, nullable: false } )
    lastName!: string;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false } )
    dateOfBirth!: Date;

    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    phone!: string;

    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    ssn!: string;

    @Column( { type: ColTypesEnum.Varchar, nullable: false } )
    address!: string;
}
