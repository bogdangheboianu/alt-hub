import { FileBuffer } from '@files/models/file-buffer';
import { FileId } from '@files/models/file-id';
import { FileMimeType } from '@files/models/file-mime-type';
import { FileName } from '@files/models/file-name';
import { Audit } from '@shared/models/audit/audit';

export interface IFile {
    id?: FileId;
    name: FileName;
    mimeType: FileMimeType;
    buffer: FileBuffer;
    audit?: Audit;
}
