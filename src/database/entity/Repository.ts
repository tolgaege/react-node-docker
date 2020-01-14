import {
  Column, Entity, Index, OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { Base } from "./Base";
import { RepositoryMember } from "./RepositoryMember";
import { TeamRepository } from "./TeamRepository";
import { Organization } from "./Organization";

@Entity({ name: "repository" })
export class Repository extends Base {

  @Index({ unique: true })
  @Column({ name: "key", type: "text" })
  key: string

	@Column({ name: "name", type: "text" })
	name: string

	@Column({ name: "html_url", type: "text" })
	htmlUrl: string

	@Column({ name: "ssh_url", type: "text" })
	sshUrl: string

	@Column({ name: "clone_url", type: "text" })
	cloneUrl: string

  @ManyToOne(type => Organization, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "organization_id" })
  organization: Organization

  @Column({ name: "source_meta", type: "jsonb", select: false })
  sourceMeta: object

	@Column({ name: "description", type: "text", nullable: true })
	description: string | undefined

  @OneToMany(type => RepositoryMember, repositoryMember => repositoryMember.repository, { cascade: true })
  repositoryMembers: RepositoryMember[];

  @OneToMany(type => TeamRepository, teamRepository => teamRepository.repository, { cascade: true })
  teamRepositories: TeamRepository[];

  constructor(name: string, key: string, htmlUrl: string, sshUrl: string, cloneUrl: string, organization: Organization, sourceMeta: object, description?: string) {
    super();
    this.name = name;
    this.key = key;
    this.htmlUrl = htmlUrl;
    this.sshUrl = sshUrl;
    this.cloneUrl = cloneUrl;
    this.organization = organization;
    this.sourceMeta = sourceMeta;
    this.description = description;
  }
}


// // Octonode Response
// // {
// // 	id: 2130042
// // 	node_id: MDEwOlJlcG9zaXRvcnkyMTMwMDQy
// // 	name: jukeboxu
// // 	full_name: jbtv/jukeboxu
// // 	private: true
// // 	owner: [object Object]
// // 	html_url: https://github.com/jbtv/jukeboxu
// // 	description: Main Jukeboxu site in Rails
// // 	fork: false
// // 	url: https://api.github.com/repos/jbtv/jukeboxu
// // 	forks_url: https://api.github.com/repos/jbtv/jukeboxu/forks
// // 	keys_url: https://api.github.com/repos/jbtv/jukeboxu/keys{/key_id}
// // 	collaborators_url: https://api.github.com/repos/jbtv/jukeboxu/collaborators{/collaborator}
// // 	teams_url: https://api.github.com/repos/jbtv/jukeboxu/teams
// // 	hooks_url: https://api.github.com/repos/jbtv/jukeboxu/hooks
// // 	issue_events_url: https://api.github.com/repos/jbtv/jukeboxu/issues/events{/number}
// // 	events_url: https://api.github.com/repos/jbtv/jukeboxu/events
// // 	assignees_url: https://api.github.com/repos/jbtv/jukeboxu/assignees{/user}
// // 	branches_url: https://api.github.com/repos/jbtv/jukeboxu/branches{/branch}
// // 	tags_url: https://api.github.com/repos/jbtv/jukeboxu/tags
// // 	blobs_url: https://api.github.com/repos/jbtv/jukeboxu/git/blobs{/sha}
// // 	git_tags_url: https://api.github.com/repos/jbtv/jukeboxu/git/tags{/sha}
// // 	git_refs_url: https://api.github.com/repos/jbtv/jukeboxu/git/refs{/sha}
// // 	trees_url: https://api.github.com/repos/jbtv/jukeboxu/git/trees{/sha}
// // 	statuses_url: https://api.github.com/repos/jbtv/jukeboxu/statuses/{sha}
// // 	languages_url: https://api.github.com/repos/jbtv/jukeboxu/languages
// // 	stargazers_url: https://api.github.com/repos/jbtv/jukeboxu/stargazers
// // 	contributors_url: https://api.github.com/repos/jbtv/jukeboxu/contributors
// // 	subscribers_url: https://api.github.com/repos/jbtv/jukeboxu/subscribers
// // 	subscription_url: https://api.github.com/repos/jbtv/jukeboxu/subscription
// // 	commits_url: https://api.github.com/repos/jbtv/jukeboxu/commits{/sha}
// // 	git_commits_url: https://api.github.com/repos/jbtv/jukeboxu/git/commits{/sha}
// // 	comments_url: https://api.github.com/repos/jbtv/jukeboxu/comments{/number}
// // 	issue_comment_url: https://api.github.com/repos/jbtv/jukeboxu/issues/comments{/number}
// // 	contents_url: https://api.github.com/repos/jbtv/jukeboxu/contents/{+path}
// // 	compare_url: https://api.github.com/repos/jbtv/jukeboxu/compare/{base}...{head}
// // 	merges_url: https://api.github.com/repos/jbtv/jukeboxu/merges
// // 	archive_url: https://api.github.com/repos/jbtv/jukeboxu/{archive_format}{/ref}
// // 	downloads_url: https://api.github.com/repos/jbtv/jukeboxu/downloads
// // 	issues_url: https://api.github.com/repos/jbtv/jukeboxu/issues{/number}
// // 	pulls_url: https://api.github.com/repos/jbtv/jukeboxu/pulls{/number}
// // 	milestones_url: https://api.github.com/repos/jbtv/jukeboxu/milestones{/number}
// // 	notifications_url: https://api.github.com/repos/jbtv/jukeboxu/notifications{?since,all,participating}
// // 	labels_url: https://api.github.com/repos/jbtv/jukeboxu/labels{/name}
// // 	releases_url: https://api.github.com/repos/jbtv/jukeboxu/releases{/id}
// // 	deployments_url: https://api.github.com/repos/jbtv/jukeboxu/deployments
// // 	created_at: 2011-07-30T20:17:01Z
// // 	updated_at: 2014-11-20T21:10:09Z
// // 	pushed_at: 2013-05-09T00:35:52Z
// // 	git_url: git://github.com/jbtv/jukeboxu.git
// // 	ssh_url: git@github.com:jbtv/jukeboxu.git
// // 	clone_url: https://github.com/jbtv/jukeboxu.git
// // 	homepage: http://jukeboxu.com
// // 	svn_url: https://github.com/jbtv/jukeboxu
// // 	size: 11304
// // 	stargazers_count: 2
// // 	watchers_count: 2
// // 	language: Ruby
// // 	has_issues: true
// // 	has_projects: true
// // 	has_downloads: true
// // 	has_wiki: true
// // 	has_pages: false
// // 	forks_count: 0
// // 	mirror_url: null
// // 	archived: false
// // 	disabled: false
// // 	open_issues_count: 72
// // 	license: null
// // 	forks: 0
// // 	open_issues: 72
// // 	watchers: 2
// // 	default_branch: develop
// // 	permissions: [object Object]
// // }