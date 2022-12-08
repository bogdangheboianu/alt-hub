import { File } from '@files/models/file';
import { GetFileByIdQuery } from '@files/queries/impl/get-file-by-id.query';
import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

@Injectable()
export class FileService {
    constructor(
        private readonly queryBus: QueryBus
    ) {
    }

    async download(context: AuthenticatedContext, fileId: string): Promise<StreamableFile> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( fileId, 'fileId' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const query = new GetFileByIdQuery( { context, params: { id: fileId } } );
        const result: Result<File> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return new StreamableFile( result.value!.buffer.getValue() );
    }
}
