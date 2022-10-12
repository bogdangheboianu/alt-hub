import { LoginWithCredentialsDto } from '@security/dtos/login-with-credentials.dto';
import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { PublicContext } from '@shared/models/context/public-context';

type CommandDataPayload = LoginWithCredentialsDto;
type CommandData = { context: PublicContext; payload: CommandDataPayload };

export class LoginWithCredentialsCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = LoginWithCredentialsCommand.name;
    }
}
