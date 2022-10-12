import { AddPositionToCompanyHandler } from '@company/commands/handlers/position/add-position-to-company.handler';
import { CompanyController } from '@company/controllers/company.controller';
import { CompanyEntity } from '@company/entities/company.entity';
import { GetCompanyHandler } from '@company/queries/handlers/company/get-company.handler';
import { CompanyPositionRepository } from '@company/repositories/company-position.repository';
import { CompanyRepository } from '@company/repositories/company.repository';
import { CompanyService } from '@company/services/company.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPositionEntity } from './entities/company-position.entity';

const Entities = [
    CompanyEntity,
    CompanyPositionEntity
];

const Repositories = [
    CompanyRepository,
    CompanyPositionRepository
];

const Services = [
    CompanyService
];

const Controllers = [
    CompanyController
];

const CommandHandlers = [
    AddPositionToCompanyHandler
];

const QueryHandlers = [
    GetCompanyHandler
];

const Exports = [
    CompanyPositionRepository
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
