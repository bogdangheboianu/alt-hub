import { Client } from '@clients/models/domain-models/client';
import { OptionalProjectDescription } from '@projects/models/optional-project-description';
import { ProjectName } from '@projects/models/project-name';
import { Slug } from '@shared/models/identification/slug';

export interface IProjectInfo {
    name: ProjectName;
    slug?: Slug;
    client?: Client;
    description: OptionalProjectDescription;
}
