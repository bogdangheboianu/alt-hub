import { CreateDocumentCommand } from '@documents/commands/impl/create-document.command';
import { FileEntity } from '@files/entities/file.entity';
import { IFile } from '@files/interfaces/file.interface';
import { FileBuffer } from '@files/models/file-buffer';
import { FileId } from '@files/models/file-id';
import { FileMimeType } from '@files/models/file-mime-type';
import { FileName } from '@files/models/file-name';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { Audit } from '@shared/models/audit/audit';
import { Result } from '@shared/models/generics/result';
import { Express } from 'express';

export class File implements IDomainModel<File, FileEntity> {
    id: FileId;
    name: FileName;
    mimeType: FileMimeType;
    buffer: FileBuffer;
    audit: Audit;

    private constructor(data: IFile) {
        this.id = data.id ?? FileId.generate();
        this.name = data.name;
        this.mimeType = data.mimeType;
        this.buffer = data.buffer;
        this.audit = data.audit ?? Audit.initial();
    }

    static create(command: CreateDocumentCommand, file: Express.Multer.File): Result<File> {
        const data = Result.aggregateObjects<Omit<IFile, 'id'>>(
            { name: FileName.create( file.originalname ) },
            { mimeType: FileMimeType.create( file.mimetype ) },
            { buffer: FileBuffer.create( file.buffer ) },
            { audit: Audit.initial( command.data.context.user.id ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new File( data.value! ) );
    }

    static fromEntity(entity: FileEntity): Result<File> {
        const data = Result.aggregateObjects<IFile>(
            { id: FileId.create( entity.id ) },
            { name: FileName.create( entity.name ) },
            { mimeType: FileMimeType.create( entity.mimeType ) },
            { buffer: FileBuffer.fromUInt8Array( entity.buffer ) },
            { audit: Audit.fromEntity( entity.audit ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new File( data.value! ) );
    }

    equals(to: File): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): FileEntity {
        return entityFactory( FileEntity, {
            id      : this.id.getValue(),
            name    : this.name.getValue(),
            mimeType: this.mimeType.getValue(),
            buffer  : this.buffer.getValue(),
            audit   : this.audit.toEntity()
        } );
    }
}
