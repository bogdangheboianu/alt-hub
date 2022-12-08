import { CompanyModule } from '@company/company.module';
import { FiscalModule } from '@fiscal/fiscal.module';
import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '@security/security.module';
import { ActivateUserHandler } from '@users/commands/handlers/activate-user.handler';
import { CreateUserHandler } from '@users/commands/handlers/create-user.handler';
import { DeactivateUserHandler } from '@users/commands/handlers/deactivate-user.handler';
import { InviteUserHandler } from '@users/commands/handlers/invite-user.handler';
import { ReactivateUserHandler } from '@users/commands/handlers/reactivate-user.handler';
import { UpdateUserEmploymentInfoHandler } from '@users/commands/handlers/update-user-employment-info.handler';
import { UpdateUserPersonalInfoHandler } from '@users/commands/handlers/update-user-personal-info.handler';
import { UserController } from '@users/controllers/user.controller';
import { UserEntity } from '@users/entities/user.entity';
import { GetAllUsersHandler } from '@users/queries/handlers/get-all-users.handler';
import { GetUserByIdHandler } from '@users/queries/handlers/get-user-by-id.handler';
import { UserRepository } from '@users/repositories/user.repository';
import { UserSagas } from '@users/sagas/user.sagas';
import { UserService } from '@users/services/user.service';

const Entities = [
    UserEntity
];

const Repositories = [
    UserRepository
];

const Services = [
    UserService
];

const Controllers = [
    UserController
];

const CommandHandlers = [
    CreateUserHandler,
    InviteUserHandler,
    ActivateUserHandler,
    ReactivateUserHandler,
    UpdateUserPersonalInfoHandler,
    UpdateUserEmploymentInfoHandler,
    DeactivateUserHandler
];

const QueryHandlers = [
    GetUserByIdHandler,
    GetAllUsersHandler
];

const Sagas = [
    UserSagas
];

const Exports = [
    UserRepository
];

@Module( {
             controllers: [ ...Controllers ],
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule,
                 forwardRef( () => SecurityModule ),
                 CompanyModule,
                 forwardRef( () => FiscalModule )
             ],
             providers  : [
                 ...Repositories,
                 ...Services,
                 ...CommandHandlers,
                 ...QueryHandlers,
                 ...Sagas
             ],
             exports    : [ ...Exports ]
         } )
export class UserModule {
}
