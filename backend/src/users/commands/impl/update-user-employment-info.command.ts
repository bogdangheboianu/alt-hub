import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { UpdateUserEmploymentInfoDto } from '@users/dtos/update-user-employment-info.dto';

type CommandDataPayload = UpdateUserEmploymentInfoDto & { userId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateUserEmploymentInfoCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateUserEmploymentInfoCommand.name;
    }
}
