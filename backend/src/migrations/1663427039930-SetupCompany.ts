import { MigrationInterface, QueryRunner } from 'typeorm';
import { COMPANY, DEFAULT_COMPANY_POSITION } from './config/migration.constants';

export class SetupCompany1663427039930 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.createCompany( queryRunner );
        await this.createDefaultCompanyPosition( queryRunner );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `DELETE
                                  FROM company_positions
                                  WHERE id = '${ DEFAULT_COMPANY_POSITION.id }'` );
        await queryRunner.query( `DELETE
                                  FROM companies
                                  WHERE id = '${ COMPANY.id }'` );
    }

    private async createCompany(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO companies (
                    id,
                    name,
                    audit_created_at,                    
                    audit_updated_at, 
                    audit_created_by,
                    audit_updated_by,                                         
                    audit_version
                )
                VALUES ('${ COMPANY.id }',
                        '${ COMPANY.name }',
                        '${ COMPANY.audit.createdAt.toISOString() }',
                        null, null, null,
                        ${ COMPANY.audit.version })
            `
        );
    }

    private async createDefaultCompanyPosition(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO company_positions (
                    id,
                    name,
                    slug,
                    company_id,
                    audit_created_at,                    
                    audit_updated_at, 
                    audit_created_by,
                    audit_updated_by,                                         
                    audit_version
                )
                VALUES ('${ DEFAULT_COMPANY_POSITION.id }',
                        '${ DEFAULT_COMPANY_POSITION.name }',
                        '${ DEFAULT_COMPANY_POSITION.slug }',
                        '${ COMPANY.id }',
                        '${ DEFAULT_COMPANY_POSITION.audit.createdAt.toISOString() }',
                        null, null, null,
                        ${ DEFAULT_COMPANY_POSITION.audit.version })
            `
        );
    }
}
