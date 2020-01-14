import {MigrationInterface, QueryRunner} from "typeorm";

export class MemberTableAdded1573895458778 implements MigrationInterface {
    name = "MemberTableAdded1573895458778"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE \"member\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"username\" text NOT NULL, \"avatar_url\" text NOT NULL, CONSTRAINT \"PK_97cbbe986ce9d14ca5894fdc072\" PRIMARY KEY (\"id\"))", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_1945f9202fcfbce1b439b47b77\" ON \"member\" (\"username\") ", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_1945f9202fcfbce1b439b47b77\"", undefined);
        await queryRunner.query("DROP TABLE \"member\"", undefined);
    }

}
