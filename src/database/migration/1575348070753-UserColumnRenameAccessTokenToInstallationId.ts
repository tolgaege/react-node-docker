import {MigrationInterface, QueryRunner} from "typeorm";

export class UserColumnRenameAccessTokenToInstallationId1575348070753 implements MigrationInterface {
    name = "UserColumnRenameAccessTokenToInstallationId1575348070753"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_51737c5f6e9c495d31b50d567f\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"access_token\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"installation_id\" integer NOT NULL DEFAULT nextval('github_hook_id_seq')", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_07d20fe931f58975e9d2d9e5f4\" ON \"user\" (\"installation_id\")", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"installation_id\" DROP DEFAULT", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_07d20fe931f58975e9d2d9e5f4\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"installation_id\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"access_token\" text NOT NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_51737c5f6e9c495d31b50d567f\" ON \"user\" (\"access_token\") ", undefined);
    }

}
