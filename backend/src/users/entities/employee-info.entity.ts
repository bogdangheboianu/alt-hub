import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class EmployeeInfoEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    employeeId!: string;

    @ManyToOne( () => CompanyPositionEntity, companyPosition => companyPosition.users, { eager: true, nullable: false } )
    @JoinColumn( { name: 'company_position_id', referencedColumnName: 'id' } )
    companyPosition!: CompanyPositionEntity;

    @Column( { type: ColTypesEnum.Date, nullable: false } )
    hiredOn!: Date;

    @Column( { type: ColTypesEnum.Date, nullable: true } )
    leftOn!: Date | null;
}
