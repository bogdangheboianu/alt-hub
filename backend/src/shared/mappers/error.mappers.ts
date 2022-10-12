import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';

export const errorsToJson = (errors?: IException[]): any => {
    return valueIsEmpty( errors )
           ? null
           : errors!.map( e => (
            { ...e }
        ) );
};
