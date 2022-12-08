import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { UpdateVacationRequestDto } from '@vacations/dtos/update-vacation-request.dto';

type CommandDataPayload = UpdateVacationRequestDto & { vacationId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateVacationRequestCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateVacationRequestCommand.name;
    }
}
