import {MigrationInterface, QueryRunner} from "typeorm";

export class GithubHooksTableRenamed1574858730147 implements MigrationInterface {
    name = "GithubHooksTableRenamed1574858730147"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE github_hooks RENAME TO github_hook", undefined);
        await queryRunner.query("ALTER SEQUENCE github_hooks_id_seq RENAME TO github_hook_id_seq", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE github_hook RENAME TO github_hooks", undefined);
        await queryRunner.query("ALTER SEQUENCE github_hooks_id_seq RENAME TO github_hooks_id_seq", undefined);
    }

}
