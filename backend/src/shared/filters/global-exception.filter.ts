import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ErrorDto } from '@shared/dtos/error.dto';
import { HttpErrorResponseDto } from '@shared/dtos/http-error-response.dto';
import { isExceptionList } from '@shared/functions/is-exception-list.function';
import { isException } from '@shared/functions/is-exception.function';
import { isHttpErrorResponse } from '@shared/functions/is-http-error-response.function';
import { statusCodeToErrorCode, statusCodeToErrorName } from '@shared/functions/status-code.functions';
import { valueIsString } from '@shared/functions/value-is-string.function';
import { Request, Response } from 'express';
import stringify from 'fast-safe-stringify';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger( GlobalExceptionFilter.name );

    catch(exception: unknown, host: ArgumentsHost): any {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const url = request.url;
        const method = request.method;
        const errorResponsePayload = exception instanceof HttpException
                                     ? this.transformHttpException( exception )
                                     : this.transformOtherException();
        this.logger.error( `${ method } ${ url }`, stringify.stable( errorResponsePayload ) );

        return response.status( errorResponsePayload.statusCode )
                       .json( errorResponsePayload );
    }

    private transformHttpException(exception: HttpException): HttpErrorResponseDto {
        const originalPayload = exception.getResponse();

        if( isHttpErrorResponse( originalPayload ) ) {
            return originalPayload;
        }

        const statusCode = exception.getStatus();
        const message = statusCodeToErrorName( statusCode );
        let errors: ErrorDto[];

        if( valueIsString( originalPayload ) ) {
            return { statusCode, message: originalPayload, errors: [] };
        }

        if( 'message' in originalPayload ) {
            // @ts-ignore
            const payloadMsg = originalPayload.message;

            if( valueIsString( payloadMsg ) ) {
                errors = [
                    {
                        name   : statusCodeToErrorCode( statusCode ),
                        message: payloadMsg,
                        field  : null
                    }
                ];
                return { statusCode, message, errors };
            }

            if( isException( payloadMsg ) ) {
                errors = [ payloadMsg as ErrorDto ];
                return { statusCode, message, errors };
            }

            if( isExceptionList( payloadMsg ) ) {
                errors = payloadMsg as ErrorDto[];
                return { statusCode, message, errors };
            }
        }

        errors = [ { name: 'Unexpected', message: stringify.stable( originalPayload ), field: null } ];

        return { statusCode, message, errors };

    }

    private transformOtherException(): HttpErrorResponseDto {
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = statusCodeToErrorName( statusCode );

        return { statusCode, message, errors: [] };
    }
}
