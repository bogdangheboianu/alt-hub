import { CreateCompanyPositionDto } from '@company/dtos/create-company-position.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = CreateCompanyPositionDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class AddPositionToCompanyCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = AddPositionToCompanyCommand.name;
    }
}
