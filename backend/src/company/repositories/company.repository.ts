import { CompanyEntity } from '@company/entities/company.entity';
import { Company } from '@company/models/company';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CompanyRepository {
    constructor(@InjectRepository( CompanyEntity ) private readonly repository: Repository<CompanyEntity>) {
    }

    @catchAsyncExceptions()
    async get(): Promise<Result<Company>> {
        const results = await this.repository.find();
        return valueIsEmpty( results )
               ? NotFound()
               : Company.fromEntity( results[0]! );
    }

    @catchAsyncExceptions()
    async save(company: Company, externalTransaction?: EntityManager): Promise<Result<Company>> {
        const entity = company.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );

        return Company.fromEntity( savedEntity );
    }
}
