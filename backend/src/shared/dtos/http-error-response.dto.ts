import { ApiExtraModels } from '@nestjs/swagger';
import { ErrorDto } from '@shared/dtos/error.dto';

@ApiExtraModels()
export class HttpErrorResponseDto {
    statusCode!: number;
    message!: string;
    errors!: ErrorDto[];
}
