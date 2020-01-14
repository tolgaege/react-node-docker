import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTableAdded1573301216413 implements MigrationInterface {
    name = "UserTableAdded1573301216413"

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("CREATE TYPE \"user_access_level_enum\" AS ENUM('0', '1')", undefined);
      await queryRunner.query("CREATE TABLE \"user\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"username\" text NOT NULL, \"email\" text, \"access_level\" \"user_access_level_enum\" NOT NULL DEFAULT '1', CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\"))", undefined);
      await queryRunner.query("CREATE UNIQUE INDEX \"IDX_e12875dfb3b1d92d7d7c5377e2\" ON \"user\" (\"email\") ", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query("DROP INDEX \"IDX_e12875dfb3b1d92d7d7c5377e2\"", undefined);
      await queryRunner.query("DROP TABLE \"user\"", undefined);
      await queryRunner.query("DROP TYPE \"user_access_level_enum\"", undefined);
    }
}
