import { CreateProjectDto } from '@projects/dtos/create-project.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = CreateProjectDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateProjectCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateProjectCommand.name;
    }
}
