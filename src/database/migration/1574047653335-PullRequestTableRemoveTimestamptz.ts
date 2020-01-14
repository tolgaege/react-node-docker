import {MigrationInterface, QueryRunner} from "typeorm";

export class PullRequestTableRemoveTimestamptz1574047653335 implements MigrationInterface {
    name = "PullRequestTableRemoveTimestamptz1574047653335"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_created_at\" TIMESTAMP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_updated_at\" TIMESTAMP NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_closed_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_closed_at\" TIMESTAMP", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_merged_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_merged_at\" TIMESTAMP", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_merged_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_merged_at\" TIMESTAMP WITH TIME ZONE", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_closed_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_closed_at\" TIMESTAMP WITH TIME ZONE", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"pr_created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"pr_created_at\" TIMESTAMP WITH TIME ZONE NOT NULL", undefined);
    }

}
