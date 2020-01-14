import {MigrationInterface, QueryRunner} from "typeorm";

export class TeamTableCreated1575469546508 implements MigrationInterface {
    name = "TeamTableCreated1575469546508"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE \"team__repository\" (\"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"repository_id\" bigint NOT NULL, \"team_id\" bigint NOT NULL, CONSTRAINT \"PK_138f75d6301a492690072e47ed7\" PRIMARY KEY (\"repository_id\", \"team_id\"))", undefined);
        await queryRunner.query("CREATE TABLE \"team\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"key\" text NOT NULL, \"name\" text NOT NULL, \"slug\" text NOT NULL, \"description\" text, \"source_meta\" jsonb NOT NULL, \"organization_id\" bigint, CONSTRAINT \"PK_f57d8293406df4af348402e4b74\" PRIMARY KEY (\"id\"))", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_56adad28700186557f8d320918\" ON \"team\" (\"key\") ", undefined);
        await queryRunner.query("CREATE TABLE \"team__member\" (\"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"team_id\" bigint NOT NULL, \"member_id\" bigint NOT NULL, CONSTRAINT \"PK_d3fc75038a3a4b07f318f045522\" PRIMARY KEY (\"team_id\", \"member_id\"))", undefined);
        await queryRunner.query("CREATE TABLE \"repository__member\" (\"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), \"repository_id\" bigint NOT NULL, \"member_id\" bigint NOT NULL, CONSTRAINT \"PK_10b841ae3817aee258c8df7969e\" PRIMARY KEY (\"repository_id\", \"member_id\"))", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"creator_member_id\" bigint", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD \"author_member_id\" bigint", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD \"committer_member_id\" bigint", undefined);
        await queryRunner.query("ALTER TABLE \"team__repository\" ADD CONSTRAINT \"FK_24025b5ccdde205b377168eff90\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"team__repository\" ADD CONSTRAINT \"FK_10b5594e7f06b0be4a34c679b61\" FOREIGN KEY (\"team_id\") REFERENCES \"team\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"team\" ADD CONSTRAINT \"FK_b71618cf6c9cf1d30ff71b0320a\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"team__member\" ADD CONSTRAINT \"FK_e9ff1aac1ab15412dc5bfadd671\" FOREIGN KEY (\"team_id\") REFERENCES \"team\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"team__member\" ADD CONSTRAINT \"FK_277f93d9a0fdc07c9a23543d2b9\" FOREIGN KEY (\"member_id\") REFERENCES \"member\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"repository__member\" ADD CONSTRAINT \"FK_a2a082efb8040fa7ef3743a125c\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"repository__member\" ADD CONSTRAINT \"FK_1fc1c494b099c885b4cb062b83d\" FOREIGN KEY (\"member_id\") REFERENCES \"member\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD CONSTRAINT \"FK_d09218a4cb8b302f4531e2f3678\" FOREIGN KEY (\"creator_member_id\") REFERENCES \"member\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD CONSTRAINT \"FK_8e7eb40068a4544bf155166d6ca\" FOREIGN KEY (\"author_member_id\") REFERENCES \"member\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD CONSTRAINT \"FK_4726546a05f3d0d9837a2ac9caa\" FOREIGN KEY (\"committer_member_id\") REFERENCES \"member\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"commit\" DROP CONSTRAINT \"FK_4726546a05f3d0d9837a2ac9caa\"", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" DROP CONSTRAINT \"FK_8e7eb40068a4544bf155166d6ca\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP CONSTRAINT \"FK_d09218a4cb8b302f4531e2f3678\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository__member\" DROP CONSTRAINT \"FK_1fc1c494b099c885b4cb062b83d\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository__member\" DROP CONSTRAINT \"FK_a2a082efb8040fa7ef3743a125c\"", undefined);
        await queryRunner.query("ALTER TABLE \"team__member\" DROP CONSTRAINT \"FK_277f93d9a0fdc07c9a23543d2b9\"", undefined);
        await queryRunner.query("ALTER TABLE \"team__member\" DROP CONSTRAINT \"FK_e9ff1aac1ab15412dc5bfadd671\"", undefined);
        await queryRunner.query("ALTER TABLE \"team\" DROP CONSTRAINT \"FK_b71618cf6c9cf1d30ff71b0320a\"", undefined);
        await queryRunner.query("ALTER TABLE \"team__repository\" DROP CONSTRAINT \"FK_10b5594e7f06b0be4a34c679b61\"", undefined);
        await queryRunner.query("ALTER TABLE \"team__repository\" DROP CONSTRAINT \"FK_24025b5ccdde205b377168eff90\"", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" DROP COLUMN \"committer_member_id\"", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" DROP COLUMN \"author_member_id\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"creator_member_id\"", undefined);
        await queryRunner.query("DROP TABLE \"repository__member\"", undefined);
        await queryRunner.query("DROP TABLE \"team__member\"", undefined);
        await queryRunner.query("DROP INDEX \"IDX_56adad28700186557f8d320918\"", undefined);
        await queryRunner.query("DROP TABLE \"team\"", undefined);
        await queryRunner.query("DROP TABLE \"team__repository\"", undefined);
    }

}
