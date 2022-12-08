import { HttpErrorResponseDto } from '@dtos/http-error-response-dto';
import { valueIsDefined, valueIsEmpty, valueIsNotEmpty } from '@shared/config/functions/value.functions';

export class ApiResult<T> {
    readonly data?: T | null;
    readonly error?: HttpErrorResponseDto;

    constructor(payload: { data?: T; error?: HttpErrorResponseDto }) {
        this.data = valueIsEmpty( payload.error )
                    ? payload.data
                    : null;
        this.error = payload.error;
    }

    isFailed(): boolean {
        return valueIsNotEmpty( this.error );
    }

    isSuccessful(): boolean {
        return !this.isFailed() && valueIsDefined( this.data );
    }
}
