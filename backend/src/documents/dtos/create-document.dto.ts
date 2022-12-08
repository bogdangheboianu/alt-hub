import { DocumentTypeEnum } from '@documents/enums/document-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { arrayQueryParamTransform } from '@shared/functions/array-query-param-transform.function';
import { Transform } from 'class-transformer';

export class CreateDocumentDto {
    @ApiProperty( { enum: DocumentTypeEnum, enumName: 'DocumentTypeEnum', nullable: true } )
    type!: DocumentTypeEnum;
    @Transform( arrayQueryParamTransform )
    usersIds?: string[] | string;
    @Transform( arrayQueryParamTransform )
    clientsIds?: string[] | string;
}
