import { MigrationInterface, QueryRunner } from 'typeorm';
import { ADMIN_USER, DEFAULT_COMPANY_POSITION } from './config/migration.constants';

export class AdminUser1663427045571 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `
            INSERT INTO users
            VALUES ('${ ADMIN_USER.id }',
                    '${ ADMIN_USER.username }',
                    '${ ADMIN_USER.password }',
                    ${ ADMIN_USER.lastLoginAt },
                    '${ ADMIN_USER.status }',
                    ${ ADMIN_USER.isAdmin },
                    '${ DEFAULT_COMPANY_POSITION.id }',
                    '${ ADMIN_USER.audit.createdAt.toISOString() }',
                    null, null, null,
                    ${ ADMIN_USER.audit.version },
                    '${ ADMIN_USER.personalInfo.firstName }',
                    '${ ADMIN_USER.personalInfo.lastName }',
                    '${ ADMIN_USER.personalInfo.dateOfBirth.toISOString() }',
                    '${ ADMIN_USER.personalInfo.email }',
                    '${ ADMIN_USER.personalInfo.phone }',
                    '${ ADMIN_USER.personalInfo.ssn }',
                    '${ ADMIN_USER.personalInfo.address }',
                    '${ ADMIN_USER.employeeInfo.employeeId }',
                    '${ ADMIN_USER.employeeInfo.hiredOn.toISOString() }',
                    ${ ADMIN_USER.employeeInfo.leftOn })
        ` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `DELETE
                                  FROM users
                                  WHERE id = '${ ADMIN_USER.id }'` );
    }
}
