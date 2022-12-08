import { FiscalYearNotFoundException } from '@fiscal/exceptions/fiscal-year.exceptions';
import { FiscalYear } from '@fiscal/models/fiscal-year';
import { GetCurrentFiscalYearQuery } from '@fiscal/queries/impl/get-current-fiscal-year.query';
import { FiscalYearRepository } from '@fiscal/repositories/fiscal-year.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetCurrentFiscalYearQuery )
export class GetCurrentFiscalYearHandler extends BaseQueryHandler<GetCurrentFiscalYearQuery, FiscalYear> {
    constructor(
        private readonly fiscalYearRepository: FiscalYearRepository
    ) {
        super();
    }

    async execute(query: GetCurrentFiscalYearQuery): Promise<Result<FiscalYear>> {
        const fiscalYear = await this.getCurrentFiscalYear();

        if( fiscalYear.isFailed ) {
            return this.failed( query, ...fiscalYear.errors );
        }

        return this.successful( query, fiscalYear.value! );
    }

    protected failed(query: GetCurrentFiscalYearQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetCurrentFiscalYearQuery, fiscalYear: FiscalYear): Result<FiscalYear> {
        return Success( fiscalYear );
    }

    private async getCurrentFiscalYear(): Promise<Result<FiscalYear>> {
        const fiscalYear = await this.fiscalYearRepository.findCurrent();

        if( fiscalYear.isFailed ) {
            throw new Exception( fiscalYear.errors );
        }

        if( fiscalYear.isNotFound ) {
            return Failed( new FiscalYearNotFoundException() );
        }

        return fiscalYear;
    }
}
