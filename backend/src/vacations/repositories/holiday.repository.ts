import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { HolidayEntity } from '@vacations/entities/holiday.entity';
import { Holiday } from '@vacations/models/holiday';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';
import { EntityManager, In, Not, Repository } from 'typeorm';

@Injectable()
export class HolidayRepository {
    constructor(
        @InjectRepository( HolidayEntity ) private readonly repository: Repository<HolidayEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAll(): Promise<Result<Holiday[]>> {
        const results = await this.repository.find();
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Holiday.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findAllWithWorkDays(): Promise<Result<Holiday[]>> {
        const results = await this.repository.find( {
                                                        where: {
                                                            weekDay: Not( In( [ WeekDayEnum.Saturday, WeekDayEnum.Sunday ] ) )
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Holiday.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async save(holiday: Holiday, externalTransaction?: EntityManager): Promise<Result<Holiday>> {
        const entity = holiday.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return Holiday.fromEntity( savedEntity );
    }

    @catchAsyncExceptions()
    async saveAll(holidays: Holiday[], externalTransaction?: EntityManager): Promise<Result<Holiday[]>> {
        const entities = holidays.map( wl => wl.toEntity() );
        const savedEntities = valueIsEmpty( externalTransaction )
                              ? await this.repository.save( entities )
                              : await externalTransaction.save( entities );

        return Result.aggregateResults( ...savedEntities.map( e => Holiday.fromEntity( e ) ) );
    }

    @catchAsyncExceptions()
    async deleteAll(externalTransaction?: EntityManager): Promise<void> {
        const entities = await this.repository.find();
        valueIsEmpty( externalTransaction )
        ? await this.repository.remove( entities )
        : await externalTransaction.remove( entities );
    }
}
