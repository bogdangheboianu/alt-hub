import { Pipe, PipeTransform } from '@angular/core';
import { DocumentTypeEnum } from '@dtos/document-type-enum';
import { startCase } from 'lodash-es';

@Pipe( { name: 'formatDocumentType', pure: true } )
export class FormatDocumentTypePipe implements PipeTransform {
    transform(value: DocumentTypeEnum): string {
        return startCase( value.replace( '_', ' ' ) );
    }
}
