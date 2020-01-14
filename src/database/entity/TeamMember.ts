import {
  Column, Entity, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Base } from "./Base";
import { Team } from "./Team";
import { Member } from "./Member";

// We can not exten Base since primary key should not be id, but (member_id / team_id)
@Entity({ name: "team__member" })
export class TeamMember {
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @ManyToOne(type => Team, team => team.teamMembers, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "team_id" })
  team: Team;

  @ManyToOne(type => Member, member => member.teamMembers, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member: Member;

  constructor(team: Team, member: Member) {
    this.member = member;
    this.team = team;
  }
}
