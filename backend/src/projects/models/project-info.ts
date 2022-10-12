import { Client } from '@clients/models/domain-models/client';
import { CreateProjectInfoDto } from '@projects/dtos/create-project-info.dto';
import { IProjectInfo } from '@projects/interfaces/project-info.interface';
import { OptionalProjectDescription } from '@projects/models/optional-project-description';
import { ProjectName } from '@projects/models/project-name';
import { ProjectInfoEntity } from '@projects/types/project.types';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IPartialModel } from '@shared/interfaces/generics/domain-partial-model.interface';
import { Result } from '@shared/models/generics/result';
import { Slug } from '@shared/models/identification/slug';

export class ProjectInfo implements IPartialModel<ProjectInfoEntity> {
    name: ProjectName;
    slug: Slug;
    client: Client | null;
    description: OptionalProjectDescription;

    private constructor(data: IProjectInfo) {
        this.name = data.name;
        this.slug = data.slug ?? Slug.fromName( data.name.getValue() ).value!;
        this.client = data.client ?? null;
        this.description = data.description;
    }

    static create(dto: CreateProjectInfoDto, beneficiary?: Client): Result<ProjectInfo> {
        const data = Result.aggregateObjects<Pick<IProjectInfo, 'name' | 'description'>>(
            { name: ProjectName.create( dto.name ) },
            { description: OptionalProjectDescription.create( dto.description ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new ProjectInfo( { ...data.value!, client: beneficiary } ) );
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
            { description: OptionalProjectDescription.create( entity.description, 'description' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new ProjectInfo( buildData.value! ) );
    }

    toEntity(): ProjectInfoEntity {
        return {
            name       : this.name.getValue(),
            slug       : this.slug.getValue(),
            client     : this.client?.toEntity() ?? null,
            description: this.description.getValue()
        };
    }
}
