import { FiscalYearEntity } from '@fiscal/entities/fiscal-year.entity';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { EntityManager, LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class FiscalYearRepository {
    constructor(@InjectRepository( FiscalYearEntity ) private readonly repository: Repository<FiscalYearEntity>) {
    }

    @catchAsyncExceptions()
    async findCurrent(): Promise<Result<FiscalYear>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              startDate: LessThan( new Date() ),
                                                              endDate  : MoreThan( new Date() )
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : FiscalYear.fromEntity( result );
    }

    @catchAsyncExceptions()
    async save(fiscalYear: FiscalYear, externalTransaction?: EntityManager): Promise<Result<FiscalYear>> {
        const entity = fiscalYear.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction!.save( entity );

        return FiscalYear.fromEntity( savedEntity );
    }
}
