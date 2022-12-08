import { AnnualEmployeeSheetEntity } from '@fiscal/entities/annual-employee-sheet.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { VacationStatusEnum } from '@vacations/enums/vacation-status.enum';
import { VacationTypeEnum } from '@vacations/enums/vacation-type.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity( 'vacations' )
export class VacationEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Enum, enum: VacationTypeEnum, nullable: false } )
    type!: VacationTypeEnum;

    @Column( { type: ColTypesEnum.Enum, enum: VacationStatusEnum, nullable: false } )
    status!: VacationStatusEnum;

    @Column( { type: ColTypesEnum.Varchar, nullable: true } )
    reason!: string | null;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false } )
    fromDate!: Date;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false } )
    toDate!: Date;

    @Column( { type: ColTypesEnum.Int, nullable: false } )
    workingDays!: number;

    @Column( { type: ColTypesEnum.Bool, nullable: false } )
    approved!: boolean;

    @ManyToOne( () => AnnualEmployeeSheetEntity, sheet => sheet.vacations, { eager: true } )
    @JoinColumn( { name: 'annual_employee_sheet_id', referencedColumnName: 'id' } )
    annualEmployeeSheet!: AnnualEmployeeSheetEntity;
}
