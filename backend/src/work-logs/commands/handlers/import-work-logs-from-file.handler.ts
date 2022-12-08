import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Project } from '@projects/models/project';
import { ProjectName } from '@projects/models/project-name';
import { ProjectRepository } from '@projects/repositories/project.repository';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { FullName } from '@users/models/full-name';
import { User } from '@users/models/user';
import { UserRepository } from '@users/repositories/user.repository';
import { ImportWorkLogsFromFileCommand } from '@work-logs/commands/impl/import-work-logs-from-file.command';
import { WorkLogsFileImportResultDto } from '@work-logs/dtos/work-logs-file-import-result.dto';
import { FailedToImportWorkLogsFromFileEvent } from '@work-logs/events/impl/failed-to-import-work-log-from-file.event';
import { WorkLogsImportedFromFileEvent } from '@work-logs/events/impl/work-logs-imported-from-file.event';
import { parseWorkLogsCsvFile } from '@work-logs/functions/parse-work-logs-csv-file.function';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogRepository } from '@work-logs/repositories/work-log.repository';
import { DataSource, EntityManager } from 'typeorm';

@CommandHandler( ImportWorkLogsFromFileCommand )
export class ImportWorkLogsFromFileHandler extends BaseSyncCommandHandler<ImportWorkLogsFromFileCommand, WorkLogsFileImportResultDto> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository,
        private readonly projectRepository: ProjectRepository,
        private readonly workLogRepository: WorkLogRepository,
        private readonly dataSource: DataSource
    ) {
        super();
    }

    override async execute(command: ImportWorkLogsFromFileCommand): Promise<Result<WorkLogsFileImportResultDto>> {
        const { successful: csvWorkLogs, failed } = parseWorkLogsCsvFile( command.data.payload.file );

        const importResult: WorkLogsFileImportResultDto = await this.dataSource.transaction( async (entityManager: EntityManager) => {
            const result: WorkLogsFileImportResultDto = { successful: 0, failed, total: csvWorkLogs.length + failed };
            const users: User[] = [];
            const notFoundUserFullNames: FullName[] = [];

            const projects: Project[] = [];
            const newProjects: Project[] = [];
            const workLogs: WorkLog[] = [];

            for( let { userFullName, projectName, hoursLogged, date } of csvWorkLogs ) {
                if( notFoundUserFullNames.some( fullName => fullName.equals( userFullName ) ) ) {
                    result.failed += 1;
                    continue;
                }

                let user: Result<User> | User | undefined = users.find( u => u.personalInfo.fullName.equals( userFullName ) );

                if( valueIsEmpty( user ) ) {
                    user = await this.getUserByFullName( userFullName );

                    if( user.isNotFound ) {
                        result.failed += 1;
                        notFoundUserFullNames.push( userFullName );
                        continue;
                    }

                    user = user.value!;
                    users.push( user );
                }

                let project: Result<Project | null> = Success( projects.find( p => p.info.name.equals( projectName ) ) ) ?? Success( newProjects.find( p => p.info.name.equals( projectName ) ) );

                if( valueIsEmpty( project.value ) ) {
                    project = await this.getProjectByName( projectName );

                    if( project.isNotFound ) {
                        project = Project.fromName( command, projectName );
                        newProjects.push( project.value! );
                    }

                    projects.push( project.value! );
                }

                // project.value!.addMembers( command, [ user ] );

                const workLog = WorkLog.fromImport( command, user as User, project.value as Project, date, hoursLogged.multiplyBy( 60 ) );
                workLogs.push( workLog );
            }

            await this.saveProjectsToDb( newProjects, entityManager );
            const savedWorkLogs = await this.saveWorkLogsToDb( workLogs, entityManager );

            result.successful += savedWorkLogs.length;

            return result;
        } );

        return this.successful( command, importResult );
    }

    protected override successful(command: ImportWorkLogsFromFileCommand, result: WorkLogsFileImportResultDto): Result<WorkLogsFileImportResultDto> {
        const { context } = command.data;
        const event = new WorkLogsImportedFromFileEvent( { context, payload: result } );

        this.eventBus.publish( event );

        return Success( result );
    }

    protected override failed(command: ImportWorkLogsFromFileCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToImportWorkLogsFromFileEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    private async getUserByFullName(fullName: FullName): Promise<Result<User>> {
        const user = await this.userRepository.findByFullName( fullName );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        return user;
    }

    private async getProjectByName(name: ProjectName): Promise<Result<Project>> {
        const project = await this.projectRepository.findByName( name );

        if( project.isFailed ) {
            throw new Exception( project.errors );
        }

        return project;
    }

    private async saveProjectsToDb(projects: Project[], entityManager: EntityManager): Promise<Project[]> {
        const savedProjects = await this.projectRepository.saveAll( projects, entityManager );

        if( savedProjects.isFailed ) {
            throw new Exception( savedProjects.errors );
        }

        return savedProjects.value!;
    }

    private async saveWorkLogsToDb(workLogs: WorkLog[], entityManager: EntityManager): Promise<WorkLog[]> {
        const savedWorkLogs = await this.workLogRepository.saveAll( workLogs, entityManager );

        if( savedWorkLogs.isFailed ) {
            throw new Exception( savedWorkLogs.errors );
        }

        return savedWorkLogs.value!;
    }
}
