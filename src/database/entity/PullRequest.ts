import {
  Column, Entity, Index, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable
} from "typeorm";
import { Base } from "./Base";
import { PullRequestCommit } from "./PullRequestCommit";
import { Repository } from "./Repository";
import { Commit } from "./Commit";
import { Member } from "./Member";

@Entity({ name: "pull_request" })
export class PullRequest extends Base {

  // Format: :org/:repo/:pull_number (manually constructed)
  @Index({ unique: true })
  @Column({ name: "key", type: "text"})
  key: string

  @Column({ name: "title", type: "text", nullable: true })
  title: string | undefined

  @Column({ name: "body", type: "text", nullable: true })
  body: string | undefined

  @Column({ name: "labels", type: "simple-array"})
  labels: string[]

  @Column({ name: "url", type: "text" })
  url: string

  @Column({ name: "state", type: "text" })
  state: string

  @Column({ name: "number", type: "integer" })
  number: number

  @Column({ name: "pr_created_at" })
  prCreatedAt: Date

  @Column({ name: "pr_updated_at" })
  prUpdatedAt: Date

  @Column({ name: "pr_closed_at", nullable: true })
  prClosedAt: Date | undefined

  @Column({ name: "pr_merged_at", nullable: true })
  prMergedAt: Date | undefined

  // We need to have a @Column to make a ManyToMany not nullable
  @Column()
  repository_id: number;
  @ManyToOne(type => Repository, { onDelete: "CASCADE" })
  @JoinColumn({ name: "repository_id" })
  repository: Repository

  @OneToMany(type => PullRequestCommit, pullRequestCommit => pullRequestCommit.pullRequest, { cascade: true })
  pullRequestCommits: PullRequestCommit[];

  @ManyToOne(type => Member, { cascade: true })
  @JoinColumn({ name: "creator_member_id" })
  creator: Member

  @Column({ name: "source_meta", type: "jsonb", select: false })
  sourceMeta: object

  // TODO: Foreign key cannot be {nullable: true}
  // @Column({ name: "assignee", type: Member, nullable: true})
  // assignee: Member | undefined

  // @OneToMany(type => Member)
  // @JoinColumn({ name: "assignee_id"})
  // repository: Member

  // @OneToMany(type => Member)
  // @JoinColumn({ name: "requested_reviewers" })
  // repository: Member

    constructor(
      key: string,
      url: string,
      state: string,
      number: number,
      prCreatedAt: Date,
      prUpdatedAt: Date,
      repository: Repository,
      labels: string[],
      creator: Member,
      sourceMeta: object,
      title?: string,
      body?: string,
      prClosedAt?: Date,
      prMergedAt?: Date
    ) {
      super();
      this.key = key;
      this.url = url;
      this.state = state;
      this.number = number;
      this.prCreatedAt = prCreatedAt;
      this.prUpdatedAt = prUpdatedAt;
      this.repository = repository;
      this.labels = labels;
      this.creator = creator;
      this.sourceMeta = sourceMeta;
      this.title = title;
      this.body = body;
      this.prClosedAt = prClosedAt;
      this.prMergedAt = prMergedAt;
    }
}


// // Octonode Repo Pull Request Response
// // {
// //   url: https://api.github.com/repos/jbtv/iris_api/pulls/608
// //   id: 334691089
// //   node_id: MDExOlB1bGxSZXF1ZXN0MzM0NjkxMDg5
// //   html_url: https://github.com/jbtv/iris_api/pull/608
// //   diff_url: https://github.com/jbtv/iris_api/pull/608.diff
// //   patch_url: https://github.com/jbtv/iris_api/pull/608.patch
// //   issue_url: https://api.github.com/repos/jbtv/iris_api/issues/608
// //   number: 608
// //   state: open
// //   locked: false
// //   title: Video RPM API Route - API-387
// //   user: [object Object]
// //   body: API route for new Video RPM report.  The route uses the standard permissions and helper functions, calls the IMS route `/api/reports/rank/report-crm`, and returns the result. Complete with Unit tests.
// //   created_at: 2019-10-31T06:08:58Z
// //   updated_at: 2019-10-31T06:13:25Z
// //   closed_at: null
// //   merged_at: null
// //   merge_commit_sha: f8c5a0a58253952adb9fdeb4245b00803c00c2c5
// //   assignee: null
// //   assignees:
// //   requested_reviewers: [object Object],[object Object]
// //   requested_teams:
// //   labels:
// //   milestone: null
// //   commits_url: https://api.github.com/repos/jbtv/iris_api/pulls/608/commits
// //   review_comments_url: https://api.github.com/repos/jbtv/iris_api/pulls/608/comments
// //   review_comment_url: https://api.github.com/repos/jbtv/iris_api/pulls/comments{/number}
// //   comments_url: https://api.github.com/repos/jbtv/iris_api/issues/608/comments
// //   statuses_url: https://api.github.com/repos/jbtv/iris_api/statuses/3998ff5d679da82657a1eb15aeebfb1875b60031
// //   head: [object Object]
// //   base: [object Object]
// //   _links: [object Object]
// //   author_association: CONTRIBUTOR
// // }


// // Octonode get single pull request response
// // {
// //   url: https://api.github.com/repos/jbtv/iris_api/pulls/608
// //   id: 334691089
// //   node_id: MDExOlB1bGxSZXF1ZXN0MzM0NjkxMDg5
// //   html_url: https://github.com/jbtv/iris_api/pull/608
// //   diff_url: https://github.com/jbtv/iris_api/pull/608.diff
// //   patch_url: https://github.com/jbtv/iris_api/pull/608.patch
// //   issue_url: https://api.github.com/repos/jbtv/iris_api/issues/608
// //   number: 608
// //   state: open
// //   locked: false
// //   title: Video RPM API Route - API-387
// //   user: [object Object]
// //   body: API route for new Video RPM report.  The route uses the standard permissions and helper functions, calls the IMS route `/api/reports/rank/report-crm`, and returns the result. Complete with Unit tests.
// //   created_at: 2019-10-31T06:08:58Z
// //   updated_at: 2019-10-31T06:13:25Z
// //   closed_at: null
// //   merged_at: null
// //   merge_commit_sha: 464099b0d5c35f5997931ea524fedf4a0e0a4242
// //   assignee: null
// //   assignees:
// //   requested_reviewers: [object Object],[object Object]
// //   requested_teams:
// //   labels:
// //   milestone: null
// //   commits_url: https://api.github.com/repos/jbtv/iris_api/pulls/608/commits
// //   review_comments_url: https://api.github.com/repos/jbtv/iris_api/pulls/608/comments
// //   review_comment_url: https://api.github.com/repos/jbtv/iris_api/pulls/comments{/number}
// //   comments_url: https://api.github.com/repos/jbtv/iris_api/issues/608/comments
// //   statuses_url: https://api.github.com/repos/jbtv/iris_api/statuses/3998ff5d679da82657a1eb15aeebfb1875b60031
// //   head: [object Object]
// //   base: [object Object]
// //   _links: [object Object]
// //   author_association: CONTRIBUTOR
// //   merged: false
// //   mergeable: true
// //   rebaseable: true
// //   mergeable_state: blocked
// //   merged_by: null
// //   comments: 0
// //   review_comments: 0
// //   maintainer_can_modify: false
// //   commits: 4
// //   additions: 263
// //   deletions: 0
// //   changed_files: 7
// // }