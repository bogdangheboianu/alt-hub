import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { Column } from 'typeorm';

export class AuditEntity {
    @Column( { type: ColTypesEnum.TimestampWithTimezone } )
    createdAt!: Date;

    @Column( { type: ColTypesEnum.TimestampWithTimezone, nullable: true } )
    updatedAt!: Date | null;

    @Column( { type: ColTypesEnum.UUID, nullable: true } )
    createdBy!: string | null;

    @Column( { type: ColTypesEnum.UUID, nullable: true } )
    updatedBy!: string | null;

    @Column( { type: ColTypesEnum.Int } )
    version!: number;
}
