import { DocumentTypeEnum } from '@documents/enums/document-type.enum';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';

export class DocumentType implements IValueObject<DocumentType, DocumentTypeEnum> {
    private readonly value: DocumentTypeEnum;

    private constructor(value: DocumentTypeEnum) {
        this.value = value;
    }

    static create(value: string | DocumentTypeEnum): Result<DocumentType> {
        const validation = ValidationChain.validate<any>()
                                          .isEnum( value, DocumentTypeEnum, 'type' )
                                          .getResult();

        if( validation.isFailed ) {
            return Failed( ...validation.errors );
        }

        return Success( new DocumentType( value as DocumentTypeEnum ) );
    }

    getValue(): DocumentTypeEnum {
        return this.value;
    }

    equals(to: DocumentType): boolean {
        return this.value === to.getValue();
    }
}
