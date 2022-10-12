import { TokenPurposeEnum } from '@security/enums/token/token-purpose.enum';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { ColTypesEnum } from '@shared/enums/col-types.enum';
import { UserEntity } from '@users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity( 'tokens' )
export class TokenEntity {
    @PrimaryColumn( { type: ColTypesEnum.UUID } )
    id!: string;

    @Column( { type: ColTypesEnum.Varchar, unique: true } )
    value!: string;

    @Column( { type: ColTypesEnum.TimestampWithTimezone } )
    generatedAt!: Date;

    @Column( { type: ColTypesEnum.Enum, enum: TokenStatusEnum } )
    status!: TokenStatusEnum;

    @Column( { type: ColTypesEnum.Int, nullable: true } )
    validForMinutes!: number | null;

    @Column( { type: ColTypesEnum.Enum, enum: TokenPurposeEnum } )
    purpose!: TokenPurposeEnum;

    @ManyToOne( () => UserEntity, { eager: true, nullable: false } )
    @JoinColumn( { name: 'user_id', referencedColumnName: 'id' } )
    user!: UserEntity | null;
}
