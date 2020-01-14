import {MigrationInterface, QueryRunner} from "typeorm";

export class KeyColumnAdded1573890316435 implements MigrationInterface {
    name = "KeyColumnAdded1573890316435"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_5a2a0e7f6d81081649b3dcfde5\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" RENAME COLUMN \"login\" TO \"username\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" RENAME COLUMN \"login\" TO \"key\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" RENAME COLUMN \"full_name\" TO \"key\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"key\" text NOT NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_78a916df40e02a9deb1c4b75ed\" ON \"user\" (\"username\") ", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_23bb5a3b77620dbda59236f613\" ON \"organization\" (\"key\") ", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_c53f1f28db1cebb337ea9401a9\" ON \"repository\" (\"key\") ", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_1afe905ccf5083595a14501a4b\" ON \"pull_request\" (\"key\") ", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_1afe905ccf5083595a14501a4b\"", undefined);
        await queryRunner.query("DROP INDEX \"IDX_c53f1f28db1cebb337ea9401a9\"", undefined);
        await queryRunner.query("DROP INDEX \"IDX_23bb5a3b77620dbda59236f613\"", undefined);
        await queryRunner.query("DROP INDEX \"IDX_78a916df40e02a9deb1c4b75ed\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"key\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" RENAME COLUMN \"key\" TO \"full_name\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" RENAME COLUMN \"key\" TO \"login\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" RENAME COLUMN \"username\" TO \"login\"", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_5a2a0e7f6d81081649b3dcfde5\" ON \"organization\" (\"login\") ", undefined);
    }

}
