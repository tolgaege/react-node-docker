import {
  Column, Entity, Index, OneToMany, ManyToOne, ManyToMany, JoinColumn
} from "typeorm";
import { Base } from "./Base";
import { Repository } from "./Repository";
import { PullRequest } from "./PullRequest";
import { PullRequestCommit } from "./PullRequestCommit";
import { Member } from "./Member";


@Entity({ name: "commit" })
export class Commit extends Base {

  @Index({ unique: true })
  @Column({ name: "sha", type: "text" })
  sha: string

  // @Column({ name: "branch", type: "text" })
  // branch: string

  @Column({ name: "date" })
  date: Date

  @Column({ name: "message", type: "text" })
  message: string

  // We need to have a @Column to make a ManyToMany not nullable
  @Column()
  repository_id: number;
  @ManyToOne(type => Repository, { onDelete: "CASCADE" })
  @JoinColumn({ name: "repository_id" })
  repository: Repository

  @OneToMany(type => PullRequestCommit, pullRequestCommit => pullRequestCommit.commit, { cascade: true })
  pullRequestCommits: PullRequestCommit[]

  @ManyToOne(type => Member, { cascade: true })
  @JoinColumn({ name: "author_member_id" })
  author: Member

  @ManyToOne(type => Member, { cascade: true })
  @JoinColumn({ name: "committer_member_id" })
  committer: Member

  constructor(sha: string, date: Date, message: string, repository: Repository, author: Member, committer: Member) { //  {//, pullRequests: PullRequest[])
    super();
    this.sha = sha;
    this.date = date;
    this.message = message;
    this.repository = repository;
    this.author = author;
    this.committer = committer;
  }
}


// // Octonode get pr commits response
// // {
// //   sha: f8e123f75f5aefe2347cdb7c8152bcac72031478
// //   node_id: MDY6Q29tbWl0MzQ2NTM0ODpmOGUxMjNmNzVmNWFlZmUyMzQ3Y2RiN2M4MTUyYmNhYzcyMDMxNDc4
// //   commit: [object Object]
// //   url: https://api.github.com/repos/jbtv/iris_api/commits/f8e123f75f5aefe2347cdb7c8152bcac72031478
// //   html_url: https://github.com/jbtv/iris_api/commit/f8e123f75f5aefe2347cdb7c8152bcac72031478
// //   comments_url: https://api.github.com/repos/jbtv/iris_api/commits/f8e123f75f5aefe2347cdb7c8152bcac72031478/comments
// //   author: [object Object]
// //   committer: [object Object]
// //   parents: [object Object]
// // }

