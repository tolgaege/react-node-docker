import {
  Column, Entity, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Base } from "./Base";
import { Repository } from "./Repository";
import { Team } from "./Team";

// We can not exten Base since primary key should not be id, but (team_id / repository_id)
@Entity({ name: "team__repository" })
export class TeamRepository {
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @ManyToOne(type => Repository, repository => repository.teamRepositories, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "repository_id" })
  repository: Repository;

  @ManyToOne(type => Team, team => team.teamRepositories, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "team_id" })
  team: Team;

  constructor(team: Team, repository: Repository) {
    this.team = team;
    this.repository = repository;
  }
}
