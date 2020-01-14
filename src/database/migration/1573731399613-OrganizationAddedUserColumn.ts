import {MigrationInterface, QueryRunner} from "typeorm";

export class OrganizationAddedUserColumn1573731399613 implements MigrationInterface {
    name = "OrganizationAddedUserColumn1573731399613"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"organization\" ADD \"user_id\" bigint", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\" FOREIGN KEY (\"user_id\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"organization\" DROP CONSTRAINT \"FK_b93269ca4d9016837d22ab6e1e0\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP COLUMN \"user_id\"", undefined);
    }

}
