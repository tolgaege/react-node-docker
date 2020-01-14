import {
  Column, Entity, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Base } from "./Base";
import { PullRequest } from "./PullRequest";
import { Commit } from "./Commit";

// We can not exten Base since primary key should not be id, but (commit_id / pullrequest_id)
@Entity({ name: "pull_request__commit" })
export class PullRequestCommit {
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @ManyToOne(type => PullRequest, pullRequest => pullRequest.pullRequestCommits, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "pull_request_id" })
  pullRequest: PullRequest;

  @ManyToOne(type => Commit, commit => commit.pullRequestCommits, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "commit_id" })
  commit: Commit;

  constructor(pullRequest: PullRequest, commit: Commit) {
    this.commit = commit;
    this.pullRequest = pullRequest;
  }
}
