import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { CreateHolidayDto } from '@vacations/dtos/create-holiday.dto';
import { HolidayEntity } from '@vacations/entities/holiday.entity';
import { IHoliday } from '@vacations/interfaces/holiday.interface';
import { HolidayId } from '@vacations/models/holiday-id';
import { HolidayName } from '@vacations/models/holiday-name';
import { WeekDay } from '@work-logs/models/week-day';

export class Holiday implements IDomainModel<Holiday, HolidayEntity> {
    id: HolidayId;
    name: HolidayName;
    date: MandatoryDate;
    weekDay: WeekDay;
    audit: Audit;

    private constructor(data: IHoliday) {
        this.id = data.id ?? HolidayId.generate();
        this.name = data.name;
        this.date = data.date;
        this.weekDay = data.weekDay;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(data: CreateHolidayDto): Result<Holiday> {
        const buildData = Result.aggregateObjects<Omit<IHoliday, 'id' | 'audit'>>(
            { name: HolidayName.create( data.name ) },
            { date: MandatoryDate.create( data.date, 'date' ) },
            { weekDay: WeekDay.create( data.weekDay ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Holiday( buildData.value! ) );
    }

    static fromEntity(entity: HolidayEntity): Result<Holiday> {
        const data = Result.aggregateObjects<IHoliday>(
            { id: HolidayId.create( entity.id ) },
            { name: HolidayName.create( entity.name ) },
            { date: MandatoryDate.create( entity.date, 'date' ) },
            { weekDay: WeekDay.create( entity.weekDay ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Holiday( data.value! ) );
    }

    equals(to: Holiday): boolean {
        return this.id.equals( to.id ) || this.date.equals( to.date );
    }

    toEntity(): HolidayEntity {
        return entityFactory( HolidayEntity, {
            id     : this.id.getValue(),
            name   : this.name.getValue(),
            date   : this.date.getValue(),
            weekDay: this.weekDay.getValue(),
            audit  : this.audit.toEntity()
        } );
    }
}
