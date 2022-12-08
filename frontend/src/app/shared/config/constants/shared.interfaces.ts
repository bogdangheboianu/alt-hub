import { AuditDto } from '@dtos/audit-dto';
import { Observable } from 'rxjs';

export interface IFormModalData<T> {
    loading$: Observable<boolean>;
    onSubmit: (data: T) => void;
    onCancel: () => void;
}

export interface Entity {
    id: string;
    audit: AuditDto;
}
