import {
  Column, Entity, Index, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Base } from "./Base";
import { Repository } from "./Repository";
import { Member } from "./Member";

// We can not exten Base since primary key should not be id, but (member_id / repository_id)
@Entity({ name: "repository__member" })
export class RepositoryMember {
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @ManyToOne(type => Repository, repository => repository.repositoryMembers, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "repository_id" })
  repository: Repository;

  @ManyToOne(type => Member, member => member.repositoryMembers, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member: Member;

  constructor(repository: Repository, member: Member) {
    this.member = member;
    this.repository = repository;
  }
}
