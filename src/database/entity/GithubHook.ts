import {
  Column, Entity, Index
} from "typeorm";
import { Base } from "./Base";

@Entity({ name: "github_hook" })
export class GithubHook extends Base {
  @Column({ name: "event", type: "text" })
  event: string

  @Column({ name: "archived", type: "bool" })
  archived: boolean

  @Column({ name: "source_meta", type: "jsonb" })
  sourceMeta: object

  constructor(archived: boolean, event: string, sourceMeta: object) {
    super();
    this.archived = archived;
    this.event = event;
    this.sourceMeta = sourceMeta;
  }
}
