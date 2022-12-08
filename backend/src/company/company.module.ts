import { CreateCompanyPositionHandler } from '@company/commands/handlers/create-company-position.handler';
import { CreateCompanyPricingProfileHandler } from '@company/commands/handlers/create-company-pricing-profile.handler';
import { CompanyController } from '@company/controllers/company.controller';
import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { CompanyPricingProfileEntity } from '@company/entities/company-pricing-profile.entity';
import { CompanyEntity } from '@company/entities/company.entity';
import { GetCompanyHandler } from '@company/queries/handlers/get-company.handler';
import { CompanyPositionRepository } from '@company/repositories/company-position.repository';
import { CompanyPricingProfileRepository } from '@company/repositories/company-pricing-profile.repository';
import { CompanyRepository } from '@company/repositories/company.repository';
import { CompanyService } from '@company/services/company.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

const Entities = [
    CompanyEntity,
    CompanyPositionEntity,
    CompanyPricingProfileEntity
];

const Repositories = [
    CompanyRepository,
    CompanyPositionRepository,
    CompanyPricingProfileRepository
];

const Services = [
    CompanyService
];

const Controllers = [
    CompanyController
];

const CommandHandlers = [
    CreateCompanyPositionHandler,
    CreateCompanyPricingProfileHandler
];

const QueryHandlers = [
    GetCompanyHandler
];

const Exports = [
    CompanyRepository,
    CompanyPositionRepository,
    CompanyPricingProfileRepository
];

@Module( {
             controllers: [ ...Controllers ],
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule
             ],
             providers  : [
                 ...Repositories,
                 ...Services,
                 ...CommandHandlers,
                 ...QueryHandlers
             ],
             exports    : [ ...Exports ]
         } )
export class CompanyModule {
}
