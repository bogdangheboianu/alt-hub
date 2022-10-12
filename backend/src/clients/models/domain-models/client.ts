import { CreateClientCommand } from '@clients/commands/impl/create-client.command';
import { UpdateClientCommand } from '@clients/commands/impl/update-client.command';
import { ClientEntity } from '@clients/entities/client.entity';
import { IClient } from '@clients/interfaces/client.interface';
import { ClientId } from '@clients/models/value-objects/client-id';
import { ClientName } from '@clients/models/value-objects/client-name';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { Slug } from '@shared/models/identification/slug';

export class Client implements IDomainModel<Client, ClientEntity> {
    id: ClientId;
    name: ClientName;
    slug: Slug;
    audit: Audit;

    private constructor(data: IClient) {
        this.id = data.id ?? ClientId.generate();
        this.name = data.name;
        this.slug = data.slug ?? Slug.fromName( data.name.getValue() ).value!;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateClientCommand): Result<Client> {
        const { context, payload } = command.data;
        const data = Result.aggregateObjects<Pick<IClient, 'name' | 'audit'>>(
            { name: ClientName.create( payload.name ) },
            { audit: Audit.initial( context.user?.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new Client( data.value! ) );
    }

    static fromEntity(entity: ClientEntity): Result<Client> {
        const buildData = Result.aggregateObjects<IClient>(
            { id: ClientId.create( entity.id ) },
            { name: ClientName.create( entity.name ) },
            { slug: Slug.create( entity.slug, 'slug' ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Client( buildData.value! ) );
    }

    equals(to: Client): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): ClientEntity {
        return entityFactory( ClientEntity, {
            id   : this.id.getValue(),
            name : this.name.getValue(),
            slug : this.slug.getValue(),
            audit: this.audit.toEntity()
        } );
    }

    updateClient(command: UpdateClientCommand): Result<Client> {
        const { context, payload } = command.data;

        const newName = this.name.update( payload.name );

        if( newName.isFailed ) {
            return Failed( ...newName.errors );
        }

        const audit = this.audit.update( context.user.id );
        const slug = Slug.fromName( newName.value!.getValue()! );

        if( slug.isFailed ) {
            return Failed( ...slug.errors );
        }

        return Success( new Client( { ...this, name: newName.value, slug: slug.value, audit: audit } ) );
    }
}
