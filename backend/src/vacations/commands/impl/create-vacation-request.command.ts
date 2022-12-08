import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { CreateVacationRequestDto } from '@vacations/dtos/create-vacation-request.dto';

type CommandDataPayload = CreateVacationRequestDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateVacationRequestCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateVacationRequestCommand.name;
    }
}
