import { IContext } from '@shared/interfaces/generics/context.interface';

export class PublicContext implements IContext {
    correlationId: string;

    constructor(correlationId: string) {
        this.correlationId = correlationId;
    }
}
