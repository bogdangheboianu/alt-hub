import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = { projectId: string; memberId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class DeleteProjectMemberCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = DeleteProjectMemberCommand.name;
    }
}
