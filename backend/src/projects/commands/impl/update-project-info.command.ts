import { UpdateProjectInfoDto } from '@projects/dtos/update-project-info.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = UpdateProjectInfoDto & { projectId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateProjectInfoCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateProjectInfoCommand.name;
    }
}
