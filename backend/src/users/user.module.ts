import { CompanyModule } from '@company/company.module';
import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '@security/security.module';
import { ActivateUserHandler } from '@users/commands/handlers/activate-user.handler';
import { ConfirmUserHandler } from '@users/commands/handlers/confirm-user.handler';
import { CreateUserHandler } from '@users/commands/handlers/create-user.handler';
import { InviteUserHandler } from '@users/commands/handlers/invite-user.handler';
import { UpdateUserEmployeeInfoHandler } from '@users/commands/handlers/update-user-employee-info.handler';
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
    ConfirmUserHandler,
    ActivateUserHandler,
    UpdateUserPersonalInfoHandler,
    UpdateUserEmployeeInfoHandler
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
                 CompanyModule
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
