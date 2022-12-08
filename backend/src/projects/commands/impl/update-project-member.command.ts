import { CreateProjectMemberDto } from '@projects/dtos/create-project-member.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = CreateProjectMemberDto & { projectId: string; memberId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateProjectMemberCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateProjectMemberCommand.name;
    }
}
