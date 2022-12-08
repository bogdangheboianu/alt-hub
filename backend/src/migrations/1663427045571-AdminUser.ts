import { MigrationInterface, QueryRunner } from 'typeorm';
import { ADMIN_USER, DEFAULT_COMPANY_POSITION } from './config/migration.constants';

export class AdminUser1663427045571 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `
            INSERT INTO users (id,
                               account_email,
                               account_username,
                               account_password,
                               account_last_login_at,
                               account_status,
                               account_is_admin,
                               audit_created_at,
                               audit_updated_at,
                               audit_created_by,
                               audit_updated_by,
                               audit_version,
                               personal_info_first_name,
                               personal_info_last_name,
                               personal_info_date_of_birth,
                               personal_info_phone,
                               personal_info_ssn,
                               personal_info_address,
                               employment_info_company_position_id,
                               employment_info_employee_id,
                               employment_info_hired_on,
                               employment_info_left_on)
            VALUES ('${ ADMIN_USER.id }',
                    '${ ADMIN_USER.account.email }',
                    '${ ADMIN_USER.account.username }',
                    '${ ADMIN_USER.account.password }',
                    ${ ADMIN_USER.account.lastLoginAt },
                    '${ ADMIN_USER.account.status }',
                    ${ ADMIN_USER.account.isAdmin },
                    '${ ADMIN_USER.audit.createdAt.toISOString() }',
                    null, null, null,
                    ${ ADMIN_USER.audit.version },
                    '${ ADMIN_USER.personalInfo.firstName }',
                    '${ ADMIN_USER.personalInfo.lastName }',
                    '${ ADMIN_USER.personalInfo.dateOfBirth.toISOString() }',
                    '${ ADMIN_USER.personalInfo.phone }',
                    '${ ADMIN_USER.personalInfo.ssn }',
                    '${ ADMIN_USER.personalInfo.address }',
                    '${ DEFAULT_COMPANY_POSITION.id }',
                    '${ ADMIN_USER.employmentInfo.employeeId }',
                    '${ ADMIN_USER.employmentInfo.hiredOn.toISOString() }',
                    ${ ADMIN_USER.employmentInfo.leftOn })
        ` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `DELETE
                                  FROM users
                                  WHERE id = '${ ADMIN_USER.id }'` );
    }
}
