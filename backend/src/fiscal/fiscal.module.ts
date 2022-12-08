import { CreateAnnualEmployeeSheetHandler } from '@fiscal/commands/handlers/create-annual-employee-sheet.handler';
import { UpdateAnnualEmployeeSheetHandler } from '@fiscal/commands/handlers/update-annual-employee-sheet.handler';
import { FiscalController } from '@fiscal/controllers/fiscal.controller';
import { AnnualEmployeeSheetEntity } from '@fiscal/entities/annual-employee-sheet.entity';
import { FiscalYearEntity } from '@fiscal/entities/fiscal-year.entity';
import { GetCurrentAnnualEmployeeSheetHandler } from '@fiscal/queries/handlers/get-current-annual-employee-sheet.handler';
import { GetCurrentFiscalYearHandler } from '@fiscal/queries/handlers/get-current-fiscal-year.handler';
import { AnnualEmployeeSheetRepository } from '@fiscal/repositories/annual-employee-sheet.repository';
import { FiscalYearRepository } from '@fiscal/repositories/fiscal-year.repository';
import { FiscalService } from '@fiscal/services/fiscal.service';
import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@users/user.module';

const Entities = [
    FiscalYearEntity,
    AnnualEmployeeSheetEntity
];

const Repositories = [
    FiscalYearRepository,
    AnnualEmployeeSheetRepository
];

const CommandHandlers = [
    CreateAnnualEmployeeSheetHandler,
    UpdateAnnualEmployeeSheetHandler
];

const QueryHandlers = [
    GetCurrentAnnualEmployeeSheetHandler,
    GetCurrentFiscalYearHandler
];

const Services = [
    FiscalService
];

const Exports = [
    FiscalService,
    AnnualEmployeeSheetRepository
];

const Controllers = [
    FiscalController
];

@Module( {
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 forwardRef( () => UserModule )
             ],
             controllers: Controllers,
             providers  : [
                 ...Repositories,
                 ...CommandHandlers,
                 ...QueryHandlers,
                 ...Services
             ],
             exports    : Exports
         } )
export class FiscalModule {
}
