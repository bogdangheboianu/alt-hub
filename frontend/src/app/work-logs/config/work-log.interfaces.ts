import { CreateWorkLogRecurrenceDto } from '@dtos/create-work-log-recurrence-dto';
import { CreateWorkLogsDto } from '@dtos/create-work-logs-dto';
import { UpdateWorkLogDto } from '@dtos/update-work-log-dto';
import { UpdateWorkLogRecurrenceDto } from '@dtos/update-work-log-recurrence-dto';
import { WorkLogDto } from '@dtos/work-log-dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence-dto';
import { IFormModalData } from '@shared/config/constants/shared.interfaces';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { Observable } from 'rxjs';

export interface WorkLogCreateFormModalData extends IFormModalData<CreateWorkLogsDto> {
    projectOptions$: Observable<SelectInputOptions>;
    projectOptionsLoading$: Observable<boolean>;
}

export interface WorkLogUpdateFormModalData extends IFormModalData<UpdateWorkLogDto> {
    initialValues: WorkLogDto;
    projectOptions$: Observable<SelectInputOptions>;
    projectOptionsLoading$: Observable<boolean>;
    onDelete: () => void;
}

export interface WorkLogRecurrenceCreateFormModalData extends IFormModalData<CreateWorkLogRecurrenceDto> {
    projectOptions$: Observable<SelectInputOptions>;
    projectOptionsLoading$: Observable<boolean>;
}

export interface WorkLogRecurrenceUpdateFormModalData extends IFormModalData<UpdateWorkLogRecurrenceDto> {
    initialValues: WorkLogRecurrenceDto;
    onDelete: () => void;
}
