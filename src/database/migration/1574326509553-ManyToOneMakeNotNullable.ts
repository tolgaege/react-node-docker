import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyToOneMakeNotNullable1574326509553 implements MigrationInterface {
    name = "ManyToOneMakeNotNullable1574326509553"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"organization\" DROP CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ALTER COLUMN \"user_id\" SET NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ALTER COLUMN \"organization_id\" SET NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ALTER COLUMN \"repository_id\" SET NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" DROP CONSTRAINT \"FK_8046198d7115b252bb07066ffbb\"", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ALTER COLUMN \"repository_id\" SET NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\" FOREIGN KEY (\"user_id\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD CONSTRAINT \"FK_8046198d7115b252bb07066ffbb\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"commit\" DROP CONSTRAINT \"FK_8046198d7115b252bb07066ffbb\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\"", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ALTER COLUMN \"repository_id\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"commit\" ADD CONSTRAINT \"FK_8046198d7115b252bb07066ffbb\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ALTER COLUMN \"repository_id\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ALTER COLUMN \"organization_id\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ALTER COLUMN \"user_id\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\" FOREIGN KEY (\"user_id\") REFERENCES \"user\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

}
