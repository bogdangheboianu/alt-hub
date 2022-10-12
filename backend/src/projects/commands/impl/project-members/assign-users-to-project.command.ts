import { AssignUsersToProjectDto } from '@projects/dtos/assign-users-to-project.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = AssignUsersToProjectDto & { projectId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class AssignUsersToProjectCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = AssignUsersToProjectCommand.name;
    }
}
