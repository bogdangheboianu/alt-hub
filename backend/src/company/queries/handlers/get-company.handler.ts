import { CompanyNotDefinedException } from '@company/exceptions/company.exceptions';
import { Company } from '@company/models/company';
import { GetCompanyQuery } from '@company/queries/impl/get-company.query';
import { CompanyRepository } from '@company/repositories/company.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetCompanyQuery )
export class GetCompanyHandler extends BaseQueryHandler<GetCompanyQuery, Company> {
    constructor(private readonly companyRepository: CompanyRepository) {
        super();
    }

    async execute(query: GetCompanyQuery): Promise<Result<Company>> {
        const company = await this.getCompany();

        if( company.isFailed ) {
            return this.failed( query, ...company.errors );
        }

        return this.successful( query, company.value! );
    }

    protected failed(query: GetCompanyQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetCompanyQuery, company: Company): Result<Company> {
        return Success( company );
    }

    private async getCompany(): Promise<Result<Company>> {
        const company = await this.companyRepository.get();

        if( company.isFailed ) {
            throw new Exception( company.errors );
        }

        if( company.isNotFound ) {
            return Failed( new CompanyNotDefinedException() );
        }

        return company;
    }
}
