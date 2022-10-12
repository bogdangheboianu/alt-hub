import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { CreateUserDto } from '@users/dtos/create-user.dto';

type CommandDataPayload = CreateUserDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateUserCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateUserCommand.name;
    }
}
