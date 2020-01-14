import {MigrationInterface, QueryRunner} from "typeorm";

export class RepositoryTableAdded1573883364363 implements MigrationInterface {
    name = "RepositoryTableAdded1573883364363"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE \"repository\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"name\" text NOT NULL, \"full_name\" text NOT NULL, \"html_url\" text NOT NULL, \"ssh_url\" text NOT NULL, \"clone_url\" text NOT NULL, \"source_meta\" jsonb NOT NULL, \"description\" text, \"organization_id\" bigint, CONSTRAINT \"PK_b842c26651c6fc0b9ccd1c530e2\" PRIMARY KEY (\"id\"))", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("DROP TABLE \"repository\"", undefined);
    }

}
