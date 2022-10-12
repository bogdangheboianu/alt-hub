import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { UpdateUserPersonalInfoDto } from '@users/dtos/update-user-personal-info.dto';

type CommandDataPayload = UpdateUserPersonalInfoDto & { userId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateUserPersonalInfoCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateUserPersonalInfoCommand.name;
    }
}
