import {
  Column, Entity, Index, OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { Base } from "./Base";

import { User } from "./User";

@Entity({ name: "organization" })
export class Organization extends Base {

    @Index({ unique: true })
    @Column({ name: "key", type: "text" })
    key: string

    @Column({ name: "url", type: "text" })
    url: string

    @Column({ name: "avatar_url", type: "text" })
    avatarUrl: string

    @Column({ name: "source_meta", type: "jsonb", select: false })
    sourceMeta: object

    @Column({ name: "email", type: "text" , nullable: true})
    email: string | undefined

    @Column({ name: "description", type: "text", nullable: true})
    description: string | undefined

    @Column({ name: "name", type: "text", nullable: true})
    name: string | undefined

    @Column({ name: "company", type: "text", nullable: true})
    company: string | undefined

    @Column({ name: "blog", type: "text", nullable: true})
    blog: string | undefined

    @Column({ name: "location", type: "text", nullable: true})
    location: string | undefined

    @Column({ name: "type", type: "text", nullable: true})
    type: string | undefined

    // We need to have a @Column to make a ManyToMany not nullable
    @Column()
    user_id: number;
    @ManyToOne(type => User, { onDelete: "CASCADE"})
    @JoinColumn({ name: "user_id" })
    user: User

    // // TODO: needs check (repos type??? definitely not text)
    // @OneToMany(type => Photo, photo => photo.user)
    // photos: Photo[];
    // @OneToMany(() => ExpansionEntity, (expansion) => expansion.user)
    // expansions: ExpansionEntity[]
    // @OneToMany({ name: "repos", type: "text" })
    // name: string | undefined

    constructor(key: string, url: string, avatarUrl: string, sourceMeta: object, user: User, email?: string, description?: string, company?: string, blog?: string, location?: string, type?: string, name?: string) {
      super();
      this.key = key;
      this.url = url;
      this.email = email;
      this.avatarUrl = avatarUrl;
      this.user = user;
      this.description = description;
      this.company = company;
      this.blog = blog;
      this.location = location;
      this.type = type;
      this.name = name;
      this.sourceMeta = sourceMeta;
    }
}

// octonode reponse
// {
// 	login: jbtv
// 	id: 949007
// 	node_id: MDEyOk9yZ2FuaXphdGlvbjk0OTAwNw==
// 	url: https://api.github.com/orgs/jbtv
// 	repos_url: https://api.github.com/orgs/jbtv/repos
// 	events_url: https://api.github.com/orgs/jbtv/events
// 	hooks_url: https://api.github.com/orgs/jbtv/hooks
// 	issues_url: https://api.github.com/orgs/jbtv/issues
// 	members_url: https://api.github.com/orgs/jbtv/members{/member}
// 	public_members_url: https://api.github.com/orgs/jbtv/public_members{/member}
// 	avatar_url: https://avatars2.githubusercontent.com/u/949007?v=4
// 	description: null
// 	name: null
// 	company: null
// 	blog: iris.tv
// 	location: Los Angeles
// 	email: null
// 	is_verified: false
// 	has_organization_projects: true
// 	has_repository_projects: true
// 	public_repos: 17
// 	public_gists: 0
// 	followers: 0
// 	following: 0
// 	html_url: https://github.com/jbtv
// 	created_at: 2011-07-30T19:46:40Z
// 	updated_at: 2019-09-28T21:13:23Z
// 	type: Organization
// 	total_private_repos: 111
// 	owned_private_repos: 111
// 	private_gists: 0
// 	disk_usage: 3201900
// 	collaborators: 16
// 	billing_email: hello@jukeboxtelevision.com
// 	default_repository_permission: none
// 	members_can_create_repositories: false
// 	two_factor_requirement_enabled: false
// 	plan: [object Object]
// }