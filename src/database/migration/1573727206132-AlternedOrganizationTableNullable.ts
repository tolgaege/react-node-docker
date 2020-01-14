import {MigrationInterface, QueryRunner} from "typeorm";

export class AlternedOrganizationTableNullable1573727206132 implements MigrationInterface {
    name = "AlternedOrganizationTableNullable1573727206132"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"organization\" ALTER COLUMN \"email\" DROP NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"organization\" ALTER COLUMN \"email\" SET NOT NULL", undefined);
    }

}
