import {MigrationInterface, QueryRunner} from "typeorm";

export class GithubHooksAddedEventColumn1574858250112 implements MigrationInterface {
    name = "GithubHooksAddedEventColumn1574858250112"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"github_hooks\" ADD \"event\" text NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ALTER COLUMN \"organization_id\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"repository\" DROP CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ALTER COLUMN \"organization_id\" SET NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD CONSTRAINT \"FK_defde5786c8e724ae6c223e847c\" FOREIGN KEY (\"organization_id\") REFERENCES \"organization\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE \"github_hooks\" DROP COLUMN \"event\"", undefined);
    }

}
