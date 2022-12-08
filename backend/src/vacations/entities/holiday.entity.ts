import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';
import { Column, Entity } from 'typeorm';

@Entity( 'holidays' )
export class HolidayEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false, unique: true } )
    name!: string;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: false, unique: true } )
    date!: Date;

    @Column( { type: ColTypesEnum.Enum, enum: WeekDayEnum, nullable: false } )
    weekDay!: WeekDayEnum;
}
