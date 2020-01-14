import {
  BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn,
} from "typeorm";

export abstract class Base extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    id: number

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}
