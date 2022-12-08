import { IDomainCommand } from '@shared/interfaces/generics/domain-command.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Express } from 'express';

type CommandDataPayload = { file: Express.Multer.File };
type CommandData = { context: AuthenticatedContext; payload: CommandDataPayload };

export class ImportWorkLogsFromFileCommand implements IDomainCommand<CommandDataPayload> {
    readonly data: CommandData;
    readonly name: string;

    constructor(data: CommandData) {
        this.data = data;
        this.name = ImportWorkLogsFromFileCommand.name;
    }
}
