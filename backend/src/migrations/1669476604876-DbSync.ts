import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbSync1669476604876 implements MigrationInterface {
    name = 'DbSync1669476604876';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `ALTER TYPE "public"."users_account_status_enum" RENAME TO "users_account_status_enum_old"` );
        await queryRunner.query( `CREATE TYPE "public"."users_account_status_enum" AS ENUM('created', 'invited', 'active', 'suspended', 'inactive')` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "account_status" TYPE "public"."users_account_status_enum" USING "account_status"::"text"::"public"."users_account_status_enum"` );
        await queryRunner.query( `DROP TYPE "public"."users_account_status_enum_old"` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `CREATE TYPE "public"."users_account_status_enum_old" AS ENUM('created', 'invited', 'confirmed', 'active', 'suspended', 'inactive')` );
        await queryRunner.query( `ALTER TABLE "users"
            ALTER COLUMN "account_status" TYPE "public"."users_account_status_enum_old" USING "account_status"::"text"::"public"."users_account_status_enum_old"` );
        await queryRunner.query( `DROP TYPE "public"."users_account_status_enum"` );
        await queryRunner.query( `ALTER TYPE "public"."users_account_status_enum_old" RENAME TO "users_account_status_enum"` );
    }

}
