import { ProjectName } from '@projects/models/project-name';
import { IValueObject } from '@shared/interfaces/generics/value-object.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { FullName } from '@users/models/full-name';
import { ICsvWorkLog } from '@work-logs/interfaces/csv-work-log.interface';
import { WorkLog } from '@work-logs/models/work-log';

export class CsvWorkLog implements IValueObject<CsvWorkLog, ICsvWorkLog> {
    private readonly date: MandatoryDate;
    private readonly projectName: ProjectName;
    private readonly hoursLogged: PositiveNumber;
    private readonly userFullName: FullName;

    private constructor(data: ICsvWorkLog) {
        this.date = data.date;
        this.projectName = data.projectName;
        this.hoursLogged = data.hoursLogged;
        this.userFullName = data.userFullName;
    }

    static create(workLog: WorkLog): CsvWorkLog {
        return new CsvWorkLog( {
                                   date        : workLog.date,
                                   projectName : workLog.project.info.name,
                                   hoursLogged : workLog.minutesLogged.divideBy( 60 ),
                                   userFullName: workLog.user.personalInfo.fullName
                               } );
    }

    equals(to: CsvWorkLog): boolean {
        return this.date.equals( to.date )
            && this.projectName.equals( to.projectName )
            && this.hoursLogged.equals( to.hoursLogged )
            && this.userFullName.equals( to.userFullName );
    }

    getValue(): ICsvWorkLog {
        return {
            date        : this.date,
            projectName : this.projectName,
            hoursLogged : this.hoursLogged,
            userFullName: this.userFullName
        };
    }
}
