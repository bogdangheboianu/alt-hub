import { MigrationInterface, QueryRunner } from 'typeorm';

export class FilesAndDocuments1669836708645 implements MigrationInterface {
    name = 'FilesAndDocuments1669836708645';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `CREATE TYPE "public"."documents_type_enum" AS ENUM('employment_agreement', 'amendment', 'independent_contractor_agreement', 'master_service_agreement', 'non_disclosure_agreement', 'non_compete_agreement', 'partnership_agreement', 'statement_of_work', 'security_and_privacy_addendum', 'termination_notice')` );
        await queryRunner.query( `CREATE TABLE "documents"
                                  (
                                      "id"               uuid                           NOT NULL,
                                      "type"             "public"."documents_type_enum" NOT NULL,
                                      "audit_created_at" TIMESTAMP WITH TIME ZONE       NOT NULL,
                                      "audit_updated_at" TIMESTAMP WITH TIME ZONE,
                                      "audit_created_by" uuid,
                                      "audit_updated_by" uuid,
                                      "audit_version"    integer                        NOT NULL,
                                      CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")
                                  )` );
        await queryRunner.query( `CREATE TABLE "files"
                                  (
                                      "id"               uuid                     NOT NULL,
                                      "name"             character varying        NOT NULL,
                                      "mime_type"        character varying        NOT NULL,
                                      "buffer"           bytea                    NOT NULL,
                                      "document_id"      uuid,
                                      "audit_created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                                      "audit_updated_at" TIMESTAMP WITH TIME ZONE,
                                      "audit_created_by" uuid,
                                      "audit_updated_by" uuid,
                                      "audit_version"    integer                  NOT NULL,
                                      CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
                                  )` );
        await queryRunner.query( `CREATE TABLE "documents_x_companies"
                                  (
                                      "document_id" uuid NOT NULL,
                                      "company_id"  uuid NOT NULL,
                                      CONSTRAINT "PK_8a30bee7fff1d45704abd759727" PRIMARY KEY ("document_id", "company_id")
                                  )` );
        await queryRunner.query( `CREATE INDEX "IDX_0165bb6b85582c341e109db3b4" ON "documents_x_companies" ("document_id") ` );
        await queryRunner.query( `CREATE INDEX "IDX_93dd08342822de4e5492081460" ON "documents_x_companies" ("company_id") ` );
        await queryRunner.query( `CREATE TABLE "documents_x_users"
                                  (
                                      "document_id" uuid NOT NULL,
                                      "user_id"     uuid NOT NULL,
                                      CONSTRAINT "PK_269af636083f3cf40399a33ba48" PRIMARY KEY ("document_id", "user_id")
                                  )` );
        await queryRunner.query( `CREATE INDEX "IDX_fc85d57e11d7de3e31dd6cb2c2" ON "documents_x_users" ("document_id") ` );
        await queryRunner.query( `CREATE INDEX "IDX_5e491c7eef2c3a9c689e4fbcb4" ON "documents_x_users" ("user_id") ` );
        await queryRunner.query( `ALTER TABLE "files"
            ADD CONSTRAINT "FK_59226e49b38b22073a2a5315535" FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "documents_x_companies"
            ADD CONSTRAINT "FK_0165bb6b85582c341e109db3b4d" FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE` );
        await queryRunner.query( `ALTER TABLE "documents_x_companies"
            ADD CONSTRAINT "FK_93dd08342822de4e5492081460b" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE` );
        await queryRunner.query( `ALTER TABLE "documents_x_users"
            ADD CONSTRAINT "FK_fc85d57e11d7de3e31dd6cb2c28" FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE` );
        await queryRunner.query( `ALTER TABLE "documents_x_users"
            ADD CONSTRAINT "FK_5e491c7eef2c3a9c689e4fbcb4b" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE` );
        await queryRunner.query( `CREATE TABLE "documents_x_clients"
                                  (
                                      "document_id" uuid NOT NULL,
                                      "client_id"   uuid NOT NULL,
                                      CONSTRAINT "PK_6d6d8335d69682826672341bacb" PRIMARY KEY ("document_id", "client_id")
                                  )` );
        await queryRunner.query( `CREATE INDEX "IDX_3ade5db457618bae25f604806a" ON "documents_x_clients" ("document_id") ` );
        await queryRunner.query( `CREATE INDEX "IDX_80ba88583ed1490fcbe1855907" ON "documents_x_clients" ("client_id") ` );
        await queryRunner.query( `ALTER TABLE "documents_x_clients"
            ADD CONSTRAINT "FK_3ade5db457618bae25f604806ab" FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE` );
        await queryRunner.query( `ALTER TABLE "documents_x_clients"
            ADD CONSTRAINT "FK_80ba88583ed1490fcbe1855907b" FOREIGN KEY ("client_id") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query( `ALTER TABLE "documents_x_users"
            DROP CONSTRAINT "FK_5e491c7eef2c3a9c689e4fbcb4b"` );
        await queryRunner.query( `ALTER TABLE "documents_x_users"
            DROP CONSTRAINT "FK_fc85d57e11d7de3e31dd6cb2c28"` );
        await queryRunner.query( `ALTER TABLE "documents_x_companies"
            DROP CONSTRAINT "FK_93dd08342822de4e5492081460b"` );
        await queryRunner.query( `ALTER TABLE "documents_x_companies"
            DROP CONSTRAINT "FK_0165bb6b85582c341e109db3b4d"` );
        await queryRunner.query( `ALTER TABLE "files"
            DROP CONSTRAINT "FK_59226e49b38b22073a2a5315535"` );
        await queryRunner.query( `ALTER TABLE "documents_x_clients"
            DROP CONSTRAINT "FK_80ba88583ed1490fcbe1855907b"` );
        await queryRunner.query( `ALTER TABLE "documents_x_clients"
            DROP CONSTRAINT "FK_3ade5db457618bae25f604806ab"` );
        await queryRunner.query( `DROP INDEX "public"."IDX_5e491c7eef2c3a9c689e4fbcb4"` );
        await queryRunner.query( `DROP INDEX "public"."IDX_fc85d57e11d7de3e31dd6cb2c2"` );
        await queryRunner.query( `DROP TABLE "documents_x_users"` );
        await queryRunner.query( `DROP INDEX "public"."IDX_93dd08342822de4e5492081460"` );
        await queryRunner.query( `DROP INDEX "public"."IDX_0165bb6b85582c341e109db3b4"` );
        await queryRunner.query( `DROP TABLE "documents_x_companies"` );
        await queryRunner.query( `DROP INDEX "public"."IDX_80ba88583ed1490fcbe1855907"` );
        await queryRunner.query( `DROP INDEX "public"."IDX_3ade5db457618bae25f604806a"` );
        await queryRunner.query( `DROP TABLE "documents_x_clients"` );
        await queryRunner.query( `DROP TABLE "files"` );
        await queryRunner.query( `DROP TYPE "public"."files_extension_enum"` );
        await queryRunner.query( `DROP TABLE "documents"` );
        await queryRunner.query( `DROP TYPE "public"."documents_type_enum"` );
    }

}
