import { CompanyPosition } from '@company/models/position/company-position';
import { GetAllCompanyPositionsQuery } from '@company/queries/impl/company/get-all-company-positions.query';
import { CompanyPositionRepository } from '@company/repositories/company-position.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetAllCompanyPositionsQuery )
export class GetAllCompanyPositionsHandler extends BaseQueryHandler<GetAllCompanyPositionsQuery, CompanyPosition[]> {
    constructor(private readonly companyPositionRepository: CompanyPositionRepository) {
        super();
    }

    async execute(query: GetAllCompanyPositionsQuery): Promise<Result<CompanyPosition[]>> {
        const companyPositions = await this.getCompanyPositions();

        if( companyPositions.isFailed ) {
            return this.failed( query, ...companyPositions.errors );
        }

        return this.successful( query, companyPositions.value! );
    }

    protected failed(query: GetAllCompanyPositionsQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllCompanyPositionsQuery, companyPositions: CompanyPosition[]): Result<CompanyPosition[]> {
        return Success( companyPositions );
    }

    private async getCompanyPositions(): Promise<Result<CompanyPosition[]>> {
        const companyPositions = await this.companyPositionRepository.findAllCompanyPositions();

        if( companyPositions.isFailed ) {
            throw new Exception( companyPositions.errors );
        }

        if( companyPositions.isNotFound ) {
            return Success( [] );
        }

        return companyPositions;
    }
}
