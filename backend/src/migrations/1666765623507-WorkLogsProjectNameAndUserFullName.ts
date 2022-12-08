import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { WorkLogEntity } from '@work-logs/entities/work-log.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkLogsProjectNameAndUserFullName1666765623507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const workLogs = await this.getAllWorkLogs( queryRunner );

        for( const wl of workLogs ) {
            const userFullName = valueIsNotEmpty( wl.user )
                                 ? `${ wl.user.personalInfo.firstName } ${ wl.user.personalInfo.lastName }`
                                 : '';
            const projectName = valueIsNotEmpty( wl.project )
                                ? wl.project.info.name
                                : '';
            await queryRunner.query( `
                UPDATE work_logs
                SET user_full_name = '${ userFullName }',
                    project_name   = '${ projectName }'
                WHERE id = '${ wl.id }'
            ` );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `
            UPDATE work_logs
            SET user_full_name = NULL,
                project_name   = NULL
        ` );
    }

    private async getAllWorkLogs(queryRunner: QueryRunner): Promise<WorkLogEntity[]> {
        return queryRunner.connection.getRepository( WorkLogEntity )
                          .createQueryBuilder( 'wl' )
                          .leftJoinAndSelect( 'wl.user', 'user' )
                          .leftJoinAndSelect( 'wl.project', 'project' )
                          .getMany();
    }
}
