import { IException } from '@shared/interfaces/generics/exception.interface';

export type ValidationErrorHandler = (...errors: IException[]) => void;
