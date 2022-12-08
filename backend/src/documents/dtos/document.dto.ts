import { DocumentTypeEnum } from '@documents/enums/document-type.enum';
import { FileDto } from '@files/dtos/file.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AuditDto } from '@shared/dtos/audit.dto';

export class DocumentDto {
    id!: string;
    @ApiProperty( { enum: DocumentTypeEnum, enumName: 'DocumentTypeEnum', nullable: true } )
    type!: DocumentTypeEnum;
    files!: FileDto[];
    audit!: AuditDto;
}
