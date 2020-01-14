import {MigrationInterface, QueryRunner} from "typeorm";

export class BaseTableChangeTimestamptzToTimestamp1574048088884 implements MigrationInterface {
    name = "BaseTableChangeTimestamptzToTimestamp1574048088884"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"member\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"member\" ADD \"created_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"member\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"member\" ADD \"updated_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"created_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"updated_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD \"created_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD \"updated_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD \"created_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD \"updated_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"created_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"updated_at\" TIMESTAMP NOT NULL DEFAULT now()", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"repository\" ADD \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"organization\" ADD \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"user\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"user\" ADD \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"member\" DROP COLUMN \"updated_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"member\" ADD \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
        await queryRunner.query("ALTER TABLE \"member\" DROP COLUMN \"created_at\"", undefined);
        await queryRunner.query("ALTER TABLE \"member\" ADD \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()", undefined);
    }

}
