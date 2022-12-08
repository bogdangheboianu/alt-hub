import { Client } from '@clients/models/domain-models/client';
import { ClientName } from '@clients/models/value-objects/client-name';
import { ProjectDescription } from '@projects/models/project-description';
import { ProjectName } from '@projects/models/project-name';
import { Slug } from '@shared/models/identification/slug';

export interface IProjectInfo {
    name: ProjectName;
    slug?: Slug;
    client?: Client;
    clientName?: ClientName;
    description?: ProjectDescription;
}
