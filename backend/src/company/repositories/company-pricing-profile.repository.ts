import { CompanyPricingProfileEntity } from '@company/entities/company-pricing-profile.entity';
import { CompanyPricingProfile } from '@company/models/company-pricing-profile';
import { CompanyPricingProfileId } from '@company/models/company-pricing-profile-id';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyPricingProfileRepository {
    constructor(@InjectRepository( CompanyPricingProfileEntity ) private readonly repository: Repository<CompanyPricingProfileEntity>) {
    }

    @catchAsyncExceptions()
    async findById(id: CompanyPricingProfileId): Promise<Result<CompanyPricingProfile>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id: id.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : CompanyPricingProfile.fromEntity( result! );
    }
}
