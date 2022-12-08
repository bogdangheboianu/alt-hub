import { AnnualEmployeeSheetId } from '@fiscal/models/annual-employee-sheet-id';
import { FiscalYearId } from '@fiscal/models/fiscal-year-id';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { GetAllVacationsParamsDto } from '@vacations/dtos/get-all-vacations-params.dto';
import { IVacationsSelectionCriteria } from '@vacations/interfaces/vacations-selection-criteria.interface';
import { Vacation } from '@vacations/models/vacation';
import { GetAllVacationsQuery } from '@vacations/queries/impl/get-all-vacations.query';
import { VacationRepository } from '@vacations/repositories/vacation.repository';

@QueryHandler( GetAllVacationsQuery )
export class GetAllVacationsHandler extends BaseQueryHandler<GetAllVacationsQuery, Vacation[]> {
    constructor(private readonly vacationRepository: VacationRepository) {
        super();
    }

    async execute(query: GetAllVacationsQuery): Promise<Result<Vacation[]>> {
        const vacations = await this.getAllVacations( query );

        if( vacations.isFailed ) {
            return this.failed( query, ...vacations.errors );
        }

        return this.successful( query, vacations.value! );
    }

    protected failed(query: GetAllVacationsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllVacationsQuery, vacations: Vacation[]): Result<Vacation[]> {
        return Success( vacations );
    }

    private async getAllVacations(query: GetAllVacationsQuery): Promise<Result<Vacation[]>> {
        const { params } = query.data;
        const selectionCriteria = this.buildVacationsSelectionCriteria( params );

        if( selectionCriteria.isFailed ) {
            return Failed( ...selectionCriteria.errors );
        }

        const vacations = await this.vacationRepository.findAll( selectionCriteria.value! );

        if( vacations.isFailed ) {
            throw new Exception( vacations.errors );
        }

        if( vacations.isNotFound ) {
            return Success( [] );
        }

        return vacations;
    }

    private buildVacationsSelectionCriteria(params: GetAllVacationsParamsDto): Result<IVacationsSelectionCriteria> {
        return Result.aggregateObjects<IVacationsSelectionCriteria>(
            {
                fiscalYearId: valueIsEmpty( params.fiscalYearId )
                              ? Success( undefined )
                              : FiscalYearId.create( params.fiscalYearId, 'fiscalYearId' )
            },
            {
                annualEmployeeSheetId: valueIsEmpty( params.annualEmployeeSheetId )
                                       ? Success( undefined )
                                       : AnnualEmployeeSheetId.create( params.annualEmployeeSheetId, 'annualEmployeeSheetId' )
            }
        );
    }
}
