import { ClientEntity } from '@clients/entities/client.entity';
import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientName } from '@clients/models/value-objects/client-name';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { Exception } from '@shared/exceptions/exception';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ClientRepository {
    constructor(
        @InjectRepository( ClientEntity ) private readonly repository: Repository<ClientEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAllClients(): Promise<Result<Client[]>> {
        const results = await this.repository.find();
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Client.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findClientByName(name: ClientName): Promise<Result<Client>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              name: name.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : Client.fromEntity( result );
    }

    @catchAsyncExceptions()
    async findClientById(id: ClientId): Promise<Result<Client>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id: id.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : Client.fromEntity( result );
    }

    @catchAsyncExceptions()
    async saveClient(client: Client, externalTransaction?: EntityManager): Promise<Client> {
        const entity = client.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction!.save( entity );
        const savedClient = Client.fromEntity( savedEntity );

        if( savedClient.isFailed ) {
            throw new Exception( savedClient.errors );
        }

        return savedClient.value!;
    }
}
