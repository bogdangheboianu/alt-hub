import { IException } from '@shared/interfaces/generics/exception.interface';
import { Result } from '@shared/models/generics/result';

export const Success = <T>(value?: T): Result<T> => Result.success( value );

export const Failed = (...errors: IException[]): Result<any> => Result.failed( ...errors );

export const NotFound = (): Result<any> => Result.notFound();
