import { IContext } from '@shared/interfaces/generics/context.interface';
import { v4 as uuidv4 } from 'uuid';

export class InternalContext implements IContext {
    correlationId: string;

    constructor() {
        this.correlationId = uuidv4();
    }
}
