import { ClientDto } from '@dtos/client.dto';

export class ProjectInfoDto {
    name!: string;
    slug!: string;
    client!: ClientDto | null;
}
