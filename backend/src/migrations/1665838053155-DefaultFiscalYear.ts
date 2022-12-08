import { MigrationInterface, QueryRunner } from 'typeorm';
import { COMPANY, DEFAULT_FISCAL_YEAR } from './config/migration.constants';

export class DefaultFiscalYear1665838053155 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO fiscal_years (
                    id, 
                    type,
                    start_date,
                    end_date,
                    company_id,
                    audit_created_at,                    
                    audit_updated_at, 
                    audit_created_by,
                    audit_updated_by,                                         
                    audit_version
                )
                VALUES ('${ DEFAULT_FISCAL_YEAR.id }',
                        '${ DEFAULT_FISCAL_YEAR.type }',
                        '${ DEFAULT_FISCAL_YEAR.startDate.toISOString() }',
                        '${ DEFAULT_FISCAL_YEAR.endDate.toISOString() }',
                        '${ COMPANY.id }',
                        '${ DEFAULT_FISCAL_YEAR.audit.createdAt.toISOString() }',
                        null, null, null,
                        ${ DEFAULT_FISCAL_YEAR.audit.version })
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `DELETE
                                  FROM fiscal_years
                                  WHERE id = '${ DEFAULT_FISCAL_YEAR.id }'` );
    }
}
