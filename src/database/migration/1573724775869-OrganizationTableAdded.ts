import {MigrationInterface, QueryRunner} from "typeorm";

export class OrganizationTableAdded1573724775869 implements MigrationInterface {
    name = "OrganizationTableAdded1573724775869"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE \"organization\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"login\" text NOT NULL, \"url\" text NOT NULL, \"email\" text NOT NULL, \"avatar_url\" text NOT NULL, \"description\" text, \"name\" text, \"company\" text, \"blog\" text, \"location\" text, \"type\" text, \"source_meta\" jsonb NOT NULL, CONSTRAINT \"PK_472c1f99a32def1b0abb219cd67\" PRIMARY KEY (\"id\"))", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_5a2a0e7f6d81081649b3dcfde5\" ON \"organization\" (\"login\") ", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_5a2a0e7f6d81081649b3dcfde5\"", undefined);
        await queryRunner.query("DROP TABLE \"organization\"", undefined);
    }

}
