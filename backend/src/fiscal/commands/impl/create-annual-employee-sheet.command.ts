import { CreateAnnualEmployeeSheetDto } from '@fiscal/dtos/create-annual-employee-sheet.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = CreateAnnualEmployeeSheetDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateAnnualEmployeeSheetCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateAnnualEmployeeSheetCommand.name;
    }
}
