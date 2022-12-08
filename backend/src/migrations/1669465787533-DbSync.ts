import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { COMPANY, DEFAULT_COMPANY_POSITION, DEFAULT_PRICING_PROFILE } from './config/migration.constants';

export class DbSync1669465787533 implements MigrationInterface {
    name = 'DbSync1669465787533';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "username" TO "account_username"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "password" TO "account_password"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "last_login_at" TO "account_last_login_at"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "status" TO "account_status"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "is_admin" TO "account_is_admin"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employee_info_company_position_id" TO "employment_info_company_position_id"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "personal_info_email" TO "account_email"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employee_info_employee_id" TO "employment_info_employee_id"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employee_info_hired_on" TO "employment_info_hired_on"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employee_info_left_on" TO "employment_info_left_on"` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "employment_info_hired_on" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "employment_info_left_on" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "personal_info_date_of_birth" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TYPE "public"."users_status_enum" RENAME TO "users_account_status_enum"` );
        await queryRunner.query( `ALTER TABLE "users"
            DROP CONSTRAINT "FK_6af15ff05147eea9407a5f53f0b"` );
        await queryRunner.query( `ALTER TABLE "users"
            ADD CONSTRAINT "FK_e7141256c85b55f8e845c5e8abc" FOREIGN KEY ("employment_info_company_position_id") REFERENCES "company_positions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );

        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "name" TO "info_name"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "slug" TO "info_slug"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "start_date" TO "timeline_start_date"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "end_date" TO "timeline_end_date"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "deadline" TO "timeline_deadline"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "status" TO "timeline_status"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "description" TO "info_description"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "client_name" TO "info_client_name"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "client_id" TO "info_client_id"` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP COLUMN "coordinator_user_id"` );
        await queryRunner.query( `ALTER TABLE "projects"
            ALTER COLUMN "timeline_start_date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "projects"
            ALTER COLUMN "timeline_end_date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "projects"
            ALTER COLUMN "timeline_deadline" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP CONSTRAINT "FK_ca29f959102228649e714827478"` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD CONSTRAINT "FK_069b5abc9305cb3ad5cee7d170b" FOREIGN KEY ("info_client_id") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TYPE "public"."projects_status_enum" RENAME TO "projects_timeline_status_enum"` );
        await queryRunner.query( `CREATE TYPE "public"."projects_pricing_type_enum" AS ENUM('fixed_price', 'time_and_material')` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD "pricing_type" "public"."projects_pricing_type_enum"` );

        await queryRunner.query( `ALTER TABLE "vacations"
            ALTER COLUMN "from_date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "vacations"
            ALTER COLUMN "to_date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "fiscal_years"
            ALTER COLUMN "start_date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "fiscal_years"
            ALTER COLUMN "end_date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "holidays"
            ALTER COLUMN "date" TYPE TIMESTAMP WITH TIME ZONE` );
        await queryRunner.query( `ALTER TABLE "work_logs"
            ALTER COLUMN "date" TYPE TIMESTAMP WITH TIME ZONE` );

        await queryRunner.query( `CREATE TYPE "public"."currency_enum" AS ENUM('RON', 'EUR')` );
        await queryRunner.query( `CREATE TABLE "company_pricing_profiles"
                                  (
                                      "id"                   uuid                     NOT NULL,
                                      "name"                 character varying        NOT NULL,
                                      "company_position_id"  uuid                     NOT NULL,
                                      "company_id"           uuid,
                                      "audit_created_at"     TIMESTAMP WITH TIME ZONE NOT NULL,
                                      "audit_updated_at"     TIMESTAMP WITH TIME ZONE,
                                      "audit_created_by"     uuid,
                                      "audit_updated_by"     uuid,
                                      "audit_version"        integer                  NOT NULL,
                                      "hourly_rate_amount"   integer                  NOT NULL,
                                      "hourly_rate_currency" "public"."currency_enum" NOT NULL,
                                      CONSTRAINT "UQ_84d45e8324301a4ec5db387898a" UNIQUE ("name"),
                                      CONSTRAINT "PK_7becb62c6678c5736db71339ba0" PRIMARY KEY ("id")
                                  )` );
        await queryRunner.query( `ALTER TABLE "company_pricing_profiles"
            ADD CONSTRAINT "FK_5fa0102ca054a51d50e9f160d94" FOREIGN KEY ("company_position_id") REFERENCES "company_positions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "company_pricing_profiles"
            ADD CONSTRAINT "FK_6df950e428716239fa005c433db" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `CREATE TABLE "project_members"
                                  (
                                      "id"                         uuid                     NOT NULL,
                                      "is_coordinator"             boolean                  NOT NULL,
                                      "user_id"                    uuid                     NOT NULL,
                                      "company_pricing_profile_id" uuid                     NOT NULL,
                                      "project_id"                 uuid                     NOT NULL,
                                      "audit_created_at"           TIMESTAMP WITH TIME ZONE NOT NULL,
                                      "audit_updated_at"           TIMESTAMP WITH TIME ZONE,
                                      "audit_created_by"           uuid,
                                      "audit_updated_by"           uuid,
                                      "audit_version"              integer                  NOT NULL,
                                      CONSTRAINT "PK_0b2f46f804be4aea9234c78bcc9" PRIMARY KEY ("id")
                                  )` );
        await queryRunner.query( `ALTER TABLE "project_members"
            ADD CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "project_members"
            ADD CONSTRAINT "FK_e58546f88daf9f76466e2c9b6bd" FOREIGN KEY ("company_pricing_profile_id") REFERENCES "company_pricing_profiles" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "project_members"
            ADD CONSTRAINT "FK_b5729113570c20c7e214cf3f58d" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION` );

        await queryRunner.query( `
            INSERT INTO company_pricing_profiles (id, name, company_position_id, company_id, audit_created_at, audit_updated_at, audit_created_by, audit_updated_by, audit_version, hourly_rate_amount, hourly_rate_currency)
            VALUES ('${ DEFAULT_PRICING_PROFILE.id }',
                    '${ DEFAULT_PRICING_PROFILE.name }',
                    '${ DEFAULT_COMPANY_POSITION.id }',
                    '${ COMPANY.id }',
                    now(), null, null, null, 1,
                    ${ DEFAULT_PRICING_PROFILE.hourlyRate.amount },
                    '${ DEFAULT_PRICING_PROFILE.hourlyRate.currency }')
        ` );

        const projectsUsers: { project_id: string; user_id: string }[] = await queryRunner.connection.query( `SELECT *
                                                                                                              FROM projects_x_users` );

        for( const projectUser of projectsUsers ) {
            await queryRunner.query( `INSERT INTO project_members (id, is_coordinator, user_id, company_pricing_profile_id, project_id, audit_created_at, audit_updated_at, audit_created_by, audit_updated_by, audit_version)
                                      VALUES ('${ uuidv4() }',
                                              false,
                                              '${ projectUser.user_id }',
                                              '${ DEFAULT_PRICING_PROFILE.id }',
                                              '${ projectUser.project_id }',
                                              now(), null, null, null, 1)` );
        }

        await queryRunner.query( `DROP TABLE projects_x_users` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `ALTER TABLE "project_members"
            DROP CONSTRAINT "FK_b5729113570c20c7e214cf3f58d"` );
        await queryRunner.query( `ALTER TABLE "project_members"
            DROP CONSTRAINT "FK_e58546f88daf9f76466e2c9b6bd"` );
        await queryRunner.query( `ALTER TABLE "project_members"
            DROP CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8"` );
        await queryRunner.query( `ALTER TABLE "company_pricing_profiles"
            DROP CONSTRAINT "FK_6df950e428716239fa005c433db"` );
        await queryRunner.query( `ALTER TABLE "company_pricing_profiles"
            DROP CONSTRAINT "FK_5fa0102ca054a51d50e9f160d94"` );
        await queryRunner.query( `DROP TABLE "project_members"` );
        await queryRunner.query( `DROP TABLE "company_pricing_profiles"` );
        await queryRunner.query( `DROP TYPE "public"."currency_enum"` );

        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "account_username" TO "username"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "account_password" TO "password"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "account_last_login_at" TO "last_login_at"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "account_status" TO "status"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "account_is_admin" TO "is_admin"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employment_info_company_position_id" TO "employee_info_company_position_id"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "account_email" TO "personal_info_email"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employment_info_employee_id" TO "employee_info_employee_id"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employment_info_hired_on" TO "employee_info_hired_on"` );
        await queryRunner.query( `ALTER TABLE "users"
            RENAME COLUMN "employment_info_left_on" TO "employee_info_left_on"` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "employee_info_hired_on" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "employee_info_left_on" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "personal_info_date_of_birth" TYPE DATE` );
        await queryRunner.query( `ALTER TYPE "public"."users_account_status_enum" RENAME TO "users_status_enum"` );
        await queryRunner.query( `ALTER TABLE "users"
            DROP CONSTRAINT "FK_e7141256c85b55f8e845c5e8abc"` );
        await queryRunner.query( `ALTER TABLE "users"
            ADD CONSTRAINT "FK_6af15ff05147eea9407a5f53f0b" FOREIGN KEY ("employee_info_company_position_id") REFERENCES "company_positions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "info_name" TO "name"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "info_slug" TO "slug"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "timeline_start_date" TO "start_date"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "timeline_end_date" TO "end_date"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "timeline_deadline" TO "deadline"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "timeline_status" TO "status"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "info_description" TO "description"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "info_client_name" TO "client_name"` );
        await queryRunner.query( `ALTER TABLE "projects"
            RENAME COLUMN "info_client_id" TO "client_id"` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD COLUMN "coordinator_user_id" UUID` );
        await queryRunner.query( `ALTER TABLE "projects"
            ALTER COLUMN "start_date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "projects"
            ALTER COLUMN "end_date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "projects"
            ALTER COLUMN "deadline" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP CONSTRAINT "FK_069b5abc9305cb3ad5cee7d170b"` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD CONSTRAINT "FK_069b5abc9305cb3ad5cee7d170b" FOREIGN KEY ("client_id") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TYPE "public"."projects_timeline_status_enum" RENAME TO "projects_status_enum"` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP COLUMN "pricing_type"` );
        await queryRunner.query( `DROP TYPE "public"."projects_pricing_type_enum"` );

        await queryRunner.query( `ALTER TABLE "vacations"
            ALTER COLUMN "from_date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "vacations"
            ALTER COLUMN "to_date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "fiscal_years"
            ALTER COLUMN "start_date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "fiscal_years"
            ALTER COLUMN "end_date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "holidays"
            ALTER COLUMN "date" TYPE DATE` );
        await queryRunner.query( `ALTER TABLE "work_logs"
            ALTER COLUMN "date" TYPE DATE` );
    }

}
