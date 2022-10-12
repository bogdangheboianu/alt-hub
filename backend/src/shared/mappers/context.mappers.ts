import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IContext } from '@shared/interfaces/generics/context.interface';
import { IContextJsonData } from '@shared/interfaces/generics/domain-event.interface';

export const contextToJson = (context?: IContext): IContextJsonData => {
    return valueIsEmpty( context )
           ? { correlationId: '', userId: null }
           : { correlationId: context!.correlationId, userId: context!.user?.id.getValue() ?? null };
};
