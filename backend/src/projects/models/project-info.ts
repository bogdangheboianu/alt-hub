import { Client } from '@clients/models/domain-models/client';
import { ClientName } from '@clients/models/value-objects/client-name';
import { CreateProjectInfoDto } from '@projects/dtos/create-project-info.dto';
import { UpdateProjectInfoDto } from '@projects/dtos/update-project-info.dto';
import { ProjectInfoEntity } from '@projects/entities/project-info.entity';
import { IProjectInfo } from '@projects/interfaces/project-info.interface';
import { ProjectDescription } from '@projects/models/project-description';
import { ProjectName } from '@projects/models/project-name';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IPartialModel } from '@shared/interfaces/generics/domain-partial-model.interface';
import { Result } from '@shared/models/generics/result';
import { Slug } from '@shared/models/identification/slug';

export class ProjectInfo implements IPartialModel<ProjectInfoEntity> {
    name: ProjectName;
    slug: Slug;
    client: Client | null;
    clientName: ClientName | null;
    description: ProjectDescription;

    private constructor(data: IProjectInfo) {
        this.name = data.name;
        this.slug = data.slug ?? Slug.fromName( data.name.getValue() ).value!;
        this.client = data.client ?? null;
        this.clientName = data.clientName ?? null;
        this.description = data.description ?? ProjectDescription.empty();
    }

    static create(dto: CreateProjectInfoDto, beneficiary?: Client): Result<ProjectInfo> {
        const data = Result.aggregateObjects<Omit<IProjectInfo, 'slug'>>(
            { name: ProjectName.create( dto.name ) },
            { description: ProjectDescription.create( dto.description ) },
            { client: beneficiary },
            { clientName: beneficiary?.name }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new ProjectInfo( data.value! ) );
    }

    static fromEntity(entity: ProjectInfoEntity): Result<ProjectInfo> {
        const buildData = Result.aggregateObjects<IProjectInfo>(
            { name: ProjectName.create( entity.name, 'name' ) },
            { slug: Slug.create( entity.slug, 'slug' ) },
            {
                client: valueIsNotEmpty( entity.client )
                        ? Client.fromEntity( entity.client )
                        : undefined
            },
            {
                clientName: valueIsNotEmpty( entity.clientName )
                            ? ClientName.create( entity.clientName! )
                            : undefined
            },
            { description: ProjectDescription.create( entity.description, 'description' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new ProjectInfo( buildData.value! ) );
    }

    static fromName(name: ProjectName): ProjectInfo {
        return new ProjectInfo( { name } );
    }

    toEntity(): ProjectInfoEntity {
        return {
            name       : this.name.getValue(),
            slug       : this.slug.getValue(),
            client     : this.client?.toEntity() ?? null,
            clientName : this.clientName?.getValue() ?? null,
            description: this.description.getValue()
        };
    }

    update(payload: UpdateProjectInfoDto, client: Client | null): Result<ProjectInfo> {
        const buildData = Result.aggregateObjects<Pick<IProjectInfo, 'name' | 'client' | 'description'>>(
            { name: ProjectName.create( payload.name ) },
            { client },
            { description: ProjectDescription.create( payload.description ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new ProjectInfo( { ...buildData.value! } ) );
    }
}
