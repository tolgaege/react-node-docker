import {
  Column, Entity, Index, OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { Base } from "./Base";
import { RepositoryMember } from "./RepositoryMember";
import { TeamMember } from "./TeamMember";

export const DELETED_MEMBER = " (Deleted Member)";

@Entity({ name: "member" })
export class Member extends Base {

	@Index({ unique: true })
 	@Column({ name: "username", type: "text" })
 	username: string

 	@Column({ name: "avatar_url", type: "text", nullable: true })
 	avatarUrl: string | undefined

  // @Column({ name: "source_meta", type: "jsonb", select: false })
  // sourceMeta: object

 	@Column({ name: "email", type: "text", nullable: true })
 	email: string | undefined

 	@Column({ name: "name", type: "text", nullable: true })
 	name: string | undefined

  @OneToMany(type => RepositoryMember, repositoryMember => repositoryMember.member, { cascade: true })
  repositoryMembers: RepositoryMember[];

  @OneToMany(type => TeamMember, teamMember => teamMember.member, { cascade: true })
  teamMembers: TeamMember[];

  constructor(username: string, avatarUrl: string, email?: string, name?: string) {
    super();
		this.username = username;
		this.avatarUrl = avatarUrl;
    // this.sourceMeta = sourceMeta;
		this.email = email;
		this.name = name;
  }
}

// // Octonode Org Member Reponse
// // {
// //   login: 29grampian
// //   id: 17732398
// //   node_id: MDQ6VXNlcjE3NzMyMzk4
// //   avatar_url: https://avatars1.githubusercontent.com/u/17732398?v=4
// //   gravatar_id:
// //   url: https://api.github.com/users/29grampian
// //   html_url: https://github.com/29grampian
// //   followers_url: https://api.github.com/users/29grampian/followers
// //   following_url: https://api.github.com/users/29grampian/following{/other_user}
// //   gists_url: https://api.github.com/users/29grampian/gists{/gist_id}
// //   starred_url: https://api.github.com/users/29grampian/starred{/owner}{/repo}
// //   subscriptions_url: https://api.github.com/users/29grampian/subscriptions
// //   organizations_url: https://api.github.com/users/29grampian/orgs
// //   repos_url: https://api.github.com/users/29grampian/repos
// //   events_url: https://api.github.com/users/29grampian/events{/privacy}
// //   received_events_url: https://api.github.com/users/29grampian/received_events
// //   type: User
// //   site_admin: false
// // }


// // Ocotonode Repo Collaborator Response
// // {
// // 	login: blak3mill3r
// // 	id: 40848
// // 	node_id: MDQ6VXNlcjQwODQ4
// // 	avatar_url: https://avatars2.githubusercontent.com/u/40848?v=4
// // 	gravatar_id:
// // 	url: https://api.github.com/users/blak3mill3r
// // 	html_url: https://github.com/blak3mill3r
// // 	followers_url: https://api.github.com/users/blak3mill3r/followers
// // 	following_url: https://api.github.com/users/blak3mill3r/following{/other_user}
// // 	gists_url: https://api.github.com/users/blak3mill3r/gists{/gist_id}
// // 	starred_url: https://api.github.com/users/blak3mill3r/starred{/owner}{/repo}
// // 	subscriptions_url: https://api.github.com/users/blak3mill3r/subscriptions
// // 	organizations_url: https://api.github.com/users/blak3mill3r/orgs
// // 	repos_url: https://api.github.com/users/blak3mill3r/repos
// // 	events_url: https://api.github.com/users/blak3mill3r/events{/privacy}
// // 	received_events_url: https://api.github.com/users/blak3mill3r/received_events
// // 	type: User
// // 	site_admin: false
// // 	permissions: [object Object]
// // }