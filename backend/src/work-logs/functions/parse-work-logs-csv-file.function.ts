import { ProjectName } from '@projects/models/project-name';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { PositiveNumber } from '@shared/models/numerical/positive-number';
import { FullName } from '@users/models/full-name';
import { ICsvWorkLog } from '@work-logs/interfaces/csv-work-log.interface';
import { Options, parse } from 'csv-parse/sync';
import { Express } from 'express';

export interface CsvWorkLogFileParseResult {
    successful: ICsvWorkLog[];
    failed: number;
}

enum WorkLogCsvColumn {
    Date         = 'Data',
    LoggedHours  = 'Ore',
    Projects     = 'Detalii task',
    EmployeeName = 'Resurse'
}

type WorkLogCsvRow = {
    [WorkLogCsvColumn.Date]: Date,
    [WorkLogCsvColumn.LoggedHours]: number,
    [WorkLogCsvColumn.Projects]: string,
    [WorkLogCsvColumn.EmployeeName]: string
}

const parseOptions: Options = {
    delimiter     : ',',
    columns       : true,
    skipEmptyLines: true,
    cast          : true,
    castDate      : true
};

const COMMA = ',';
const AND = '&';
const PLUS = '+';

export function parseWorkLogsCsvFile(csvFile: Express.Multer.File): CsvWorkLogFileParseResult {
    const result: CsvWorkLogFileParseResult = { successful: [], failed: 0 };
    const rows: WorkLogCsvRow[] = parse( csvFile.buffer, parseOptions );

    rows.forEach( row => {
        if( rowHasMultipleProjects( row ) ) {
            const csvWorkLogs = rowToCsvWorkLogList( row );
            result.failed += csvWorkLogs.failed;
            result.successful = [ ...result.successful, ...csvWorkLogs.successful ];
        } else {
            const csvWorkLog = rowToCsvWorkLog( row );
            csvWorkLog.isFailed
            ? result.failed += 1
            : result.successful.push( csvWorkLog.value! );
        }
    } );

    return result;
}

function rowToCsvWorkLog(row: WorkLogCsvRow): Result<ICsvWorkLog> {
    const date = MandatoryDate.create( row[WorkLogCsvColumn.Date], 'date' );
    const hoursLogged = PositiveNumber.create( row[WorkLogCsvColumn.LoggedHours], 'hoursLogged' );
    const projectName = ProjectName.create( row[WorkLogCsvColumn.Projects], 'projectName' );
    const [ firstName, lastName ] = row[WorkLogCsvColumn.EmployeeName].split( ' ' );
    const userFullName = FullName.create( firstName, lastName );

    return Result.aggregateObjects<ICsvWorkLog>( { date }, { projectName }, { hoursLogged }, { userFullName } );
}

function rowToCsvWorkLogList(row: WorkLogCsvRow): CsvWorkLogFileParseResult {
    const result: CsvWorkLogFileParseResult = { successful: [], failed: 0 };
    const projectNamesUnchecked = getProjectNamesFromField( row[WorkLogCsvColumn.Projects] );
    const projectNames: ProjectName[] = projectNamesUnchecked.filter( name => name.isSuccessful )
                                                             .map( name => name.value! );
    result.failed = projectNamesUnchecked.filter( name => name.isFailed ).length;
    const totalProjects = projectNames.length;

    if( totalProjects === 0 ) {
        return result;
    }

    const date = MandatoryDate.create( row[WorkLogCsvColumn.Date], 'date' );
    const hoursLogged = PositiveNumber.create( row[WorkLogCsvColumn.LoggedHours], 'hoursLogged' );
    const [ firstName, lastName ] = row[WorkLogCsvColumn.EmployeeName].split( ' ' );
    const userFullName = FullName.create( firstName, lastName );

    if( date.isFailed || hoursLogged.isFailed || userFullName.isFailed ) {
        return { successful: [], failed: totalProjects };
    }

    const hoursLoggedPerProject = getHoursLoggedPerProject( hoursLogged.value!, totalProjects );

    result.successful = projectNames.map( projectName => (
        {
            date        : date.value!,
            hoursLogged : hoursLoggedPerProject,
            projectName,
            userFullName: userFullName.value!,
            description: null
        }
    ) );

    return result;
}

function rowHasMultipleProjects(row: WorkLogCsvRow): boolean {
    const projectsField = row[WorkLogCsvColumn.Projects];
    return projectsField.includes( COMMA ) || projectsField.includes( AND ) || projectsField.includes( PLUS );
}

function getProjectNamesFromField(field: string): Result<ProjectName>[] {
    return extractProjectNamesFromField( field )
        .map( name => ProjectName.create( name, 'projectName' ) );
}

function extractProjectNamesFromField(field: string): string[] {
    return field.split( /[,&+]+/ );
}

function getHoursLoggedPerProject(hoursLogged: PositiveNumber, totalProjects: number): PositiveNumber {
    const hoursPerProject = Math.round( hoursLogged.getValue() / totalProjects );
    return PositiveNumber.create( hoursPerProject, 'hoursPerProject' ).value!;
}
