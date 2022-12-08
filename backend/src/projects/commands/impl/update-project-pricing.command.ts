import { UpdateProjectPricingDto } from '@projects/dtos/update-project-pricing.dto';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = UpdateProjectPricingDto & { projectId: string };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class UpdateProjectPricingCommand {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = UpdateProjectPricingCommand.name;
    }
}
