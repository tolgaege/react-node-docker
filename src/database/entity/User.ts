import {
  Column, Entity, Index, OneToMany,
} from "typeorm";
import { Base } from "./Base";

// Never change the order. Never delete without migration. Ok to add values to the end. Ok to rename
export enum AccessLevel {
    Administrator,
    User,
}

@Entity({ name: "user" })
export class User extends Base {
    @Index({ unique: true })
    @Column({ name: "username", type: "text" })
    username: string

    @Index({ unique: true })
    @Column({ name: "installation_id", type: "integer" })
    installationId: number

    @Column({ name: "name", type: "text", nullable: true })
    name: string | undefined

    @Column({ name: "email", type: "text", nullable: true })
    email: string | undefined


    // @Column({name: 'company', type: 'text', nullable: true})
    // company: string | undefined

    @Column({
      name: "access_level", type: "enum", enum: AccessLevel, default: AccessLevel.User,
    })
    accessLevel: AccessLevel

    constructor(username: string, installationId: number, name?: string, email?: string, accessLevel?: AccessLevel) {
      super();
      this.username = username;
      this.name = name;
      this.accessLevel = accessLevel;
      this.email = email;
      this.installationId = installationId;
    }
}
