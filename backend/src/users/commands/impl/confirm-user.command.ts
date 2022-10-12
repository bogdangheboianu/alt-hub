import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { ConfirmUserDto } from '@users/dtos/confirm-user.dto';

type CommandDataPayload = ConfirmUserDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class ConfirmUserCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = ConfirmUserCommand.name;
    }
}
