import { CustomHttpHeaders } from '@shared/constants/http/custom-http-headers.constants';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IContext } from '@shared/interfaces/generics/context.interface';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { PublicContext } from '@shared/models/context/public-context';

export abstract class BaseController {
    protected getContext<T extends IContext>(headers: any, request: any): T {
        const correlationId = headers[CustomHttpHeaders.CorrelationId.property];
        const user = request.user;

        return valueIsEmpty( user )
               ? new PublicContext( correlationId ) as T
               : new AuthenticatedContext( correlationId, user ) as T;
    }
}
