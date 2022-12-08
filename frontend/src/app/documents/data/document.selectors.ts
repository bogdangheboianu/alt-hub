import { Injectable } from '@angular/core';
import { BaseEntitySelector } from '@config/store/store.models';
import { DocumentState, DocumentStore } from '@documents/data/document.store';
import { DocumentDto } from '@dtos/document-dto';

@Injectable()
export class DocumentSelectors extends BaseEntitySelector<DocumentDto, DocumentState> {
    constructor(private documentStore: DocumentStore) {
        super( documentStore );
    }
}
