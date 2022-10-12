import { AuditEntity } from '@shared/entities/audit.entity';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column, PrimaryColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryColumn( { type: ColTypesEnum.UUID } )
    id!: string;

    @Column( () => AuditEntity )
    audit!: AuditEntity;
}
