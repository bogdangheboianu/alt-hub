import { ProjectName } from '@projects/models/project-name';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { FullName } from '@users/models/full-name';

export interface ICsvWorkLog {
    date: MandatoryDate;
    projectName: ProjectName;
    hoursLogged: PositiveNumber;
    userFullName: FullName;
}
