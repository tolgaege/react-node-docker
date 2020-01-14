import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableFieldsForUserTable1573896814670 implements MigrationInterface {
    name = "NullableFieldsForUserTable1573896814670"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_e12875dfb3b1d92d7d7c5377e2\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"name\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"email\" DROP NOT NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_51737c5f6e9c495d31b50d567f\" ON \"user\" (\"access_token\") ", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX \"IDX_51737c5f6e9c495d31b50d567f\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"email\" SET NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"name\" SET NOT NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX \"IDX_e12875dfb3b1d92d7d7c5377e2\" ON \"user\" (\"email\") ", undefined);
    }

}
