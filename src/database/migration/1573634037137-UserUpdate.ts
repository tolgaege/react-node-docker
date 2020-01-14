import {MigrationInterface, QueryRunner} from "typeorm";

export class UserUpdate1573634037137 implements MigrationInterface {
    name = "UserUpdate1573634037137"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"username\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"login\" text NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"name\" text NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"access_token\" text NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"email\" SET NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"user\" ALTER COLUMN \"email\" DROP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"access_token\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"name\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"login\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"username\" text NOT NULL", undefined);
    }

}
