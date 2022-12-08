import { Injectable } from '@angular/core';
import { StoreNameEnum } from '@config/store/store.constants';
import { initialBaseState } from '@config/store/store.functions';
import { IBaseState } from '@config/store/store.interfaces';
import { BaseStore } from '@config/store/store.models';
import { StoreConfig } from '@datorama/akita';

export interface FileState extends IBaseState {
}

const createInitialState = (): FileState => (
    { ...initialBaseState() }
);

@StoreConfig( { name: StoreNameEnum.Files } )
@Injectable()
export class FileStore extends BaseStore<FileState> {
    constructor() {
        super( createInitialState() );
    }
}
