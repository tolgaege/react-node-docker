import {MigrationInterface, QueryRunner} from "typeorm";

export class PullRequestCommitManyToManyTableRecreate1574152038550 implements MigrationInterface {
    name = "PullRequestCommitManyToManyTableRecreate1574152038550"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"organization\" DROP CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\"", undefined);
        await queryRunner.query("CREATE TABLE \"pull_request__commit\" (\"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"pull_request_id\" bigint NOT NULL, \"commit_id\" bigint NOT NULL, CONSTRAINT \"PK_e2704279ebfc4579f56d1800cda\" PRIMARY KEY (\"pull_request_id\", \"commit_id\"))", undefined);
        await queryRunner.query("CREATE TABLE \"commit\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"sha\" text NOT NULL, \"date\" TIMESTAMP NOT NULL, \"message\" text NOT NULL, \"repository_id\" bigint, CONSTRAINT \"PK_98f1c01f7e878fc55476f332c4e\" PRIMARY KEY (\"id\"))", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_bf4e0c42ebaa4cced416241b59\" ON \"commit\" (\"sha\") ", undefined);
        await queryRunner.query("ALTER TABLE \"member\" ADD \"email\" text", undefined);
        await queryRunner.query("ALTER TABLE \"member\" ADD \"name\" text", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\" FOREIGN KEY (\"user_id\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request__commit\" ADD CONSTRAINT \"FK_e9892eac63d4a939cf34d1d1f92\" FOREIGN KEY (\"pull_request_id\") REFERENCES \"pull_request\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request__commit\" ADD CONSTRAINT \"FK_04e59b175b591e40bbc51418466\" FOREIGN KEY (\"commit_id\") REFERENCES \"commit\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD CONSTRAINT \"FK_8046198d7115b252bb07066ffbb\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"commit\" DROP CONSTRAINT \"FK_8046198d7115b252bb07066ffbb\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request__commit\" DROP CONSTRAINT \"FK_04e59b175b591e40bbc51418466\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request__commit\" DROP CONSTRAINT \"FK_e9892eac63d4a939cf34d1d1f92\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\"", undefined);
        await queryRunner.query("ALTER TABLE \"member\" DROP COLUMN \"name\"", undefined);
        await queryRunner.query("ALTER TABLE \"member\" DROP COLUMN \"email\"", undefined);
        await queryRunner.query("DROP INDEX \"IDX_bf4e0c42ebaa4cced416241b59\"", undefined);
        await queryRunner.query("DROP TABLE \"commit\"", undefined);
        await queryRunner.query("DROP TABLE \"pull_request__commit\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\" FOREIGN KEY (\"user_id\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

}
