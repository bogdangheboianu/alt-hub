import { CreateClientHandler } from '@clients/commands/handlers/create-client.handler';
import { DeleteClientHandler } from '@clients/commands/handlers/delete-client.handler';
import { UpdateClientHandler } from '@clients/commands/handlers/update-client.handler';
import { ClientController } from '@clients/controllers/client.controller';
import { ClientEntity } from '@clients/entities/client.entity';
import { GetAllClientsHandler } from '@clients/queries/handlers/get-all-clients.handler';
import { GetClientByIdHandler } from '@clients/queries/handlers/get-client-by-id.handler';
import { ClientRepository } from '@clients/repositories/client.repository';
import { ClientService } from '@clients/services/client.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

const Entities = [
    ClientEntity
];

const Controllers = [
    ClientController
];

const Services = [
    ClientService
];

const Repositories = [
    ClientRepository
];

const CommandHandlers = [
    CreateClientHandler,
    UpdateClientHandler,
    DeleteClientHandler
];

const QueryHandlers = [
    GetAllClientsHandler,
    GetClientByIdHandler
];

const Exports = [
    ClientRepository
];

@Module( {
             imports    : [
                 TypeOrmModule.forFeature( [ ...Entities ] ),
                 CqrsModule
             ],
             controllers: [ ...Controllers ],
             providers  : [
                 ...Services,
                 ...CommandHandlers,
                 ...Repositories,
                 ...QueryHandlers
             ],
             exports    : [ ...Exports ]
         } )
export class ClientModule {
}
