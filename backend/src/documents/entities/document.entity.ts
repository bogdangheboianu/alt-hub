import { ClientEntity } from '@clients/entities/client.entity';
import { CompanyEntity } from '@company/entities/company.entity';
import { DocumentTypeEnum } from '@documents/enums/document-type.enum';
import { FileEntity } from '@files/entities/file.entity';
import { BaseEntity } from '@shared/entities/base.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity( 'documents' )
export class DocumentEntity extends BaseEntity {
    @Column( { type: ColTypesEnum.Enum, enum: DocumentTypeEnum, nullable: false } )
    type!: DocumentTypeEnum;

    @OneToMany( () => FileEntity, file => file.document, { eager: true, cascade: true, onDelete: 'CASCADE' } )
    files!: FileEntity[];

    @ManyToMany( () => CompanyEntity, { eager: true, cascade: true, nullable: false } )
    @JoinTable( {
                    name             : 'documents_x_companies',
                    joinColumn       : { name: 'document_id', referencedColumnName: 'id' },
                    inverseJoinColumn: { name: 'company_id', referencedColumnName: 'id' }
                } )
    companies!: CompanyEntity[];

    @ManyToMany( () => ClientEntity, { eager: true, cascade: true, nullable: false } )
    @JoinTable( {
                    name             : 'documents_x_clients',
                    joinColumn       : { name: 'document_id', referencedColumnName: 'id' },
                    inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' }
                } )
    clients!: ClientEntity[];

    @ManyToMany( () => UserEntity, { eager: true, cascade: true, nullable: false } )
    @JoinTable( {
                    name             : 'documents_x_users',
                    joinColumn       : { name: 'document_id', referencedColumnName: 'id' },
                    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
                } )
    users!: UserEntity[];
}
