import { CreateCompanyPricingProfileDto } from '@company/dtos/create-company-pricing-profile.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';

type CommandDataPayload = CreateCompanyPricingProfileDto;
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class CreateCompanyPricingProfileCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = CreateCompanyPricingProfileCommand.name;
    }
}
