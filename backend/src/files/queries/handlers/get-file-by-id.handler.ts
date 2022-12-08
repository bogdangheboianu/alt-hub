import { FileNotFoundException } from '@files/exceptions/file.exceptions';
import { File } from '@files/models/file';
import { FileId } from '@files/models/file-id';
import { GetFileByIdQuery } from '@files/queries/impl/get-file-by-id.query';
import { FileRepository } from '@files/repositories/file.repository';
import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';

@QueryHandler( GetFileByIdQuery )
export class GetFileByIdHandler extends BaseQueryHandler<GetFileByIdQuery, File> {
    constructor(
        private readonly fileRepository: FileRepository
    ) {
        super();
    }

    async execute(query: GetFileByIdQuery): Promise<Result<File>> {
        const file = await this.getFile( query );

        if( file.isFailed ) {
            return this.failed( query, ...file.errors );
        }

        return this.successful( query, file.value! );
    }

    protected failed(query: GetFileByIdQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetFileByIdQuery, file: File): Result<File> {
        return Success( file );
    }

    private async getFile(query: GetFileByIdQuery): Promise<Result<File>> {
        const fileId = FileId.create( query.data.params.id, 'fileId' );

        if( fileId.isFailed ) {
            return Failed( ...fileId.errors );
        }

        const file = await this.fileRepository.findById( fileId.value! );

        if( file.isFailed ) {
            throw new Exception( file.errors );
        }

        if( file.isNotFound ) {
            return Failed( new FileNotFoundException() );
        }

        return file;
    }
}
