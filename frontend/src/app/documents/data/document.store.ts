import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { storeEvent } from '@config/store/store.decorators';
import { initialBaseEntityState } from '@config/store/store.functions';
import { IBaseEntityState } from '@config/store/store.interfaces';
import { BaseEntityStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';
import { DocumentDto } from '@dtos/document-dto';

export interface DocumentState extends IBaseEntityState<DocumentDto> {
}

const createInitialState = (): DocumentState => (
    { ...initialBaseEntityState() }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Documents } )
export class DocumentStore extends BaseEntityStore<DocumentDto, DocumentState> {
    constructor() {
        super( createInitialState() );
    }

    @storeEvent( 'Document list loaded' )
    onDocumentListLoaded(documentList: DocumentDto[]): void {
        this.set( documentList );
    }

    @storeEvent( 'Document created' )
    onDocumentCreated(document: DocumentDto): void {
        this.add( document );
        this.setActive( document.id );
    }
}
