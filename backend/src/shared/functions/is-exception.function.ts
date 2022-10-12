import { IException } from '@shared/interfaces/generics/exception.interface';

export function isException(data: any): data is IException {
    return typeof data === 'object' && 'message' in data && 'field' in data && 'name' in data;
}
