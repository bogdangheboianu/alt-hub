import { WorkLogDto } from '@dtos/work-log.dto';

export interface IWorkLogDialogData {
    userId: string;
    workLog?: WorkLogDto;
}
