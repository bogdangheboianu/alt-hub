import { ProjectEntity } from '@projects/entities/project.entity';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectsClientName1666766837835 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const projects = await this.getAllProjects( queryRunner );

        for( const p of projects ) {
            const clientName = valueIsNotEmpty( p.info.client?.name )
                               ? `'${ p.info.client!.name }'`
                               : 'NULL';
            await queryRunner.query( `
                UPDATE projects
                SET info_client_name = ${ clientName }
                WHERE id = '${ p.id }'
            ` );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `
            UPDATE projects
            SET info_client_name = NULL
        ` );
    }

    private async getAllProjects(queryRunner: QueryRunner): Promise<ProjectEntity[]> {
        return queryRunner.connection.getRepository( ProjectEntity )
                          .createQueryBuilder( 'p' )
                          .leftJoinAndSelect( 'p.info.client', 'client' )
                          .getMany();
    }
}
