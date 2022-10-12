import { AssignCoordinatorToProjectDto } from '@projects/dtos/assign-coordinator-to-project.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = AssignCoordinatorToProjectDto & { projectId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class AssignCoordinatorToProjectCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = AssignCoordinatorToProjectCommand.name;
    }
}
