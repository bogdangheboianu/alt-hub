import { UserEntity } from '@users/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ADMIN_USER, DEFAULT_AUDIT, DEFAULT_FISCAL_YEAR } from './config/migration.constants';

export class DefaultAnnualEmployeeSheets1666386566439 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        let users = await this.getAllUsersWithoutAnnualEmployeeSheet( queryRunner );
        const adminUser = ADMIN_USER;

        if( !users.some( usr => usr.id === adminUser.id ) ) {
            users = [ ...users, adminUser ];
        }

        for( const user of users ) {
            await queryRunner.query(
                `
                    INSERT INTO annual_employee_sheets (id,
                                                        paid_leave_days,
                                                        user_id,
                                                        fiscal_year_id,
                                                        audit_created_at,
                                                        audit_updated_at,
                                                        audit_created_by,
                                                        audit_updated_by,
                                                        audit_version,
                                                        remaining_paid_leave_days)
                    VALUES ('${ uuidv4() }',
                            21,
                            '${ user.id }',
                            '${ DEFAULT_FISCAL_YEAR.id }',
                            '${ DEFAULT_AUDIT.createdAt.toISOString() }',
                            null, null, null, 1,
                            21)
                `
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `DELETE
                                  FROM annual_employee_sheets;` );
    }

    private async getAllUsersWithoutAnnualEmployeeSheet(queryRunner: QueryRunner): Promise<UserEntity[]> {
        return await queryRunner.connection.getRepository( UserEntity )
                                .createQueryBuilder( 'user' )
                                .leftJoinAndSelect( 'user.annualSheets', 'sheet' )
                                .where( 'sheet.id IS NULL' )
                                .getMany();
    }
}
