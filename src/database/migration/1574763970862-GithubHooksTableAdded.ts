import {MigrationInterface, QueryRunner} from "typeorm";

export class GithubHooksTableAdded1574763970862 implements MigrationInterface {
    name = "GithubHooksTableAdded1574763970862"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE \"github_hooks\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"archived\" boolean NOT NULL, \"source_meta\" jsonb NOT NULL, CONSTRAINT \"PK_78d16e640a72a5f2550e50f1181\" PRIMARY KEY (\"id\"))", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE \"github_hooks\"", undefined);
    }

}
