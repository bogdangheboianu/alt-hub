import { DocumentEntity } from '@documents/entities/document.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity( 'files' )
export class FileEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Varchar, nullable: false } )
    name!: string;

    @Column( { type: ColTypesEnum.Varchar, nullable: false } )
    mimeType!: string;

    @Column( { type: ColTypesEnum.Bytea, nullable: false } )
    buffer!: Uint8Array;

    @ManyToOne( () => DocumentEntity, document => document.files, { lazy: true, nullable: true } )
    @JoinColumn( { name: 'document_id', referencedColumnName: 'id' } )
    document?: Promise<DocumentEntity | null>;
}
