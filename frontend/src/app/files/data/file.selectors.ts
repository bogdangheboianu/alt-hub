import { Injectable } from '@angular/core';
import { BaseSelector } from '@config/store/store.models';
import { FileState, FileStore } from '@files/data/file.store';

@Injectable()
export class FileSelectors extends BaseSelector<FileState> {
    constructor(
        private readonly fileStore: FileStore
    ) {
        super( fileStore );
    }
}
