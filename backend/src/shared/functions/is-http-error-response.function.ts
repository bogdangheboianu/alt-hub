import { HttpErrorResponseDto } from '@shared/dtos/http-error-response.dto';

export function isHttpErrorResponse(data: any): data is HttpErrorResponseDto {
    return 'statusCode' in data && 'message' in data && Array.isArray( data?.errors );
}
