import { FileEntity } from '@files/entities/file.entity';
import { File } from '@files/models/file';
import { FileId } from '@files/models/file-id';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { Repository } from 'typeorm';

@Injectable()
export class FileRepository {
    constructor(@InjectRepository( FileEntity ) private readonly repository: Repository<FileEntity>) {
    }

    @catchAsyncExceptions()
    async findById(fileId: FileId): Promise<Result<File>> {
        const result = await this.repository.findOne( { where: { id: fileId.getValue() } } );
        return valueIsEmpty( result )
               ? NotFound()
               : File.fromEntity( result );
    }
}
