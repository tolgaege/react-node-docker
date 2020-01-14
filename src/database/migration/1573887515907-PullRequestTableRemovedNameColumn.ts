import {MigrationInterface, QueryRunner} from "typeorm";

export class PullRequestTableRemovedNameColumn1573887515907 implements MigrationInterface {
    name = "PullRequestTableRemovedNameColumn1573887515907"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"name\"", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"name\" text NOT NULL", undefined);
    }

}
