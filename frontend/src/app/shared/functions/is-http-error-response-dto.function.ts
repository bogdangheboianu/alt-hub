import { HttpErrorResponseDto } from '@dtos/http-error-response.dto';

export const isHttpErrorResponseDto = (obj: any): obj is HttpErrorResponseDto => {
    return obj instanceof HttpErrorResponseDto || (
        'errors' in obj &&
        'statusCode' in obj &&
        'message' in obj
    );
};
