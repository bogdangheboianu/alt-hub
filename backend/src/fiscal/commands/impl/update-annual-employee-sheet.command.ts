import { UpdateAnnualEmployeeSheetDto } from '@fiscal/dtos/update-annual-employee-sheet.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = UpdateAnnualEmployeeSheetDto & { annualEmployeeSheetId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateAnnualEmployeeSheetCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateAnnualEmployeeSheetCommand.name;
    }
}
