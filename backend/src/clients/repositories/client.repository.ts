import { ClientEntity } from '@clients/entities/client.entity';
import { Client } from '@clients/models/domain-models/client';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientName } from '@clients/models/value-objects/client-name';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class ClientRepository {
    constructor(
        @InjectRepository( ClientEntity ) private readonly repository: Repository<ClientEntity>
    ) {
    }

    @catchAsyncExceptions()
    async findAll(): Promise<Result<Client[]>> {
        const results = await this.repository.find();
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Client.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findAllByIdList(idList: ClientId[]): Promise<Result<Client[]>> {
        const results = await this.repository.find( {
                                                        where: {
                                                            id: In( idList.map( id => id.getValue() ) )
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => Client.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findByName(name: ClientName): Promise<Result<Client>> {
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
    async findById(id: ClientId): Promise<Result<Client>> {
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
    async save(client: Client, externalTransaction?: EntityManager): Promise<Result<Client>> {
        const entity = client.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction!.save( entity );

        return Client.fromEntity( savedEntity );
    }

    @catchAsyncExceptions()
    async delete(client: Client, externalTransaction?: EntityManager): Promise<void> {
        const entity = client.toEntity();
        valueIsEmpty( externalTransaction )
        ? await this.repository.remove( entity )
        : await externalTransaction.remove( entity );
    }
}
