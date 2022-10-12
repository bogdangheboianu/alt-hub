import { ClientDto } from '@clients/dtos/client.dto';

export class ProjectInfoDto {
    name!: string;
    slug!: string;
    description!: string | null;
    client!: ClientDto | null;
}
