import {
  Column, Entity, Index, OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { Base } from "./Base";
import { TeamMember } from "./TeamMember";
import { TeamRepository } from "./TeamRepository";
import { Organization } from "./Organization";

export const DEFAULT_TEAM = "-default-team";

@Entity({ name: "team" })
export class Team extends Base {

  @Index({ unique: true })
  @Column({ name: "key", type: "text" })
  key: string

  @Column({ name: "name", type: "text" })
  name: string

  @Column({ name: "slug", type: "text" })
  slug: string

  @Column({ name: "description", type: "text", nullable: true})
  description: string | undefined

  @ManyToOne(type => Organization, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organization_id" })
  organization: Organization

  @Column({ name: "source_meta", type: "jsonb", select: false })
  sourceMeta: object

  @OneToMany(type => TeamMember, teamMember => teamMember.team, { cascade: true })
  teamMembers: TeamMember[];

  @OneToMany(type => TeamRepository, teamRepository => teamRepository.team, { cascade: true })
  teamRepositories: TeamRepository[];

  constructor(name: string, key: string, slug: string, organization: Organization, sourceMeta: object, description?: string) {
    super();

    this.name = name;
    this.key = key;
    this.slug = slug;
    this.description = description;
    this.organization = organization;
    this.sourceMeta = sourceMeta;
  }
}

// [{
// "name":"Founders",
// "id":3549496,
// "node_id":"MDQ6VGVhbTM1NDk0OTY=",
// "slug":"founders",
// "description":"We own this shit",
// "privacy":"closed",
// "url":"https://api.github.com/teams/3549496",
// "html_url":"https://github.com/orgs/usehaystack/teams/founders",
// "members_url":"https://api.github.com/teams/3549496/members{/member}",
// "repositories_url":"https://api.github.com/teams/3549496/repos",
// "permission":"pull",
// "parent":null}]
