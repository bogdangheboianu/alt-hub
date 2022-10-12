import { isException } from '@shared/functions/is-exception.function';
import { IException } from '@shared/interfaces/generics/exception.interface';

export function isExceptionList(data: any): data is IException[] {
    if( !Array.isArray( data ) ) {
        return false;
    }

    if( data.length === 0 ) {
        return true;
    }

    return !data.some( ex => !isException( ex ) );
}
