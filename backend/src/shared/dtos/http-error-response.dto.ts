import { ErrorDto } from '@shared/dtos/error.dto';

export class HttpErrorResponseDto {
    statusCode!: number;
    message!: string;
    errors!: ErrorDto[];
}
