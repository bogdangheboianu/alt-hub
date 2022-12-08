import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectPricing1669494590280 implements MigrationInterface {
    name = 'ProjectPricing1669494590280';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `ALTER TABLE "projects"
            ADD "pricing_hourly_rate_amount" integer` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD "pricing_hourly_rate_currency" "public"."currency_enum"` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD "pricing_fixed_price_amount" integer` );
        await queryRunner.query( `ALTER TABLE "projects"
            ADD "pricing_fixed_price_currency" "public"."currency_enum"` );
        await queryRunner.query( `ALTER TABLE "project_members"
            ADD "allocated_hours" integer` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `ALTER TABLE "project_members"
            DROP COLUMN "allocated_hours"` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP COLUMN "pricing_fixed_price_currency"` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP COLUMN "pricing_fixed_price_amount"` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP COLUMN "pricing_hourly_rate_currency"` );
        await queryRunner.query( `ALTER TABLE "projects"
            DROP COLUMN "pricing_hourly_rate_amount"` );
    }

}
