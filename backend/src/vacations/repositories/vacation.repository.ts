import { AnnualEmployeeSheetId } from '@fiscal/models/annual-employee-sheet-id';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { Result } from '@shared/models/generics/result';
import { VacationEntity } from '@vacations/entities/vacation.entity';
import { IVacationsSelectionCriteria } from '@vacations/interfaces/vacations-selection-criteria.interface';
import { Vacation } from '@vacations/models/vacation';
import { VacationId } from '@vacations/models/vacation-id';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class VacationRepository {
    constructor(
        @InjectRepository( VacationEntity ) private readonly repository: Repository<VacationEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAll(selectionCriteria?: IVacationsSelectionCriteria): Promise<Result<Vacation[]>> {
        let searchConditions: any = {};

        if( valueIsNotEmpty( selectionCriteria ) ) {
            const { fiscalYearId, annualEmployeeSheetId, userId } = selectionCriteria;

            if( valueIsNotEmpty( fiscalYearId ) ) {
                searchConditions = {
                    ...searchConditions,
                    annualEmployeeSheet: {
                        fiscalYear: {
                            id: fiscalYearId.getValue()
                        }
                    }
                };
            }

            if( valueIsNotEmpty( annualEmployeeSheetId ) ) {
                searchConditions = {
                    ...searchConditions,
                    annualEmployeeSheet: {
                        id: annualEmployeeSheetId.getValue()
                    }
                };
            }

            if( valueIsNotEmpty( userId ) ) {
                searchConditions = {
                    ...searchConditions,
                    annualEmployeeSheet: {
                        user: {
                            id: userId.getValue()
                        }
                    }
                };
            }
        }

        const results = await this.repository.find( {
                                                        where: searchConditions,
                                                        order: {
                                                            fromDate: 'ASC'
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Vacation.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findByIdAndAnnualEmployeeSheetId(id: VacationId, annualEmployeeSheetId: AnnualEmployeeSheetId): Promise<Result<Vacation>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id                 : id.getValue(),
                                                              annualEmployeeSheet: {
                                                                  id: annualEmployeeSheetId.getValue()
                                                              }
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : Vacation.fromEntity( result );
    }

    @catchAsyncExceptions()
    async save(vacation: Vacation, externalTransaction?: EntityManager): Promise<Result<Vacation>> {
        const entity = vacation.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return Vacation.fromEntity( savedEntity );
    }
}
