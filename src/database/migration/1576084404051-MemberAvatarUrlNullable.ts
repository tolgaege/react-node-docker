import {MigrationInterface, QueryRunner} from "typeorm";

export class MemberAvatarUrlNullable1576084404051 implements MigrationInterface {
    name = "MemberAvatarUrlNullable1576084404051"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"member\" ALTER COLUMN \"avatar_url\" DROP NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"member\" ALTER COLUMN \"avatar_url\" SET NOT NULL", undefined);
    }

}
