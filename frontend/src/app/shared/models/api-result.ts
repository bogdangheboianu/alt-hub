import { HttpErrorResponseDto } from '@dtos/http-error-response.dto';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';

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
        return !this.isFailed() && valueIsNotEmpty( this.data );
    }
}
