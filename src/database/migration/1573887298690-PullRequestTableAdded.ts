import {MigrationInterface, QueryRunner} from "typeorm";

export class PullRequestTableAdded1573887298690 implements MigrationInterface {
    name = "PullRequestTableAdded1573887298690"

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE \"pull_request\" (\"id\" BIGSERIAL NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), \"name\" text NOT NULL, \"title\" text, \"body\" text, \"labels\" text NOT NULL, \"url\" text NOT NULL, \"state\" text NOT NULL, \"number\" integer NOT NULL, \"pr_created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"pr_updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"pr_closed_at\" TIMESTAMP WITH TIME ZONE, \"pr_merged_at\" TIMESTAMP WITH TIME ZONE, \"source_meta\" jsonb NOT NULL, \"repository_id\" bigint, CONSTRAINT \"PK_2db8fa2766816707ba4a89ca9d5\" PRIMARY KEY (\"id\"))", undefined);
        await queryRunner.query("ALTER TABLE \"pull_request\" ADD CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\" FOREIGN KEY (\"repository_id\") REFERENCES \"repository\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE \"pull_request\" DROP CONSTRAINT \"FK_6e77a702ef953ab506bc441fff5\"", undefined);
        await queryRunner.query("DROP TABLE \"pull_request\"", undefined);
    }

}
