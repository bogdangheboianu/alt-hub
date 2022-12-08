import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class EmploymentInfoEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    employeeId!: string;

    @ManyToOne( () => CompanyPositionEntity, companyPosition => companyPosition.users, { eager: true, nullable: false } )
    @JoinColumn( { name: 'company_position_id', referencedColumnName: 'id' } )
    companyPosition!: CompanyPositionEntity;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false } )
    hiredOn!: Date;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: true } )
    leftOn!: Date | null;
}
