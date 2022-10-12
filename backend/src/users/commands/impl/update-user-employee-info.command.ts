import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { UpdateUserEmployeeInfoDto } from '@users/dtos/update-user-employee-info.dto';

type CommandDataPayload = UpdateUserEmployeeInfoDto & { userId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateUserEmployeeInfoCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateUserEmployeeInfoCommand.name;
    }
}
