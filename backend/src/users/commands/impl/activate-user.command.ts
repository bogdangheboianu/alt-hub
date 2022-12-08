import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { ActivateUserDto } from '@users/dtos/activate-user.dto';

type CommandDataPayload = ActivateUserDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class ActivateUserCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = ActivateUserCommand.name;
    }
}
