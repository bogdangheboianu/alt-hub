import { FiscalModule } from '@fiscal/fiscal.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancelVacationRequestHandler } from '@vacations/commands/handlers/cancel-vacation-request.handler';
import { CreateVacationRequestHandler } from '@vacations/commands/handlers/create-vacation-request.handler';
import { RefreshHolidaysHandler } from '@vacations/commands/handlers/refresh-holidays.handler';
import { UpdateVacationRequestHandler } from '@vacations/commands/handlers/update-vacation-request.handler';
import { HolidayController } from '@vacations/controllers/holiday.controller';
import { VacationController } from '@vacations/controllers/vacation.controller';
import { HolidayEntity } from '@vacations/entities/holiday.entity';
import { VacationEntity } from '@vacations/entities/vacation.entity';
import { GetAllHolidaysHandler } from '@vacations/queries/handlers/get-all-holidays.handler';
import { GetAllVacationsHandler } from '@vacations/queries/handlers/get-all-vacations.handler';
import { HolidayRepository } from '@vacations/repositories/holiday.repository';
import { VacationRepository } from '@vacations/repositories/vacation.repository';
import { VacationSagas } from '@vacations/sagas/vacation.sagas';
import { HolidayScheduler } from '@vacations/schedulers/holiday.scheduler';
import { HolidayApiServiceProvider } from '@vacations/services/holiday-api-service-provider';
import { HolidayService } from '@vacations/services/holiday.service';
import { VacationService } from '@vacations/services/vacation.service';

const Entities = [
    VacationEntity,
    HolidayEntity
];

const CommandHandlers = [
    CreateVacationRequestHandler,
    UpdateVacationRequestHandler,
    CancelVacationRequestHandler,
    RefreshHolidaysHandler
];

const QueryHandlers = [
    GetAllVacationsHandler,
    GetAllHolidaysHandler
];

const Controllers = [
    VacationController,
    HolidayController
];

const Services = [
    VacationService,
    HolidayApiServiceProvider,
    HolidayService
];

const Repositories = [
    HolidayRepository,
    VacationRepository
];

const Schedulers = [
    HolidayScheduler
];

const Sagas = [
    VacationSagas
];

@Module( {
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 HttpModule,
                 FiscalModule
             ],
             controllers: Controllers,
             providers  : [
                 ...Services,
                 ...CommandHandlers,
                 ...QueryHandlers,
                 ...Repositories,
                 ...Schedulers,
                 ...Sagas
             ],
             exports    : [
                 HolidayService,
                 VacationRepository
             ]
         } )
export class VacationsModule {
}
