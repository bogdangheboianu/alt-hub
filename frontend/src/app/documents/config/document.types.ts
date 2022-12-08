import { CreateDocumentDto } from '@dtos/create-document-dto';

export type CreateDocumentWithFiles = CreateDocumentDto & { files: File[] };
