import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { CompanyPosition } from '@company/models/position/company-position';
import { CompanyPositionId } from '@company/models/position/company-position-id';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyPositionRepository {
    constructor(@InjectRepository( CompanyPositionEntity ) private readonly repository: Repository<CompanyPositionEntity>) {
    }

    @catchAsyncExceptions()
    async findAllCompanyPositions(): Promise<Result<CompanyPosition[]>> {
        const results = await this.repository.find();
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => CompanyPosition.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findById(id: CompanyPositionId): Promise<Result<CompanyPosition>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id: id.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : CompanyPosition.fromEntity( result );
    }
}
